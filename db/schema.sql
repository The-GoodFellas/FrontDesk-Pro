CREATE DATABASE hotel_booking_db;
USE hotel_booking_db;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN','STAFF') NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guests (
    guest_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL UNIQUE,
    room_type VARCHAR(50) NOT NULL,
    status ENUM('AVAILABLE','OCCUPIED','OUT_OF_SERVICE') NOT NULL DEFAULT 'AVAILABLE',
    price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT NOT NULL,
    room_id INT NOT NULL,
    created_by_user_id INT NOT NULL,
    status ENUM('PENDING','CONFIRMED','CANCELLED','CHECKED_IN','CHECKED_OUT') NOT NULL DEFAULT 'PENDING',
    check_in_timestamp DATETIME NOT NULL,
    check_out_timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_res_guest FOREIGN KEY (guest_id) REFERENCES guests(guest_id),
    CONSTRAINT fk_res_room FOREIGN KEY (room_id) REFERENCES rooms(room_id),
    CONSTRAINT fk_res_user FOREIGN KEY (created_by_user_id) REFERENCES users(user_id)
);

CREATE TABLE ledger_entries (
    entry_id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    entry_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    note VARCHAR(255),
    CONSTRAINT fk_ledger_res FOREIGN KEY (reservation_id) REFERENCES reservations(reservation_id)
);

-- SQLite-compatible simple tables for app persistence
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
    action TEXT NOT NULL, -- 'check_in' | 'check_out'
    actor_name TEXT NOT NULL,
    occurred_at TEXT NOT NULL DEFAULT (datetime('now'))
);