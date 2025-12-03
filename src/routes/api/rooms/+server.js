import { json } from '@sveltejs/kit';
import { initSchema } from '$lib/db.js';
import { rooms as baseRooms } from '$lib/rooms.js';

function includesToday(b) {
  const today = new Date().toISOString().slice(0,10);
  return b.check_in_date <= today && b.check_out_date >= today;
}

export async function GET() {
  initSchema();
  const { default: db } = await import('$lib/db.js');
  const bookings = db.prepare('SELECT * FROM bookings').all();
  const activity = db.prepare('SELECT * FROM room_activity ORDER BY occurred_at ASC').all();

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
    let status = r.status;
    const last = latestActionByRoom.get(r.number);
    if (last === 'check_in') status = 'Occupied';
    else if (last === 'check_out') status = 'Available';

    const bArr = bookingsByRoom.get(r.number) || [];
    const hasBookingToday = bArr.some(includesToday);
    // Booking marks Reserved unless the latest explicit action is a checkout,
    // in which case we honor Available.
    if (hasBookingToday && status !== 'Occupied' && last !== 'check_out') {
      status = 'Reserved';
    }
    return { ...r, status };
  });

  return json({ rooms });
}
