import { json } from '@sveltejs/kit';
import { initSchema, insertBooking, logRoomActivity, setRoomStatusDB, cleanupPastBookings } from '$lib/db.js';
import { setRoomStatus } from '$lib/rooms.js';

export async function POST({ request, locals }) {
  initSchema();
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { room_number, guest_name, check_in_date, check_out_date } = body;
  if (!room_number || !guest_name || !check_in_date || !check_out_date) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }
  const id = insertBooking({ room_number, guest_name, check_in_date, check_out_date });
  // Log reservation activity for audit trail, but do not mark room
  // as Reserved immediately. Room remains Available until the
  // reservation's check-in date begins (12:00 AM).
  logRoomActivity({ room_number, action: 'reserve', actor_name: guest_name });
  return json({ id });
}

export async function GET({ locals }) {
  initSchema();
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  cleanupPastBookings();
  // Return latest 50 bookings
  const { default: db } = await import('$lib/db.js');
  const rows = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 50').all();
  return json({ bookings: rows });
}
