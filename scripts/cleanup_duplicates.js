import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('db', 'frontdesk.sqlite');
const db = new Database(dbPath);

function getDuplicateGroups() {
  return db.prepare(`
    SELECT room_number, check_in_date, check_out_date
    FROM bookings
    GROUP BY room_number, check_in_date, check_out_date
    HAVING COUNT(*) > 1
  `).all();
}

function cleanup() {
  const groups = getDuplicateGroups();
  let deleted = 0;
  groups.forEach(g => {
    const rows = db.prepare(`
      SELECT id
      FROM bookings
      WHERE room_number = ? AND check_in_date = ? AND check_out_date = ?
      ORDER BY created_at ASC, id ASC
    `).all(g.room_number, g.check_in_date, g.check_out_date);
    // Keep the first (oldest) record, delete the rest
    const toDelete = rows.slice(1).map(r => r.id);
    toDelete.forEach(id => {
      db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
      deleted += 1;
    });
  });
  console.log(`Duplicate cleanup complete. Deleted ${deleted} records.`);
}

cleanup();
