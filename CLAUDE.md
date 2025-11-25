# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Employee Skill Development & Onboarding System is a full-stack web application designed to manage employee professional development, including:
- Employee self-registration and onboarding
- Training module tracking with real-time progress
- Interactive module completion
- Weekly timesheet management with approval workflows
- Expense tracking with receipt uploads
- PDF export for timesheets and expenses
- Manager dashboard with approval capabilities

## Current State

**Status**: MVP Complete ✅
**Version**: 1.0.0
**Branch**: 001-opt-mvp

All 7 user stories have been implemented and tested. The application is fully functional with both employee and manager interfaces.

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State**: React Context API
- **HTTP**: Axios

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: SQLite (better-sqlite3)
- **Auth**: express-session + bcrypt
- **Files**: Multer for uploads
- **PDF**: PDFKit for exports

## Architecture

### Backend Structure
```
server/
├── config/          # Database connection
├── controllers/     # Request handlers (auth, employee, training, timesheet, expense, export, manager)
├── middleware/      # Auth, file upload, error handling
├── routes/          # API endpoints
├── services/        # Business logic
├── database/        # SQLite DB + seed scripts
└── uploads/         # File storage (work-eligibility, receipts)
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/  # Reusable UI components (auth, shared)
│   ├── contexts/    # AuthContext for session management
│   ├── pages/       # Page components (Login, Register, Dashboard, Training, Timesheet, Expense, Manager)
│   ├── utils/       # API client, helpers
│   └── App.jsx      # Main routing
```

## Development Commands

### Backend
```bash
cd server
npm install          # Install dependencies
npm run dev          # Start dev server (nodemon on port 3001)
npm run seed         # Seed database with demo data
npm start            # Production server
```

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server (port 5173)
npm run build        # Production build
npm run preview      # Preview production build
```

## Database

- **Type**: SQLite (employees.db)
- **Location**: `server/database/employees.db`
- **Tables**: employees, training_modules, employee_training, timesheets, timesheet_entries, expenses, managers
- **Seed**: Run `npm run seed` to populate demo data

## API Endpoints

### Authentication
- POST `/api/auth/register` - Employee registration
- POST `/api/auth/login` - Login (employee/manager)
- POST `/api/auth/logout` - Logout
- GET `/api/auth/me` - Current user

### Employee
- GET `/api/employees/dashboard` - Dashboard data

### Training
- GET `/api/training/modules` - Assigned modules
- POST `/api/training/modules/:id/complete` - Mark complete

### Timesheets
- GET `/api/timesheets` - List timesheets
- POST `/api/timesheets` - Create timesheet
- GET `/api/timesheets/:id` - Get details
- POST `/api/timesheets/:id/submit` - Submit

### Expenses
- GET `/api/expenses` - List expenses
- POST `/api/expenses` - Create (with file upload)
- GET `/api/expenses/summary` - Statistics
- DELETE `/api/expenses/:id` - Delete

### Export
- GET `/api/export/timesheet/:id` - Export timesheet PDF
- GET `/api/export/expenses` - Export expenses PDF

### Manager
- GET `/api/manager/stats` - Dashboard statistics
- GET `/api/manager/timesheets` - All timesheets
- GET `/api/manager/timesheets/:id` - Details
- POST `/api/manager/timesheets/:id/approve` - Approve
- POST `/api/manager/timesheets/:id/reject` - Reject
- GET `/api/manager/employees` - All employees

## Demo Credentials

### Employee
- Email: john.doe@company.com
- Password: Password123

### Manager
- Email: manager@company.com
- Password: Manager123

### Admin
- Email: admin@company.com
- Password: Admin123

## Key Features

1. **Self-Onboarding**: Employees can register with work eligibility upload
2. **Training Progress**: Real-time progress tracking with completion estimates
3. **Module Completion**: Interactive marking with instant updates
4. **Timesheet Management**: Weekly entry, submission, approval workflow
5. **Expense Tracking**: Upload receipts (PDF/JPG/PNG), categorize, export
6. **PDF Export**: Generate professional reports for timesheets and expenses
7. **Manager Dashboard**: Approve/reject timesheets, view statistics

## Code Conventions

- Use functional React components with hooks
- Async/await for API calls
- Error handling with try-catch
- Session-based authentication
- Role-based access control (requireEmployeeAuth, requireManagerAuth)
- File validation on upload (type, size)
- SQL prepared statements for security

## Important Notes

- The database file (`employees.db`) is included in the repo for demo purposes
- Uploads directory is gitignored but created automatically
- Sessions expire after 30 minutes of inactivity
- File size limits: 10MB (work eligibility), 5MB (receipts)
- Supported file types: PDF, JPG, PNG

## Testing

Run the seed script to populate test data:
```bash
cd server
npm run seed
```

This creates:
- 5 demo employees
- 10 training modules
- 2 manager accounts
- Sample timesheets and expenses

## Troubleshooting

**Database Issues**: Delete `employees.db` and run `npm run seed`
**Port Conflicts**: Check ports 3001 (backend) and 5173 (frontend)
**Upload Errors**: Ensure `uploads/` directories exist
**Session Issues**: Clear cookies and restart backend

## Next Steps (Future Enhancements)

- Email notifications
- Mobile responsive improvements
- Advanced reporting
- Bulk operations
- Calendar integration
- Export to CSV/Excel
