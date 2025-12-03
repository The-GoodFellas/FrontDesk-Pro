import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('db', 'frontdesk.sqlite');
const db = new Database(dbPath);

export function initSchema() {
  const schema = `
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_number TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    check_in_date TEXT NOT NULL,
    check_out_date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS room_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_number TEXT NOT NULL,
    action TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    occurred_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  `;
  db.exec(schema);
}

export function insertBooking({ room_number, guest_name, check_in_date, check_out_date }) {
  const stmt = db.prepare(
    'INSERT INTO bookings (room_number, guest_name, check_in_date, check_out_date) VALUES (?, ?, ?, ?)'
  );
  const info = stmt.run(room_number, guest_name, check_in_date, check_out_date);
  return info.lastInsertRowid;
}

export function logRoomActivity({ room_number, action, actor_name }) {
  const stmt = db.prepare(
    'INSERT INTO room_activity (room_number, action, actor_name) VALUES (?, ?, ?)'
  );
  const info = stmt.run(room_number, action, actor_name);
  return info.lastInsertRowid;
}

export default db;
