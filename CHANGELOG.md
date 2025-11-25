# Changelog

All notable changes to the Employee Skill Development & Onboarding System will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-25

### 🎉 Initial Release - MVP Complete

Complete implementation of all 7 user stories for the Employee Skill Development & Onboarding System MVP.

### Added

#### Phase 1-3: Foundation & Core Features
- **Authentication System**
  - Employee registration with unique ID generation (EMP-XXXXX format)
  - Manager/Admin login support
  - Session-based authentication with secure cookies
  - Password validation (min 8 chars, uppercase, lowercase, number)
  - User type selection (Employee/Manager)

- **Employee Dashboard**
  - Profile summary with employee details
  - Training progress overview
  - Recent activity display
  - Navigation to all features

- **Training Management**
  - View assigned training modules
  - Real-time progress tracking
  - Interactive module completion
  - Progress bar with percentage calculation
  - Estimated completion date
  - Category-based organization (Onboarding, Technical, Compliance)

#### Phase 4: Timesheet Management (US4)
- **Timesheet Features**
  - Weekly timesheet creation (Monday-Sunday)
  - Daily hour entry with validation (0-24 hours)
  - Project description per day
  - Work location tracking (Office, Remote, Client Site)
  - Automatic total hours calculation
  - Submit and lock functionality
  - Status tracking (draft, submitted, approved, rejected)
  - Read-only view for submitted timesheets
  - Filter by status
  - Timesheet history view

#### Phase 5: Expense Management (US5)
- **Expense Features**
  - Expense entry with receipt upload
  - Multi-currency support (USD, EUR, GBP, INR)
  - Category management (Travel, Meals, Office Supplies, Training, Other)
  - Receipt file upload (PDF, JPG, PNG up to 5MB)
  - Image preview for uploaded receipts
  - Expense summary statistics
  - Category-based filtering
  - Delete expense functionality
  - View uploaded receipts

#### Phase 6: PDF Export (US6)
- **PDF Generation**
  - Export individual timesheets as PDF
  - Export expense reports as PDF
  - Professional PDF layout with headers and footers
  - Employee information in reports
  - Daily timesheet breakdown in PDF
  - Expense summary and detail tables
  - Category breakdown for expenses
  - Multi-currency support in reports
  - Automatic filename generation
  - Browser download integration

#### Phase 7: Manager Dashboard (US7)
- **Manager Features**
  - Dashboard statistics (pending, approved, rejected)
  - Pending timesheets queue
  - View all timesheets with status filtering
  - Timesheet approval workflow
  - Timesheet rejection with optional reason
  - Employee overview with submission counts
  - Detailed timesheet review
  - Real-time status updates
  - Manager navigation and access control

### Backend Infrastructure

- **Database**
  - SQLite database with 8 tables
  - Seed script with 5 demo employees
  - 10 sample training modules
  - 2 manager accounts
  - Sample timesheets and expenses

- **API Endpoints**
  - `/api/auth/*` - Authentication endpoints
  - `/api/employees/*` - Employee data endpoints
  - `/api/training/*` - Training module endpoints
  - `/api/timesheets/*` - Timesheet CRUD operations
  - `/api/expenses/*` - Expense management endpoints
  - `/api/export/*` - PDF export endpoints
  - `/api/manager/*` - Manager dashboard endpoints

- **Middleware**
  - Session authentication middleware
  - Role-based access control (employee/manager)
  - File upload middleware (multer)
  - Error handling middleware
  - CORS configuration

- **Services**
  - Employee service (profile, dashboard data)
  - Training service (modules, progress tracking)
  - Timesheet service (CRUD, validation)
  - Expense service (CRUD, summary statistics)
  - PDF service (timesheet & expense reports)
  - Manager service (approval workflows, statistics)

### Frontend Components

- **Pages**
  - LoginPage - User authentication
  - RegisterPage - Employee self-registration
  - EmployeeDashboardPage - Employee overview
  - TrainingPage - Module list and completion
  - TimesheetPage - Timesheet management
  - ExpensePage - Expense tracking
  - ManagerDashboardPage - Manager oversight

- **Shared Components**
  - LoadingSpinner - Loading states
  - ErrorMessage - Error display
  - ProtectedRoute - Route protection
  - FileUpload - File upload UI

- **Features**
  - Responsive design with Tailwind CSS
  - Real-time form validation
  - File upload with drag-and-drop
  - Status badges and indicators
  - Navigation between features
  - Export buttons on relevant pages

### Security

- **Password Security**
  - bcrypt hashing for password storage
  - Password strength validation
  - Secure session management

- **Access Control**
  - Session-based authentication
  - HTTP-only secure cookies
  - Role-based route protection
  - Manager-only endpoint protection

- **File Upload Security**
  - File type validation (PDF, JPG, PNG)
  - File size limits (5-10MB)
  - Secure file storage
  - Path validation

### Database Schema

- `employees` - User accounts and profiles
- `training_modules` - Available training courses
- `employee_training` - Training assignments and progress
- `timesheets` - Weekly timesheet records
- `timesheet_entries` - Daily hour entries
- `expenses` - Expense records with receipts
- `managers` - Manager accounts

### Demo Data

- 5 demo employee accounts
- 10 training modules across categories
- 2 manager accounts (manager@company.com, admin@company.com)
- Sample timesheets with various statuses
- Sample expenses with different categories

### Technical Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS for styling
- React Router v6 for navigation
- Axios for HTTP requests
- Context API for state management

**Backend:**
- Node.js with Express.js
- SQLite with better-sqlite3
- express-session for authentication
- Multer for file uploads
- PDFKit for PDF generation
- bcrypt for password hashing

### Performance

- Fast page loads with Vite
- Optimistic UI updates
- Efficient SQLite queries
- Session caching
- Automatic code splitting

### Documentation

- Comprehensive README with setup instructions
- API endpoint documentation
- Demo credentials included
- Project structure documentation
- Environment variable examples

---

## [Unreleased]

### Planned Features
- Email notifications for timesheet approvals
- Mobile app version
- Advanced reporting and analytics
- Bulk operations for managers
- Calendar integration
- Multi-language support

---

**Note**: This is the first release (MVP) of the Employee Skill Development & Onboarding System. All core features are functional and tested.
