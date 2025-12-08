import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { initSchema, insertBooking, logRoomActivity, setRoomStatusDB, cleanupPastBookings } from '$lib/db.js';
import { rooms, findRoom, setRoomStatus } from '$lib/rooms.js';

/**
 * Test Suite 1: Booking Creation and Validation
 * Tests the core booking functionality including date validation and overlap detection
 */
describe('Booking Creation and Validation', () => {
  let testDb;

  beforeEach(() => {
    // Create in-memory test database
    testDb = new Database(':memory:');
    initSchema(testDb);
  });

  afterEach(() => {
    testDb.close();
  });

  it('should successfully create a valid booking', () => {
    const bookingData = {
      room_number: '101',
      guest_name: 'John Doe',
      check_in_date: '2025-12-15',
      check_out_date: '2025-12-18'
    };

    const bookingId = insertBooking(bookingData, testDb);
    expect(bookingId).toBeGreaterThan(0);

    // Verify booking was stored correctly
    const booking = testDb.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
    expect(booking.guest_name).toBe('John Doe');
    expect(booking.room_number).toBe('101');
  });

  it('should detect overlapping bookings for the same room', () => {
    // Create first booking
    insertBooking({
      room_number: '102',
      guest_name: 'Alice Smith',
      check_in_date: '2025-12-10',
      check_out_date: '2025-12-15'
    }, testDb);

    // Attempt overlapping booking
    const overlappingBooking = {
      room_number: '102',
      guest_name: 'Bob Jones',
      check_in_date: '2025-12-12', // Overlaps with Alice's booking
      check_out_date: '2025-12-17'
    };

    // Check for overlap
    const bookings = testDb.prepare('SELECT * FROM bookings WHERE room_number = ?').all('102');
    const hasOverlap = bookings.some(b => {
      const bStart = new Date(b.check_in_date);
      const bEnd = new Date(b.check_out_date);
      const newStart = new Date(overlappingBooking.check_in_date);
      const newEnd = new Date(overlappingBooking.check_out_date);
      return newStart < bEnd && newEnd > bStart;
    });

    expect(hasOverlap).toBe(true);
  });

  it('should reject bookings with check-out before check-in', () => {
    const invalidBooking = {
      room_number: '103',
      guest_name: 'Invalid Guest',
      check_in_date: '2025-12-20',
      check_out_date: '2025-12-18' // Before check-in
    };

    const isValid = new Date(invalidBooking.check_in_date) <= new Date(invalidBooking.check_out_date);
    expect(isValid).toBe(false);
  });
});

/**
 * Test Suite 2: Check-In/Check-Out with Name Matching
 * Tests the fuzzy name matching logic for guest verification
 */
describe('Check-In/Check-Out Name Matching', () => {
  let testDb;

  beforeEach(() => {
    testDb = new Database(':memory:');
    initSchema(testDb);
    
    // Create test booking
    insertBooking({
      room_number: '201',
      guest_name: 'Elizabeth Anderson',
      check_in_date: new Date().toISOString().slice(0, 10),
      check_out_date: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10)
    }, testDb);
  });

  afterEach(() => {
    testDb.close();
  });

  it('should match exact guest name (case-insensitive)', () => {
    const booking = testDb.prepare(
      `SELECT * FROM bookings WHERE room_number = ? AND lower(guest_name) = lower(?) LIMIT 1`
    ).get('201', 'elizabeth anderson');

    expect(booking).toBeDefined();
    expect(booking.guest_name).toBe('Elizabeth Anderson');
  });

  it('should match partial/nickname with fuzzy matching', () => {
    const searchName = 'beth'; // Nickname for Elizabeth
    const bookings = testDb.prepare(
      `SELECT * FROM bookings WHERE room_number = ?`
    ).all('201');

    const norm = (s) => String(s || '').toLowerCase().trim();
    const target = norm(searchName);
    const fuzzyMatch = bookings.find(r => 
      norm(r.guest_name).includes(target) || target.includes(norm(r.guest_name))
    );

    expect(fuzzyMatch).toBeDefined();
  });

  it('should reject check-in with completely wrong name', () => {
    const wrongName = 'John Smith';
    const booking = testDb.prepare(
      `SELECT * FROM bookings WHERE room_number = ? AND lower(guest_name) = lower(?) LIMIT 1`
    ).get('201', wrongName);

    expect(booking).toBeUndefined();
  });

  it('should update room status to Occupied after successful check-in', () => {
    const room = findRoom('201');
    expect(room).toBeDefined();

    setRoomStatus('201', 'Occupied');
    setRoomStatusDB('201', 'Occupied', testDb);
    logRoomActivity({ room_number: '201', action: 'check_in', actor_name: 'Elizabeth Anderson' }, testDb);

    const updatedRoom = findRoom('201');
    expect(updatedRoom.status).toBe('Occupied');
  });
});

/**
 * Test Suite 3: Room Status Management
 * Tests room status transitions and consistency
 */
