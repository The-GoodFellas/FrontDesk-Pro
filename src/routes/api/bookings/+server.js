import { json } from '@sveltejs/kit';
import { initSchema, insertBooking, logRoomActivity, setRoomStatusDB } from '$lib/db.js';
import { setRoomStatus } from '$lib/rooms.js';

export async function POST({ request }) {
  initSchema();
  const body = await request.json();
  const { room_number, guest_name, check_in_date, check_out_date } = body;
  if (!room_number || !guest_name || !check_in_date || !check_out_date) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }
  const id = insertBooking({ room_number, guest_name, check_in_date, check_out_date });
  // Immediately reflect reservation in room status and activity log
  setRoomStatus(room_number, 'Reserved');
  setRoomStatusDB(room_number, 'Reserved');
  logRoomActivity({ room_number, action: 'reserve', actor_name: guest_name });
  return json({ id });
}

export async function GET() {
  initSchema();
  // Return latest 50 bookings
  const { default: db } = await import('$lib/db.js');
  const rows = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 50').all();
  return json({ bookings: rows });
}
