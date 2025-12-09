git# FrontDesk Pro

## Overview

FrontDesk Pro is a hotel management system designed to simplify front desk operations. It allows staff and administrators to manage guest check-ins and check-outs, view room availability, create reservations, and maintain hotel records through a secure, role-based system.

## Quick Start (Localhost)

Run the app locally with Vite and SvelteKit.

```powershell
# From the project root
npm install
npm install sqlite3
npm run dev

# Vite will print a local URL, typically:
#   http://localhost:5173
```

### Important: Default Login Credentials

- **Admin:** `username: admin` · `password: admin123`
- **Staff:** `username: staff` · `password: test1234`

Change these passwords in production. Passwords are stored using bcrypt with cost factor 10.

## Basic Functionality

* Secure Login: Admins and staff log in with individual accounts. The system verifies credentials before granting access.

* Guest Management: Staff can add, edit, and view guest information such as name, contact details, and stay dates.
  
* Room Management: Admins and staff can check room availability, assign guests to rooms, and update room status after check-out.
  <img width="1516" height="775" alt="Screenshot 2025-12-08 162715" src="https://github.com/user-attachments/assets/ae3b9ba0-5fde-4c17-be2b-c6c4f22d4177" />

* Reservation Handling: Reservations can be created, updated, or canceled. Each reservation links a guest to a room with specific check-in and check-out times.
  <img width="1281" height="648" alt="Screenshot 2025-12-08 162856" src="https://github.com/user-attachments/assets/0ccee2ab-1d8b-487a-9e1e-c8fa3aa41afe" />

* Admin Controls: Administrators can manage staff accounts, modify system settings, and access the ledger for transaction records.
  
* Ledger Tracking: The system automatically logs check-ins, check-outs, and payments for easy reference and accountability.
  <img width="1407" height="269" alt="Screenshot 2025-12-08 163417" src="https://github.com/user-attachments/assets/8028ed9b-5a25-44cb-8cc3-2246ea1a387d" />


## Roles

Admin - Full access. Can manage rooms, staff, and view financial records.
Staff - Can handle daily guest and reservation operations.
Guest (record) - Guest data is stored and linked to room reservations.

## System Highlights

- Secure login with bcrypt-hashed passwords; protected routes enforced server-side.
- Real-time room status: Available, Reserved, Occupied derived from bookings and activity.
- Booking creation with conflict checks and no same-day check-in/out.
- Check-in/out flows with name verification (exact/fuzzy) and activity logging.
- Reservation cancellation with name verification; optional fuzzy match.
- Cleanup of past bookings and archiving of completed stays for reporting.
- Simple, fast UI with filters (status/type), price sorting, and inline actions.

## Future Features

* Online payment processing.
* Email confirmation system.
* Automated reporting dashboard.

## Team

Khandaker Ahmed

Kevin Fuentes (He/Him/His)

Kosoknarith Mey (He/Him/His)

Madou Moore

Derrick Mpetsi

Steven Price (He/Him/His)

---

