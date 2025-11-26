USE hotel_booking_db;

INSERT INTO users (username, password_hash, role, email)
VALUES
('admin', 'admin123hash', 'ADMIN', 'admin@hotel.com'),
('staff1', 'staff123hash', 'STAFF', 'staff1@hotel.com');

INSERT INTO guests (full_name, phone, email, address)
VALUES
('Alex Johnson', '555-1001', 'alex@example.com', '123 Main St'),
('Sarah Lee', '555-2002', 'sarah@example.com', '45 Oak Avenue'),
('Michael Chen', '555-3003', 'mchen@example.com', '89 Sunset Blvd');

INSERT INTO rooms (room_number, room_type, status, price, is_available)
VALUES
('101', 'Standard', 'AVAILABLE', 89.99, TRUE),
('102', 'Deluxe', 'AVAILABLE', 129.00, TRUE),
('201', 'Suite', 'OUT_OF_SERVICE', 249.00, FALSE),
('202', 'Standard', 'AVAILABLE', 95.00, TRUE);

INSERT INTO reservations (
    guest_id,
    room_id,
    created_by_user_id,
    status,
    check_in_timestamp,
    check_out_timestamp
)
VALUES
(1, 1, 1, 'CONFIRMED', '2025-12-20 15:00:00', '2025-12-22 11:00:00');

INSERT INTO ledger_entries (reservation_id, amount, note)
VALUES
(1, 179.98, '2-night stay for Room 101');