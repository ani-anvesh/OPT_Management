# Technical Implementation Plan: Employee Skill Development & Onboarding System MVP

**Feature Branch**: `001-opt-mvp`
**Created**: 2025-11-24
**Target Delivery**: Single business day (8-10 hours)
**Specification**: [spec.md](./spec.md)

## Executive Summary

This plan outlines the technical implementation for a rapid MVP of an Employee Skill Development & Onboarding System, designed for demonstration and investor presentation within a single development day. The system enables employees to self-register, track training progress, submit timesheets, manage expenses, and export development reports, while providing managers with oversight capabilities.

## Stack & Deployment

### Frontend Stack
- **Framework**: React 18 with Vite for ultra-fast builds and hot module replacement
- **Styling**: Tailwind CSS for rapid, utility-first styling
- **UI Components**: shadcn/ui for pre-built, accessible components
- **State Management**: React Context API (sufficient for MVP scope)
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios for API communication
- **PDF Generation**: jsPDF or html2canvas + jsPDF for client-side PDF export

### Backend Stack
- **Runtime**: Node.js 18+ with Express.js
- **Database**: SQLite with better-sqlite3 (zero-config, portable)
- **ORM**: None (raw SQL for speed) or Prisma Lite if type safety desired
- **Authentication**: express-session with secure cookie storage
- **Password Hashing**: bcrypt
- **File Upload**: multer with local filesystem storage
- **Validation**: express-validator
- **CORS**: cors middleware for dev/prod flexibility

### Deployment
- **Frontend**: Vercel (automatic deployment from Git, zero config)
- **Backend**: Railway or Heroku (one-click deploy with environment variables)
- **Database**: SQLite file bundled with backend deployment
- **File Storage**: Local filesystem mounted volume (Heroku ephemeral, Railway persistent)

### Development Environment
- **Package Manager**: npm
- **Node Version**: 18.x (use nvm for version management)
- **Git Workflow**: Feature branch `001-opt-mvp`, merge to `main` on completion
- **Linting**: ESLint with Airbnb config
- **Formatting**: Prettier
- **Pre-commit Hooks**: Husky + lint-staged (optional for solo dev)

## Data Models & Schema

### Database Schema (SQLite)

```sql
-- Employees table
CREATE TABLE employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id TEXT UNIQUE NOT NULL, -- Auto-generated (e.g., EMP-00001)
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  department TEXT NOT NULL,
  work_eligibility_doc_path TEXT,
  employment_start_date DATE,
  status TEXT DEFAULT 'active', -- active, inactive
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Training Modules table
CREATE TABLE training_modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL, -- e.g., TRN-001
  name TEXT NOT NULL,
  description TEXT,
  estimated_hours INTEGER,
  category TEXT, -- Onboarding, Technical, Compliance, etc.
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Employee Training (junction table)
CREATE TABLE employee_training (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  module_id INTEGER NOT NULL,
  status TEXT DEFAULT 'Not Started', -- Not Started, In Progress, Completed
  completion_score INTEGER, -- Optional score/percentage
  completion_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (module_id) REFERENCES training_modules(id) ON DELETE CASCADE,
  UNIQUE(employee_id, module_id)
);

-- Timesheets table
CREATE TABLE timesheets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  total_hours REAL NOT NULL,
  status TEXT DEFAULT 'draft', -- draft, submitted
  submitted_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE(employee_id, week_start_date)
);

-- Timesheet Entries (daily breakdown)
CREATE TABLE timesheet_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timesheet_id INTEGER NOT NULL,
  date DATE NOT NULL,
  hours REAL NOT NULL CHECK(hours >= 0 AND hours <= 24),
  project_description TEXT,
  work_location TEXT,
  FOREIGN KEY (timesheet_id) REFERENCES timesheets(id) ON DELETE CASCADE
);

-- Expenses table
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employee_id INTEGER NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL, -- Education, Travel, Other
  amount REAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  description TEXT,
  receipt_doc_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Managers table
CREATE TABLE managers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  access_level TEXT DEFAULT 'manager', -- manager, admin
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Seed Data Requirements

**Employees (5 sample accounts)**:
- EMP-00001: John Doe, john.doe@company.com, Engineering
- EMP-00002: Jane Smith, jane.smith@company.com, Marketing
- EMP-00003: Bob Johnson, bob.johnson@company.com, Sales
- EMP-00004: Alice Williams, alice.williams@company.com, HR
- EMP-00005: Charlie Brown, charlie.brown@company.com, Finance

**Training Modules (10 sample modules)**:
- TRN-001: Company Orientation (8 hours)
- TRN-002: Workplace Safety (4 hours)
- TRN-003: IT Security Fundamentals (6 hours)
- TRN-004: Communication Skills (5 hours)
- TRN-005: Time Management (3 hours)
- TRN-006: Project Management Basics (8 hours)
- TRN-007: Customer Service Excellence (6 hours)
- TRN-008: Data Privacy & GDPR (5 hours)
- TRN-009: Leadership Essentials (10 hours)
- TRN-010: Diversity & Inclusion (4 hours)

**Managers (2 accounts)**:
- manager@company.com (password: Manager123)
- admin@company.com (password: Admin123)

**Pre-assigned Training**: Assign 3-5 modules to each employee with varying statuses for demo

## API Endpoints

### Authentication & Registration

```
POST /api/auth/register
  Body: { name, email, password, department, workEligibilityDoc (file) }
  Returns: { employeeId, message }
  Validations:
    - Password: min 8 chars, 1 uppercase, 1 lowercase, 1 number
    - Email: valid format, unique
    - File: PDF only, max 10MB
