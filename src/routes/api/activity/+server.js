import { json } from '@sveltejs/kit';
import { initSchema } from '$lib/db.js';

export async function GET({ locals }) {
  initSchema();
  if (!locals.user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { default: db } = await import('$lib/db.js');
  const rows = db.prepare('SELECT * FROM room_activity ORDER BY occurred_at DESC LIMIT 100').all();
  return json({ activity: rows });
}
