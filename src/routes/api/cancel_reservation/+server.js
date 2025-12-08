import { json } from '@sveltejs/kit';
import { initSchema, logRoomActivity, setRoomStatusDB } from '$lib/db.js';
import { setRoomStatus } from '$lib/rooms.js';

export async function POST({ request, locals }) {
  initSchema();
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const { room_number, actor_name, booking_id } = body;
  if (!room_number || !actor_name) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { default: db } = await import('$lib/db.js');
  // If booking_id provided, delete that booking; otherwise delete bookings overlapping today for the room
  let changes = 0;
  if (booking_id) {
    const del = db.prepare('DELETE FROM bookings WHERE id = ? AND room_number = ?');
    const info = del.run(booking_id, room_number);
    changes = info.changes;
  } else {
    const today = new Date().toISOString().slice(0,10);
    const del = db.prepare(`DELETE FROM bookings
      WHERE room_number = ? AND NOT (check_out_date < ? OR check_in_date > ?)`);
    const info = del.run(room_number, today, today);
    changes = info.changes;
  }

  // Reflect cancellation immediately
  setRoomStatus(room_number, 'Available');
  setRoomStatusDB(room_number, 'Available');
  const activityId = logRoomActivity({ room_number, action: 'cancel', actor_name });

  return json({ cancelled_bookings: changes, activity_id: activityId });
}