```

```
POST /api/auth/login
  Body: { email, password, userType: 'employee' | 'manager' }
  Returns: { user, sessionToken }
  Sets: HTTP-only session cookie
```

```
POST /api/auth/logout
  Clears session cookie
```

```
GET /api/auth/me
  Returns: Current authenticated user data
  Requires: Valid session
```

### Employee Dashboard & Training

```
GET /api/employees/dashboard
  Returns: {
    employee: { id, name, email, department, employeeId },
    trainingProgress: { completed, total, percentage },
    recentTimesheets: [...],
    recentExpenses: [...]
  }
  Requires: Employee session
```

```
GET /api/training/modules
  Returns: Array of assigned training modules with status
  Requires: Employee session
```

```
POST /api/training/modules/:id/complete
  Marks module as completed
  Updates progress calculation
  Returns: Updated training status
```

### Timesheets

```
GET /api/timesheets
  Query: ?status=draft|submitted&limit=10
  Returns: Array of timesheets for current employee
```

```
POST /api/timesheets
  Body: {
    weekStartDate,
    entries: [{ date, hours, projectDescription, workLocation }]
  }
  Validations:
    - Hours per day: 0-24
    - No overlapping timesheets for same week
  Returns: Created timesheet
```

```
GET /api/timesheets/:id
  Returns: Single timesheet with all entries (read-only if submitted)
```

```
POST /api/timesheets/:id/submit
  Changes status to 'submitted', locks editing
  Returns: Updated timesheet
```

### Expenses

```
GET /api/expenses
  Query: ?category=Education|Travel|Other&limit=20
  Returns: Array of expenses for current employee
```

```
POST /api/expenses
  Body: { date, category, amount, description, receipt (file) }
  Validations:
    - Category: Education, Travel, Other only
    - Receipt: PDF, JPG, PNG, max 5MB
  Returns: Created expense
```

```
GET /api/expenses/:id/receipt
  Returns: Receipt file download
```

### PDF Export

```
GET /api/export/development-report
  Generates PDF with:
    - Employee info
    - Work eligibility status
    - Training progress summary
    - Timesheet hours summary
    - Expense breakdown by category
  Returns: PDF file download
  Filename: Development_Report_[EmployeeName]_[Date].pdf
```

### Manager Dashboard

```
POST /api/manager/login
  Body: { email, password }
  Returns: Manager session
