import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';

const dbPath = path.resolve('db', 'frontdesk.sqlite');
const db = new Database(dbPath);

export function initSchema(database = null) {
  const targetDb = database || db;
  const schema = `
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_number TEXT NOT NULL,
    guest_name TEXT NOT NULL,
    check_in_date TEXT NOT NULL,
    check_out_date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_unique_window
    ON bookings (room_number, check_in_date, check_out_date);
  CREATE TABLE IF NOT EXISTS room_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_number TEXT NOT NULL,
    action TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    occurred_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS rooms_status (
    room_number TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'STAFF',
    email TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  `;
  targetDb.exec(schema);

  // Seed an admin user if none exist
  const count = targetDb.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (count === 0) {
    const hash = bcrypt.hashSync('admin123', 10);
    targetDb.prepare('INSERT INTO users (username, password_hash, role, email) VALUES (?, ?, ?, ?)')
      .run('admin', hash, 'ADMIN', 'admin@example.com');
    const staffHash = bcrypt.hashSync('test1234', 10);
    targetDb.prepare('INSERT INTO users (username, password_hash, role, email) VALUES (?, ?, ?, ?)')
      .run('staff', staffHash, 'STAFF', 'staff@example.com');
  }
}

export function insertBooking({ room_number, guest_name, check_in_date, check_out_date }, database = null) {
  const targetDb = database || db;
  const stmt = targetDb.prepare(
    'INSERT INTO bookings (room_number, guest_name, check_in_date, check_out_date) VALUES (?, ?, ?, ?)'
  );
  const info = stmt.run(room_number, guest_name, check_in_date, check_out_date);
  return info.lastInsertRowid;
}

export function logRoomActivity({ room_number, action, actor_name }, database = null) {
  const targetDb = database || db;
  const stmt = targetDb.prepare(
    'INSERT INTO room_activity (room_number, action, actor_name) VALUES (?, ?, ?)'
  );
  const info = stmt.run(room_number, action, actor_name);
  return info.lastInsertRowid;
}

export function setRoomStatusDB(room_number, status, database = null) {
  const targetDb = database || db;
  const upsert = targetDb.prepare(`INSERT INTO rooms_status (room_number, status)
    VALUES (?, ?)
    ON CONFLICT(room_number) DO UPDATE SET status=excluded.status, updated_at=datetime('now')`);
  upsert.run(room_number, status);
}

export function cleanupPastBookings(database = null) {
  // Remove bookings whose check_out_date is strictly before today
  const targetDb = database || db;
  const today = new Date().toISOString().slice(0,10);
  const del = targetDb.prepare('DELETE FROM bookings WHERE check_out_date < ?');
  del.run(today);
}

export default db;
