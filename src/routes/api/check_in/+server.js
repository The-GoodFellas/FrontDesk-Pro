import { json } from '@sveltejs/kit';
import { initSchema, logRoomActivity, setRoomStatusDB } from '$lib/db.js';
import { setRoomStatus } from '$lib/rooms.js';

export async function POST({ request, locals }) {
  initSchema();
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { room_number, actor_name, allow_fuzzy } = body;
  if (!room_number || !actor_name) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Verify there is a booking for this room under the same guest name
  // and that the booking covers today. First try case-insensitive exact match.
  const { default: db } = await import('$lib/db.js');
  // normalize input
  const normInput = (s) => String(s || '').toLowerCase().trim().replace(/\s+/g, ' ');
  const searchName = normInput(actor_name);

  // Try normalized exact match first (case-insensitive, trimmed)
  let booking = db
    .prepare(
      `SELECT * FROM bookings WHERE room_number = ? AND date(check_in_date) <= date('now') AND date(check_out_date) >= date('now')`
    )
    .all(room_number)
    .find(r => normInput(r.guest_name) === searchName);

  // If no exact match and fuzzy allowed, try fuzzy/partial matching against today's bookings for the room
  if (!booking && allow_fuzzy) {
    const rows = db
      .prepare(`SELECT * FROM bookings WHERE room_number = ? AND date(check_in_date) <= date('now') AND date(check_out_date) >= date('now')`)
      .all(room_number);

    const norm = (s) => String(s || '').toLowerCase().trim().replace(/\s+/g, ' ');

    // simple substring check first (partial match / nickname)
    const target = norm(actor_name);
    booking = rows.find(r => norm(r.guest_name).includes(target) || target.includes(norm(r.guest_name)));

    // if still not found, fall back to Levenshtein distance threshold
    if (!booking && rows.length) {
      const levenshtein = (a, b) => {
        const m = a.length, n = b.length;
        if (m === 0) return n;
        if (n === 0) return m;
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1));
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        for (let i = 1; i <= m; i++) {
          for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
          }
        }
        return dp[m][n];
      };

      let best = { row: null, score: Infinity };
      for (const r of rows) {
        const name = norm(r.guest_name);
        const dist = levenshtein(name, target);
        const maxLen = Math.max(name.length, target.length) || 1;
        const ratio = dist / maxLen;
        // accept if small absolute distance or relatively small ratio
        if (dist <= 2 || ratio <= 0.35) {
          if (ratio < best.score) best = { row: r, score: ratio };
        }
      }
      if (best.row) booking = best.row;
    }
  }

  if (!booking) {
    try {
      const rowsForRoom = db.prepare('SELECT id, room_number, guest_name, check_in_date, check_out_date FROM bookings WHERE room_number = ? ORDER BY created_at DESC LIMIT 10').all(room_number);
      console.log('check_in: no booking match', { room_number, actor_name, allow_fuzzy, suggestions: rowsForRoom.map(r => r.guest_name) });
      return json({ error: 'No matching reservation found for this name and room', found: rowsForRoom }, { status: 403 });
    } catch (e) {
      console.log('check_in: error fetching suggestions', e, { room_number, actor_name });
      return json({ error: 'No matching reservation found for this name and room' }, { status: 403 });
    }
  }

  setRoomStatus(room_number, 'Occupied');
  setRoomStatusDB(room_number, 'Occupied');
  const id = logRoomActivity({ room_number, action: 'check_in', actor_name });
  return json({ id });
}