```

```
GET /api/manager/employees
  Query: ?status=compliant|non-compliant&department=Engineering
  Returns: Array of employees with compliance status
  Compliance Calculation:
    - Profile complete (work eligibility uploaded)
    - Timesheet submitted for current week
    - At least 10% training progress
```

```
GET /api/manager/timesheets/export
  Query: ?format=csv&startDate&endDate
  Returns: CSV file with all employee timesheets
```

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── employee/
│   │   ├── Dashboard.jsx
│   │   ├── TrainingModuleList.jsx
│   │   ├── TrainingProgressBar.jsx
│   │   ├── TimesheetForm.jsx
│   │   ├── TimesheetList.jsx
│   │   ├── ExpenseForm.jsx
│   │   ├── ExpenseList.jsx
│   │   └── ExportReportButton.jsx
│   ├── manager/
│   │   ├── ManagerDashboard.jsx
│   │   ├── EmployeeList.jsx
│   │   ├── ComplianceFilter.jsx
│   │   └── ExportTimesheetsButton.jsx
│   ├── shared/
│   │   ├── FileUpload.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── SuccessMessage.jsx
│   └── layout/
│       ├── Header.jsx
│       ├── Navigation.jsx
│       └── Footer.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── EmployeeDashboardPage.jsx
│   ├── TrainingPage.jsx
│   ├── TimesheetPage.jsx
│   ├── ExpensePage.jsx
│   └── ManagerDashboardPage.jsx
├── contexts/
│   └── AuthContext.jsx
├── utils/
│   ├── api.js (axios instance)
│   ├── validation.js
│   └── pdfExport.js
├── App.jsx
└── main.jsx
```

### Key UI Requirements

1. **Responsive Design**: Mobile-first approach using Tailwind breakpoints
2. **Inline Validation**: Real-time field validation with clear error messages
3. **File Upload**: Drag-and-drop support with file type/size validation
4. **Progress Indicators**: Visual progress bars for training completion
5. **Loading States**: Skeleton loaders during data fetch
6. **Error Handling**: Toast notifications or inline error messages

### State Management Strategy

- **AuthContext**: Current user, login/logout functions, session check
- **Local Component State**: Form inputs, UI toggles
- **React Query** (optional): Server state caching for dashboard data

## Backend Architecture

### Project Structure

```
server/
├── config/
│   └── database.js (SQLite connection)
├── middleware/
│   ├── auth.js (session validation)
│   ├── fileUpload.js (multer config)
│   └── errorHandler.js
├── routes/
│   ├── auth.routes.js
│   ├── employee.routes.js
│   ├── training.routes.js
│   ├── timesheet.routes.js
│   ├── expense.routes.js
│   ├── export.routes.js
│   └── manager.routes.js
├── controllers/
│   ├── auth.controller.js
│   ├── employee.controller.js
│   ├── training.controller.js
│   ├── timesheet.controller.js
│   ├── expense.controller.js
│   ├── export.controller.js
│   └── manager.controller.js
├── services/
│   ├── employee.service.js
│   ├── training.service.js
│   ├── timesheet.service.js
│   ├── expense.service.js
│   └── compliance.service.js
├── utils/
│   ├── validation.js
│   ├── fileHandler.js
│   └── pdfGenerator.js
├── seeds/
│   └── seed.js (populate demo data)
├── uploads/ (gitignored)
│   ├── work-eligibility/
│   └── receipts/
├── app.js
└── server.js
```

### Security Implementation

**Password Requirements** (FR-001a):
```javascript
const passwordSchema = {
  minLength: 8,
  minUppercase: 1,
  minLowercase: 1,
  minNumbers: 1
};

function validatePassword(password) {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isLongEnough = password.length >= 8;

  return hasUppercase && hasLowercase && hasNumber && isLongEnough;
}
```

**Session Configuration**:
```javascript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 60 * 1000 // 30 minutes
  }
}));
```

**File Upload Validation**:
```javascript
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  const maxSize = 10 * 1024 * 1024; // 10MB for work docs, 5MB for receipts

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file format. Please upload PDF, JPG, or PNG'));
  }

  cb(null, true);
};
```

