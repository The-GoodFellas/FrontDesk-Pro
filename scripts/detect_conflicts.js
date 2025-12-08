import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('db', 'frontdesk.sqlite');
const db = new Database(dbPath);

function findDuplicates() {
  const rows = db.prepare(`
    SELECT room_number, check_in_date, check_out_date, COUNT(*) AS cnt
    FROM bookings
    GROUP BY room_number, check_in_date, check_out_date
    HAVING cnt > 1
    ORDER BY room_number, check_in_date
  `).all();
  return rows;
}

function findOverlaps() {
  const rows = db.prepare(`
    SELECT b1.id AS id1, b2.id AS id2, b1.room_number,
           b1.check_in_date AS in1, b1.check_out_date AS out1,
           b2.check_in_date AS in2, b2.check_out_date AS out2
    FROM bookings b1
    JOIN bookings b2
      ON b1.room_number = b2.room_number
     AND b1.id < b2.id
     AND NOT (b1.check_out_date <= b2.check_in_date OR b1.check_in_date >= b2.check_out_date)
    ORDER BY b1.room_number, b1.check_in_date
  `).all();
  return rows;
}

function main() {
  console.log('Scanning for exact duplicates...');
  const dups = findDuplicates();
  if (dups.length === 0) {
    console.log('No exact duplicates found.');
  } else {
    dups.forEach(r => {
      console.log(`Duplicate: room ${r.room_number} ${r.check_in_date} -> ${r.check_out_date} (count=${r.cnt})`);
    });
  }

  console.log('\nScanning for overlaps...');
  const overlaps = findOverlaps();
  if (overlaps.length === 0) {
    console.log('No overlapping bookings found.');
  } else {
    overlaps.forEach(o => {
      console.log(`Overlap in room ${o.room_number}: [${o.id1}] ${o.in1} -> ${o.out1} conflicts with [${o.id2}] ${o.in2} -> ${o.out2}`);
    });
  }
}

main();