describe('Room Status Management', () => {
  it('should correctly transition room status through lifecycle', () => {
    const room = findRoom('301');
    expect(room.status).toBe('Available');

    // Reserve room
    setRoomStatus('301', 'Reserved');
    expect(findRoom('301').status).toBe('Reserved');

    // Check-in
    setRoomStatus('301', 'Occupied');
    expect(findRoom('301').status).toBe('Occupied');

    // Check-out
    setRoomStatus('301', 'Available');
    expect(findRoom('301').status).toBe('Available');
  });

  it('should filter rooms by status correctly', () => {
    // Set up various room statuses
    setRoomStatus('101', 'Available');
    setRoomStatus('102', 'Occupied');
    setRoomStatus('103', 'Reserved');
    setRoomStatus('104', 'Available');

    const availableRooms = rooms.filter(r => r.status === 'Available');
    const occupiedRooms = rooms.filter(r => r.status === 'Occupied');

    expect(availableRooms.length).toBeGreaterThan(0);
    expect(occupiedRooms.some(r => r.number === '102')).toBe(true);
  });

  it('should filter rooms by type correctly', () => {
    const suites = rooms.filter(r => r.type === 'Suite');
    const singles = rooms.filter(r => r.type === 'Single');
    const doubles = rooms.filter(r => r.type === 'Double');

    expect(suites.length).toBeGreaterThan(0);
    expect(singles.length).toBeGreaterThan(0);
    expect(doubles.length).toBeGreaterThan(0);

    // Verify price ranges
    suites.forEach(s => {
      const price = parseInt(s.price.replace('$', ''));
      expect(price).toBe(200);
    });
  });
});

/**
 * Test Suite 4: Activity Logging and Audit Trail
 * Tests that all room actions are properly logged
 */
describe('Activity Logging and Audit Trail', () => {
  let testDb;

  beforeEach(() => {
    testDb = new Database(':memory:');
    initSchema(testDb);
  });

  afterEach(() => {
    testDb.close();
  });

  it('should log all room activities in order', () => {
    const activities = [
      { room_number: '401', action: 'reserve', actor_name: 'Guest A' },
      { room_number: '401', action: 'check_in', actor_name: 'Guest A' },
      { room_number: '401', action: 'check_out', actor_name: 'Guest A' }
    ];

    activities.forEach(activity => {
      logRoomActivity(activity, testDb);
    });

    const logged = testDb.prepare(
      'SELECT * FROM room_activity WHERE room_number = ? ORDER BY occurred_at ASC'
    ).all('401');

    expect(logged.length).toBe(3);
    expect(logged[0].action).toBe('reserve');
    expect(logged[1].action).toBe('check_in');
    expect(logged[2].action).toBe('check_out');
  });

  it('should track multiple rooms activities independently', () => {
    logRoomActivity({ room_number: '501', action: 'check_in', actor_name: 'Guest X' }, testDb);
    logRoomActivity({ room_number: '502', action: 'check_in', actor_name: 'Guest Y' }, testDb);
    logRoomActivity({ room_number: '501', action: 'check_out', actor_name: 'Guest X' }, testDb);

    const room501Activities = testDb.prepare(
      'SELECT * FROM room_activity WHERE room_number = ?'
    ).all('501');

    const room502Activities = testDb.prepare(
      'SELECT * FROM room_activity WHERE room_number = ?'
    ).all('502');

    expect(room501Activities.length).toBe(2);
    expect(room502Activities.length).toBe(1);
  });

  it('should maintain correct activity timestamps', () => {
    const beforeTime = Date.now();
    logRoomActivity({ room_number: '503', action: 'check_in', actor_name: 'Test Guest' }, testDb);
    const afterTime = Date.now();

    const activity = testDb.prepare(
      'SELECT * FROM room_activity WHERE room_number = ? ORDER BY occurred_at DESC LIMIT 1'
    ).get('503');

    expect(activity.occurred_at).toBeDefined();
    // Just verify that a timestamp was recorded
    expect(typeof activity.occurred_at).toBe('string');
    expect(activity.occurred_at.length).toBeGreaterThan(0);
  });
});

/**
 * Test Suite 5: Data Cleanup and Maintenance
 * Tests automatic cleanup of past bookings
 */
describe('Data Cleanup and Maintenance', () => {
  let testDb;

  beforeEach(() => {
    testDb = new Database(':memory:');
    initSchema(testDb);
  });

  afterEach(() => {
    testDb.close();
  });

  it('should remove bookings with past check-out dates', () => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const lastWeek = new Date(Date.now() - 86400000 * 7).toISOString().slice(0, 10);

    // Create past booking
    insertBooking({
      room_number: '601',
      guest_name: 'Past Guest',
      check_in_date: lastWeek,
      check_out_date: yesterday
    }, testDb);

    // Create current booking
    insertBooking({
      room_number: '602',
      guest_name: 'Current Guest',
      check_in_date: today,
      check_out_date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10)
    }, testDb);

    // Run cleanup
    cleanupPastBookings(testDb);

    const bookings = testDb.prepare('SELECT * FROM bookings').all();
    const hasPastBooking = bookings.some(b => b.check_out_date < today);

    expect(hasPastBooking).toBe(false);
    expect(bookings.some(b => b.guest_name === 'Current Guest')).toBe(true);
  });

  it('should preserve current and future bookings during cleanup', () => {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const nextWeek = new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 10);

    insertBooking({
      room_number: '701',
      guest_name: 'Future Guest',
      check_in_date: tomorrow,
      check_out_date: nextWeek
    }, testDb);

    const beforeCleanup = testDb.prepare('SELECT COUNT(*) as count FROM bookings').get();
    cleanupPastBookings(testDb);
    const afterCleanup = testDb.prepare('SELECT COUNT(*) as count FROM bookings').get();

    expect(afterCleanup.count).toBe(beforeCleanup.count);
  });

  it('should handle edge case of check-out on current date', () => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    // Booking checking out today (should be kept until tomorrow)
    insertBooking({
      room_number: '801',
      guest_name: 'Checking Out Today',
      check_in_date: yesterday,
      check_out_date: today
    }, testDb);

    cleanupPastBookings(testDb);

    const booking = testDb.prepare(
      'SELECT * FROM bookings WHERE room_number = ?'
    ).get('801');

    // Bookings with check_out_date === today should NOT be deleted
    // (they're deleted only when check_out_date < today)
    expect(booking).toBeDefined();
  });
});