### Compliance Status Calculation (FR-026a)

```javascript
function calculateComplianceStatus(employee) {
  const criteria = {
    profileComplete: !!employee.work_eligibility_doc_path,
    currentWeekTimesheet: hasTimesheetForCurrentWeek(employee.id),
    trainingProgress: getTrainingProgress(employee.id) >= 0.10
  };

  const isCompliant = criteria.profileComplete &&
                      criteria.currentWeekTimesheet &&
                      criteria.trainingProgress;

  return {
    status: isCompliant ? 'compliant' : 'non-compliant',
    criteria
  };
}
```

## Development Workflow

### Phase 1: Setup & Scaffolding (60 minutes)

1. **Project Initialization** (15 min)
   - Initialize Git repository
   - Create React + Vite frontend project
   - Create Express backend project
   - Configure environment variables
   - Set up .gitignore for uploads, node_modules, .env

2. **Database Setup** (20 min)
   - Create SQLite database schema
   - Write seed script with demo data
   - Test database connections
   - Verify seed data integrity

3. **Authentication Foundation** (25 min)
   - Implement password hashing with bcrypt
   - Set up session middleware
   - Create login/register endpoints
   - Build basic login/register UI forms

### Phase 2: Core Employee Features (180 minutes)

4. **Employee Registration & Profile** (40 min)
   - Registration form with validation
   - File upload for work eligibility
   - Employee ID generation
   - Profile display on dashboard

5. **Training Module Display & Progress** (50 min)
   - Fetch assigned modules from API
   - Display module list with status badges
   - Calculate and display progress bar
   - Estimated completion date logic

6. **Mark Training Complete** (30 min)
   - Complete button on each module
   - Update status via API
   - Real-time progress recalculation
   - Optimistic UI updates

7. **Timesheet Management** (60 min)
   - Weekly timesheet form (Mon-Sun grid)
   - Hour input with validation (0-24)
   - Auto-calculate total hours
   - Submit and lock functionality
   - Read-only view for submitted sheets

### Phase 3: Supporting Features (120 minutes)

8. **Expense Tracking** (45 min)
   - Expense upload form
   - Receipt file upload
   - Category dropdown (Education, Travel, Other)
   - Expense list with filters
   - Document preview/download

9. **PDF Export** (30 min)
   - Generate comprehensive report
   - Include all sections (profile, training, timesheets, expenses)
   - Proper filename formatting
   - Download trigger

10. **Manager Dashboard** (45 min)
    - Manager login
    - Employee list view
    - Compliance status indicators
    - CSV export for timesheets

### Phase 4: Polish & Testing (90 minutes)

11. **Error Handling & Validation** (30 min)
    - Inline validation messages
    - API error responses
    - Edge case handling
    - Loading states

12. **UI Polish** (30 min)
    - Responsive layout adjustments
    - Tailwind styling refinements
    - Accessibility basics (ARIA labels)
    - Icon additions

13. **E2E Testing & Bug Fixes** (30 min)
    - Test all user flows
    - Fix critical bugs
    - Performance checks
    - Cross-browser testing

### Phase 5: Deployment & Demo Prep (30 minutes)

14. **Deployment** (20 min)
    - Deploy frontend to Vercel
    - Deploy backend to Railway/Heroku
    - Configure environment variables
    - Test production build

15. **Demo Preparation** (10 min)
    - Reset seed data
    - Prepare demo script
    - Test end-to-end flows
    - Document any known limitations

## Testing Strategy

### Manual Testing Checklist

**Employee Registration Flow**:
- [ ] Register with valid data → Success
- [ ] Register with weak password → Error (inline message)
- [ ] Register with duplicate email → Error
- [ ] Upload PDF work doc → Success
- [ ] Upload invalid format → Error (inline message)
- [ ] Upload file >10MB → Error

**Training Progress Flow**:
- [ ] View assigned modules → All visible
- [ ] Progress bar shows correct percentage
- [ ] Mark module complete → Status updates
- [ ] Progress recalculates immediately
- [ ] Completion date estimates correctly

