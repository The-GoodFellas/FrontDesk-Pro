import { json } from '@sveltejs/kit';
import { initSchema, logRoomActivity } from '$lib/db.js';
import { setRoomStatus } from '$lib/rooms.js';

export async function POST({ request }) {
  initSchema();
  const body = await request.json();
  const { room_number, actor_name } = body;
  if (!room_number || !actor_name) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }
  setRoomStatus(room_number, 'Occupied');
  const id = logRoomActivity({ room_number, action: 'check_in', actor_name });
  return json({ id });
}
