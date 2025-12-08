// One-off script to delete past reservations (check_out_date < today)
import db, { initSchema, cleanupPastBookings } from '../src/lib/db.js';

function main() {
  try {
    initSchema(db);
    cleanupPastBookings(db);
    console.log('Past reservations deleted successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Cleanup failed:', err);
    process.exit(1);
  }
}

main();