**Timesheet Flow**:
- [ ] Create new timesheet → Form loads
- [ ] Enter >24 hours for one day → Validation error
- [ ] Enter negative hours → Validation error
- [ ] Submit valid timesheet → Status = submitted
- [ ] Try editing submitted sheet → Disabled
- [ ] View timesheet history → All listed

**Expense Flow**:
- [ ] Upload expense with receipt → Success
- [ ] Filter by category → Correct results
- [ ] Upload unsupported format → Error (inline)
- [ ] Download receipt → File opens

**PDF Export**:
- [ ] Click export → PDF downloads
- [ ] PDF contains all sections
- [ ] Filename correct format
- [ ] Data accuracy verified

**Manager Dashboard**:
- [ ] Login as manager → Success
- [ ] View all employees → List displays
- [ ] Filter by compliance → Correct filtering
- [ ] Export CSV → File downloads
- [ ] Compliance indicators accurate

### Acceptance Criteria Validation

Map each test to specific acceptance scenarios from spec.md:
- User Story 1, Scenario 1: Employee registration with unique ID
- User Story 2, Scenario 1: Training modules with status
- User Story 3, Scenario 2: Progress bar updates without refresh
- User Story 4, Scenario 3: Timesheet becomes read-only
- User Story 5, Scenario 4: Document preview/download
- User Story 6, Scenario 5: PDF filename format
- User Story 7, Scenario 4: Compliance status indicator

## Performance Targets (Success Criteria)

- **SC-001**: Registration to dashboard < 3 minutes ✓
- **SC-002**: Progress bar updates < 1 second ✓
- **SC-003**: Timesheet submission < 2 seconds ✓
- **SC-004**: File upload (5MB) < 5 seconds ✓
- **SC-005**: PDF export < 3 seconds ✓
- **SC-007**: Support 100 concurrent users ✓ (SQLite sufficient for MVP)
- **SC-008**: Manager CSV export < 10 seconds ✓

## Risk Mitigation

### Technical Risks

**Risk 1**: Large file uploads slow down system
- **Mitigation**: Enforce 10MB limit with clear error messages (FR-030a)
- **Fallback**: Disable uploads >5MB with warning

**Risk 2**: SQLite performance with concurrent writes
- **Mitigation**: Use WAL mode for better concurrency
- **Fallback**: Document 100 user limit in assumptions

**Risk 3**: PDF generation fails with incomplete data
- **Mitigation**: Validate required data before PDF generation
- **Fallback**: Show clear error: "Complete your profile to export report"

**Risk 4**: Session timeout during long form filling
- **Mitigation**: Auto-save drafts to localStorage
- **Fallback**: Display warning at 25 minutes of inactivity

### Development Risks

**Risk 5**: Feature bloat threatens demo timeline
- **Mitigation**: Ruthless prioritization, P3 features cut first
- **Fallback**: Replace complex features with "Coming Soon" stubs

## Environment Configuration

### Frontend (.env)

```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=Employee Development System
```

### Backend (.env)

```
NODE_ENV=development
PORT=3001
SESSION_SECRET=your-secret-key-here
DATABASE_PATH=./data/employees.db
UPLOAD_DIR=./uploads
CORS_ORIGIN=http://localhost:5173
```

## Deployment Configuration

### Vercel (Frontend)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "env": {
    "VITE_API_BASE_URL": "https://your-backend.railway.app/api"
  }
}
```

### Railway (Backend)

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

## Documentation Requirements

- **README.md**: Quick start guide, tech stack, local setup
- **API.md**: Endpoint documentation with examples
- **DEMO.md**: Step-by-step demo script for presentations
- **CHANGELOG.md**: Version history and feature additions

## Success Metrics

- All 7 user stories implemented and testable
- 13 success criteria met
- Zero critical bugs in demo flows
- <10 hours total development time
- Deployable with single command
- Demo-ready with seed data

---

**Plan Status**: Ready for implementation
**Next Step**: Initialize projects and begin Phase 1
**Estimated Total Time**: 8-10 hours
