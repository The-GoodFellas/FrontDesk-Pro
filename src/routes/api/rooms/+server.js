import { json } from '@sveltejs/kit';
import { initSchema, cleanupPastBookings } from '$lib/db.js';
import { rooms as baseRooms } from '$lib/rooms.js';

function includesToday(b) {
  const today = new Date().toISOString().slice(0,10);
  return b.check_in_date <= today && b.check_out_date >= today;
}

export async function GET({ locals }) {
  initSchema();
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  cleanupPastBookings();
  const { default: db } = await import('$lib/db.js');
  const bookings = db.prepare('SELECT * FROM bookings').all();
  // Use monotonically increasing id to determine true order of actions
  const activity = db.prepare('SELECT * FROM room_activity ORDER BY id ASC').all();

  const latestActionByRoom = new Map();
  for (const a of activity) {
    latestActionByRoom.set(a.room_number, a.action);
  }

  const bookingsByRoom = new Map();
  for (const b of bookings) {
    const arr = bookingsByRoom.get(b.room_number) || [];
    arr.push(b);
    bookingsByRoom.set(b.room_number, arr);
  }

  const rooms = baseRooms.map(r => {
    const bArr = bookingsByRoom.get(r.number) || [];
    const hasBookingToday = bArr.some(includesToday);

    // Derive status with clear precedence
    let status = 'Available';
    const last = latestActionByRoom.get(r.number);

    // Precedence: explicit recent actions override booking-derived status
    if (last === 'check_in') {
      status = 'Occupied';
    } else if (last === 'check_out' || last === 'cancel') {
      // A recent checkout/cancel should mark the room Available even if a booking record still spans today
      status = 'Available';
    } else if (hasBookingToday) {
      // If room has an active booking today and isn’t currently occupied
      status = 'Reserved';
    } else {
      status = r.status || 'Available';
    }
    return { ...r, status };
  });

  return json({ rooms });
}
