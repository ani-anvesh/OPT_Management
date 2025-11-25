# Implementation Tasks: Employee Skill Development & Onboarding System MVP

**Feature**: Employee Skill Development & Onboarding System
**Branch**: `001-opt-mvp`
**Target**: 8-10 hour delivery
**Created**: 2025-11-24

## Overview

This task breakdown enables incremental, story-by-story implementation. Each user story phase is independently testable and deliverable. Tasks are marked with `[P]` if parallelizable (different files, no blocking dependencies).

**Total Estimated Time**: 480-600 minutes (8-10 hours)

## Phase 1: Setup & Infrastructure (60 minutes)

**Goal**: Initialize projects, configure dev environment, establish database schema

### Project Initialization

- [ ] T001 Initialize Git repository and create feature branch `001-opt-mvp`
- [ ] T002 [P] Create frontend project with Vite + React in `/frontend` directory
- [ ] T003 [P] Create backend project with Express in `/server` directory
- [ ] T004 [P] Install frontend dependencies: react-router-dom, axios, tailwind, shadcn/ui, react-hook-form, zod, jspdf
- [ ] T005 [P] Install backend dependencies: express, better-sqlite3, bcrypt, express-session, multer, express-validator, cors
- [ ] T006 [P] Configure Tailwind CSS in `frontend/tailwind.config.js`
- [ ] T007 [P] Configure ESLint and Prettier in both projects
- [ ] T008 Create `.gitignore` files for node_modules, uploads, .env, dist
- [ ] T009 [P] Create `frontend/.env` with VITE_API_BASE_URL=http://localhost:3001/api
- [ ] T010 [P] Create `server/.env` with PORT, SESSION_SECRET, DATABASE_PATH, UPLOAD_DIR

### Database Setup

- [ ] T011 Create SQLite schema file in `server/database/schema.sql` with all tables
- [ ] T012 Create database initialization script in `server/database/init.js`
- [ ] T013 Create seed data script in `server/database/seed.js` for 5 employees, 10 modules, 2 managers
- [ ] T014 Run database initialization and verify tables created
- [ ] T015 Run seed script and verify demo data populated

### Backend Foundation

- [ ] T016 Create Express app structure in `server/app.js` with middleware (cors, json, session)
- [ ] T017 Create server entry point in `server/server.js`
- [ ] T018 Create upload directories in `server/uploads/work-eligibility/` and `server/uploads/receipts/`
- [ ] T019 [P] Create auth middleware in `server/middleware/auth.js` for session validation
- [ ] T020 [P] Create file upload middleware in `server/middleware/fileUpload.js` with multer config
- [ ] T021 [P] Create error handler middleware in `server/middleware/errorHandler.js`

### Frontend Foundation

- [ ] T022 Create React Router setup in `frontend/src/App.jsx` with route structure
- [ ] T023 Create AuthContext in `frontend/src/contexts/AuthContext.jsx`
- [ ] T024 Create axios instance in `frontend/src/utils/api.js` with baseURL and interceptors
- [ ] T025 [P] Create shared components: Loading Spinner in `frontend/src/components/shared/LoadingSpinner.jsx`
- [ ] T026 [P] Create shared components: Error Message in `frontend/src/components/shared/ErrorMessage.jsx`
- [ ] T027 [P] Create layout components: Header in `frontend/src/components/layout/Header.jsx`
- [ ] T028 [P] Create layout components: Navigation in `frontend/src/components/layout/Navigation.jsx`

## Phase 2: Foundational Features (40 minutes)

**Goal**: Implement authentication foundation required by all user stories

**Dependencies**: Blocks all user story implementations

### Authentication Backend

- [ ] T029 Create password validation utility in `server/utils/validation.js` (8+ chars, uppercase, lowercase, number)
- [ ] T030 Create auth controller in `server/controllers/auth.controller.js` with register/login/logout methods
- [ ] T031 Create auth routes in `server/routes/auth.routes.js` for POST /register, /login, /logout, GET /me
- [ ] T032 Implement employee ID generator in `server/utils/idGenerator.js` (format: EMP-00001)
- [ ] T033 Mount auth routes in `server/app.js` at /api/auth

### Authentication Frontend

- [ ] T034 Create Login Form component in `frontend/src/components/auth/LoginForm.jsx` with validation
- [ ] T035 Create Register Form component in `frontend/src/components/auth/RegisterForm.jsx` with file upload
- [ ] T036 Create Protected Route component in `frontend/src/components/auth/ProtectedRoute.jsx`
- [ ] T037 Create Login Page in `frontend/src/pages/LoginPage.jsx`
- [ ] T038 Create Register Page in `frontend/src/pages/RegisterPage.jsx`
- [ ] T039 Implement AuthContext provider with login, logout, and session check methods

## Phase 3: User Story 1 - Employee Self-Onboarding (Priority P1) (65 minutes)

**Story Goal**: New employees can self-register with work eligibility upload and receive unique employee ID

**Independent Test**: Complete registration form → Verify employee account created → Receive EMP-ID → Login successful

### Backend Implementation

- [ ] T040 [US1] Create employee service in `server/services/employee.service.js` with createEmployee method
- [ ] T041 [US1] Implement employee registration endpoint in auth controller with file upload handling
- [ ] T042 [US1] Add file type validation for work eligibility docs (PDF only, max 10MB) in file upload middleware
- [ ] T043 [US1] Create employee profile endpoint GET /api/employees/me in `server/routes/employee.routes.js`
- [ ] T044 [US1] Mount employee routes in `server/app.js` at /api/employees

### Frontend Implementation

- [ ] T045 [P] [US1] Create File Upload component in `frontend/src/components/shared/FileUpload.jsx` with drag-drop
- [ ] T046 [US1] Add file validation to Register Form (PDF, inline error messages)
- [ ] T047 [US1] Create Employee Dashboard Page in `frontend/src/pages/EmployeeDashboardPage.jsx`
- [ ] T048 [US1] Add route for /dashboard in App.jsx with ProtectedRoute wrapper
- [ ] T049 [US1] Implement post-registration redirect to dashboard with confirmation message

### Integration & Validation

- [ ] T050 [US1] Test registration flow: Fill form → Upload PDF → Submit → Verify account created
- [ ] T051 [US1] Test validation: Invalid password → Error displayed inline
- [ ] T052 [US1] Test validation: Duplicate email → Error displayed
- [ ] T053 [US1] Test file validation: Non-PDF upload → Error displayed
- [ ] T054 [US1] Test file validation: File >10MB → Error displayed
- [ ] T055 [US1] Verify employee ID format (EMP-00001) and uniqueness

## Phase 4: User Story 2 - View Training Module Progress (Priority P1) (60 minutes)

**Story Goal**: Employees view assigned training modules with progress bar and completion status

**Independent Test**: Login as employee → View dashboard → See training modules → Verify progress calculation

**Dependencies**: Requires authentication (Phase 2 complete)

### Backend Implementation

- [ ] T056 [US2] Create training service in `server/services/training.service.js` with getEmployeeTraining method
- [ ] T057 [US2] Implement progress calculation logic in training service (completed/total modules)
- [ ] T058 [US2] Create training controller in `server/controllers/training.controller.js`
- [ ] T059 [US2] Create GET /api/training/modules endpoint in `server/routes/training.routes.js`
- [ ] T060 [US2] Create GET /api/employees/dashboard endpoint with training progress summary
- [ ] T061 [US2] Mount training routes in `server/app.js` at /api/training

### Frontend Implementation

- [ ] T062 [P] [US2] Create Training Progress Bar component in `frontend/src/components/employee/TrainingProgressBar.jsx`
- [ ] T063 [P] [US2] Create Training Module List component in `frontend/src/components/employee/TrainingModuleList.jsx`
- [ ] T064 [US2] Create Training Page in `frontend/src/pages/TrainingPage.jsx`
- [ ] T065 [US2] Implement dashboard data fetching in Employee Dashboard Page
- [ ] T066 [US2] Add training section to dashboard with progress visualization
- [ ] T067 [US2] Implement completion date estimation logic in training service (backend: average modules per week × remaining modules)
- [ ] T067a [US2] Implement completion date display in frontend using estimation from backend API

### Integration & Validation

- [ ] T068 [US2] Test dashboard load: Verify training modules displayed with correct statuses
- [ ] T069 [US2] Test progress bar: Verify percentage calculation (e.g., 3/10 = 30%)
- [ ] T070 [US2] Test completion date: Verify estimation displays correctly
- [ ] T071 [US2] Test empty state: Employee with zero modules shows appropriate message

## Phase 5: User Story 3 - Mark Training Module Complete (Priority P2) (40 minutes)

**Story Goal**: Employees mark modules complete and see real-time progress updates

**Independent Test**: Click "Mark Complete" → Status updates → Progress bar recalculates without refresh

**Dependencies**: Requires User Story 2 (training display)

### Backend Implementation

- [ ] T072 [US3] Add completeModule method to training service with timestamp recording
- [ ] T073 [US3] Create POST /api/training/modules/:id/complete endpoint in training controller
- [ ] T074 [US3] Implement idempotency check (prevent duplicate completions) in complete endpoint
- [ ] T075 [US3] Add route for module completion in `server/routes/training.routes.js`

### Frontend Implementation

- [ ] T076 [US3] Add "Mark Complete" button to Training Module List items
- [ ] T077 [US3] Implement optimistic UI update in Training Module List
- [ ] T078 [US3] Add progress bar auto-refresh after module completion
- [ ] T079 [US3] Create completion celebration message when progress reaches 100%

### Integration & Validation

- [ ] T080 [US3] Test mark complete: Click button → Status changes to Completed → Timestamp recorded
- [ ] T081 [US3] Test progress update: Mark complete → Progress bar updates without page refresh
- [ ] T082 [US3] Test 100% completion: Mark all modules → Celebration message displays
- [ ] T083 [US3] Test duplicate completion: Mark same module twice → No error, idempotent behavior

## Phase 6: User Story 4 - Submit Weekly Timesheet (Priority P1) (70 minutes)

**Story Goal**: Employees submit weekly timesheets with validation and immutability after submission

**Independent Test**: Fill timesheet form → Validate hours → Submit → Verify read-only status

**Dependencies**: Requires authentication (Phase 2 complete)

### Backend Implementation

- [ ] T084 [US4] Create timesheet service in `server/services/timesheet.service.js` with create/submit methods
- [ ] T085 [US4] Implement hour validation logic (0-24 per day, no negative values)
- [ ] T086 [US4] Implement week period uniqueness check (one timesheet per week)
- [ ] T087 [US4] Create timesheet controller in `server/controllers/timesheet.controller.js`
- [ ] T088 [US4] Create POST /api/timesheets endpoint for creating draft timesheets
- [ ] T089 [US4] Create POST /api/timesheets/:id/submit endpoint to lock timesheet
- [ ] T090 [US4] Create GET /api/timesheets endpoint with status filtering
- [ ] T091 [US4] Create GET /api/timesheets/:id endpoint for single timesheet view
- [ ] T092 [US4] Mount timesheet routes in `server/app.js` at /api/timesheets

### Frontend Implementation

- [ ] T093 [P] [US4] Create Timesheet Form component in `frontend/src/components/employee/TimesheetForm.jsx` with Mon-Sun grid
- [ ] T094 [P] [US4] Create Timesheet List component in `frontend/src/components/employee/TimesheetList.jsx`
- [ ] T095 [US4] Create Timesheet Page in `frontend/src/pages/TimesheetPage.jsx`
- [ ] T096 [US4] Implement client-side hour validation in Timesheet Form
- [ ] T097 [US4] Implement auto-calculation of total weekly hours
- [ ] T098 [US4] Add submit button with confirmation modal
- [ ] T099 [US4] Implement read-only view for submitted timesheets
- [ ] T100 [US4] Add route for /timesheets in App.jsx

### Integration & Validation

- [ ] T101 [US4] Test hour validation: Enter 25 hours → Error displayed
- [ ] T102 [US4] Test hour validation: Enter negative hours → Error displayed
- [ ] T103 [US4] Test total calculation: Enter hours → Total auto-calculates
- [ ] T104 [US4] Test submission: Submit timesheet → Status changes to submitted
- [ ] T105 [US4] Test immutability: Try editing submitted timesheet → Form disabled
- [ ] T105a [US4] Test deletion prevention: Verify no delete button appears for submitted timesheets (FR-029)
- [ ] T106 [US4] Test timesheet list: View history → All past submissions displayed
- [ ] T107 [US4] Test duplicate prevention: Submit for same week → Error displayed

## Phase 7: User Story 5 - Upload Expense Documents (Priority P2) (50 minutes)

**Story Goal**: Employees upload expenses with receipts and filter by category

**Independent Test**: Upload expense with receipt → Select category → Verify in filtered list

**Dependencies**: Requires authentication (Phase 2 complete)

### Backend Implementation

- [ ] T108 [US5] Create expense service in `server/services/expense.service.js` with create/list methods
- [ ] T109 [US5] Implement category validation (Education, Travel, Other only)
- [ ] T110 [US5] Create expense controller in `server/controllers/expense.controller.js`
- [ ] T111 [US5] Create POST /api/expenses endpoint with receipt file upload
- [ ] T112 [US5] Create GET /api/expenses endpoint with category filtering
- [ ] T113 [US5] Create GET /api/expenses/:id/receipt endpoint for file download
- [ ] T114 [US5] Add receipt file validation (PDF, JPG, PNG, max 5MB) to file upload middleware
- [ ] T115 [US5] Mount expense routes in `server/app.js` at /api/expenses

### Frontend Implementation

- [ ] T116 [P] [US5] Create Expense Form component in `frontend/src/components/employee/ExpenseForm.jsx`
- [ ] T117 [P] [US5] Create Expense List component in `frontend/src/components/employee/ExpenseList.jsx`
- [ ] T118 [US5] Create Expense Page in `frontend/src/pages/ExpensePage.jsx`
- [ ] T119 [US5] Add category dropdown with Education, Travel, Other options
- [ ] T120 [US5] Implement category filter in Expense List
- [ ] T121 [US5] Add receipt preview/download functionality
- [ ] T122 [US5] Add route for /expenses in App.jsx

### Integration & Validation

- [ ] T123 [US5] Test expense upload: Upload with valid receipt → Expense created
- [ ] T124 [US5] Test category filter: Filter by Education → Only Education expenses shown
- [ ] T125 [US5] Test file validation: Upload HEIC file → Error displayed inline
- [ ] T126 [US5] Test receipt download: Click receipt link → File downloads
- [ ] T127 [US5] Test file size: Upload 6MB file → Error displayed

## Phase 8: User Story 6 - Export Development Report (Priority P2) (45 minutes)

**Story Goal**: Employees export comprehensive PDF report with all progress data

**Independent Test**: Click export → PDF generates in <3 seconds → Verify all sections included

**Dependencies**: Requires US1 (profile), US2 (training), US4 (timesheets), US5 (expenses)

### Backend Implementation

- [ ] T128 [US6] Create export service in `server/services/export.service.js` with aggregation logic
- [ ] T129 [US6] Implement data aggregation for development report (profile, training, timesheets, expenses)
- [ ] T130 [US6] Create export controller in `server/controllers/export.controller.js`
- [ ] T131 [US6] Create GET /api/export/development-report endpoint
- [ ] T132 [US6] Mount export routes in `server/app.js` at /api/export

### Frontend Implementation

- [ ] T133 [P] [US6] Create PDF generation utility in `frontend/src/utils/pdfExport.js` using jsPDF
- [ ] T134 [P] [US6] Create Export Report Button component in `frontend/src/components/employee/ExportReportButton.jsx`
- [ ] T135 [US6] Add export button to employee dashboard
- [ ] T136 [US6] Implement PDF template with all sections (profile, training, timesheets, expenses)
- [ ] T137 [US6] Implement filename formatting: Development_Report_[EmployeeName]_[Date].pdf
- [ ] T138 [US6] Add loading indicator during PDF generation

### Integration & Validation

- [ ] T139 [US6] Test PDF export: Click button → PDF downloads within 3 seconds
- [ ] T140 [US6] Test PDF content: Verify employee info section present and accurate
- [ ] T141 [US6] Test PDF content: Verify training progress summary included
- [ ] T142 [US6] Test PDF content: Verify timesheet hours summary included
- [ ] T143 [US6] Test PDF content: Verify expense breakdown by category included
- [ ] T144 [US6] Test filename: Verify format matches Development_Report_JohnDoe_2025-11-24.pdf

## Phase 9: User Story 7 - Manager Dashboard View (Priority P3) (35 minutes)

**Story Goal**: Managers view employee list with compliance status and export timesheets

**Independent Test**: Login as manager → View employee list → Filter by status → Export CSV

**Dependencies**: Requires US1 (employees), US2 (training), US4 (timesheets)

### Backend Implementation

- [ ] T145 [US7] Create compliance service in `server/services/compliance.service.js` with status calculation
- [ ] T146 [US7] Implement multi-criteria compliance check (profile + timesheet + 10% training)
- [ ] T147 [US7] Create manager controller in `server/controllers/manager.controller.js`
- [ ] T148 [US7] Create GET /api/manager/employees endpoint with compliance status
- [ ] T149 [US7] Create GET /api/manager/timesheets/export endpoint for CSV generation
- [ ] T150 [US7] Add compliance status filtering to employee list endpoint
- [ ] T151 [US7] Mount manager routes in `server/app.js` at /api/manager

### Frontend Implementation

- [ ] T152 [P] [US7] Create Manager Dashboard Page in `frontend/src/pages/ManagerDashboardPage.jsx`
- [ ] T153 [P] [US7] Create Employee List component in `frontend/src/components/manager/EmployeeList.jsx`
- [ ] T154 [P] [US7] Create Compliance Filter component in `frontend/src/components/manager/ComplianceFilter.jsx`
- [ ] T155 [P] [US7] Create Export Timesheets Button in `frontend/src/components/manager/ExportTimesheetsButton.jsx`
- [ ] T156 [US7] Add compliance status indicators (compliant/non-compliant badges)
- [ ] T157 [US7] Implement CSV export trigger
- [ ] T158 [US7] Add route for /manager/dashboard in App.jsx

### Integration & Validation

- [ ] T159 [US7] Test manager login: Login with manager credentials → Access granted
- [ ] T160 [US7] Test employee list: View dashboard → All employees displayed
- [ ] T161 [US7] Test compliance filter: Filter by compliant → Only compliant employees shown
- [ ] T162 [US7] Test compliance indicator: Verify 3-criteria calculation accurate
- [ ] T163 [US7] Test CSV export: Click export → CSV downloads with all timesheet data
- [ ] T164 [US7] Test empty state: No timesheets → CSV still downloads with headers

## Phase 10: Polish & Cross-Cutting Concerns (30 minutes)

**Goal**: UI refinement, error handling, accessibility, and deployment prep

### UI Polish

- [ ] T165 [P] Add responsive breakpoints to all pages for mobile compatibility
- [ ] T166 [P] Add loading skeletons to dashboard components
- [ ] T167 [P] Add toast notifications for success/error messages
- [ ] T168 [P] Implement consistent button styling with shadcn/ui
- [ ] T169 [P] Add icons to navigation and buttons
- [ ] T170 [P] Implement dark mode toggle (optional enhancement)

### Error Handling

- [ ] T171 Create global error boundary in `frontend/src/components/ErrorBoundary.jsx`
- [ ] T172 Add 404 Not Found page in `frontend/src/pages/NotFoundPage.jsx`
- [ ] T173 Implement API error handling with user-friendly messages
- [ ] T174 Add network error detection and retry logic

### Security & Validation

- [ ] T175 Add CSRF protection to session configuration
- [ ] T176 Implement rate limiting on auth endpoints
- [ ] T177 Add input sanitization to all form submissions
- [ ] T178 Verify all file uploads have proper validation

### Documentation & Deployment

- [ ] T179 Create README.md with setup instructions
- [ ] T180 Create API.md with endpoint documentation
- [ ] T181 Create DEMO.md with step-by-step demo script
- [ ] T182 Configure Vercel deployment for frontend
- [ ] T183 Configure Railway/Heroku deployment for backend
- [ ] T184 Set production environment variables
- [ ] T185 Test full deployment and end-to-end flows in production

## Task Dependencies & Execution Order

### Critical Path (Must Complete in Order)

1. **Setup** (Phase 1) → All subsequent phases
2. **Foundational** (Phase 2 - Auth) → All user story phases
3. **User Story 1** (P1) → Independent after Phase 2
4. **User Story 2** (P1) → Independent after Phase 2
5. **User Story 3** (P2) → Requires User Story 2
6. **User Story 4** (P1) → Independent after Phase 2
7. **User Story 5** (P2) → Independent after Phase 2
8. **User Story 6** (P2) → Requires US1, US2, US4, US5
9. **User Story 7** (P3) → Requires US1, US2, US4
10. **Polish** (Phase 10) → After all user stories

### Parallel Execution Opportunities

**After Phase 1 Setup Complete, these can run in parallel:**
- Frontend foundation (T022-T028)
- Backend middleware (T019-T021)
- Database seed data (T013-T015)

**After Phase 2 Auth Complete, these user stories can run in parallel:**
- User Story 1 (Employee Registration)
- User Story 2 (Training Progress)
- User Story 4 (Timesheets)
- User Story 5 (Expenses)

**Within each user story, these task types can parallelize:**
- Backend services (if different files)
- Frontend components (if different files)
- Validation utilities

**Phase 10 Polish tasks (T165-T170) can all run in parallel**

### MVP Delivery Sequence

**Minimum Viable Product (MVP-1): User Story 1 Only**
- Phases 1, 2, 3 (Setup + Auth + Registration)
- **Time**: ~165 minutes (2.75 hours)
- **Value**: Employees can register and view profile

**MVP-2: Add Training Progress**
- MVP-1 + Phase 4 (User Story 2)
- **Time**: ~225 minutes (3.75 hours)
- **Value**: Employees see training modules

**MVP-3: Add Interactivity**
- MVP-2 + Phase 5 (User Story 3)
- **Time**: ~265 minutes (4.4 hours)
- **Value**: Employees can mark training complete

**MVP-4: Add Timesheets (Demo-Ready)**
- MVP-3 + Phase 6 (User Story 4)
- **Time**: ~335 minutes (5.6 hours)
- **Value**: Core compliance tracking functional

**Full MVP: All P1 + P2 Features**
- MVP-4 + Phases 7, 8 (Expenses + PDF Export)
- **Time**: ~430 minutes (7.2 hours)
- **Value**: Complete employee self-service

**Complete System: Include Manager View**
- Full MVP + Phases 9, 10 (Manager Dashboard + Polish)
- **Time**: ~495 minutes (8.25 hours)
- **Value**: Full system with oversight capabilities

## Implementation Strategy

### Day 1 Timeline (8-10 hours)

| Time | Phase | Tasks | Deliverable |
|------|-------|-------|-------------|
| 0:00-1:00 | Setup | T001-T028 | Projects initialized, database ready |
| 1:00-1:40 | Auth Foundation | T029-T039 | Login/Register working |
| 1:40-2:45 | US1 Registration | T040-T055 | Employee self-registration complete |
| 2:45-3:45 | US2 Training View | T056-T071 | Training progress visible |
| 3:45-4:25 | US3 Mark Complete | T072-T083 | Interactive training tracking |
| 4:25-5:35 | US4 Timesheets | T084-T107 | Timesheet submission working |
| 5:35-6:25 | US5 Expenses | T108-T127 | Expense upload functional |
| 6:25-7:10 | US6 PDF Export | T128-T144 | Development report export |
| 7:10-7:45 | US7 Manager View | T145-T164 | Manager oversight complete |
| 7:45-8:15 | Polish & Deploy | T165-T185 | Production-ready system |

### Testing Checkpoints

**After Each User Story Phase, Verify:**
- [ ] All acceptance scenarios pass
- [ ] Independent test criteria met
- [ ] No blocking bugs for next phase
- [ ] Code committed to feature branch

**Final Demo Checklist:**
- [ ] All 7 user stories functional
- [ ] All 13 success criteria met (SC-001 through SC-013)
- [ ] Seed data loaded correctly
- [ ] Production deployment successful
- [ ] Demo script walkthrough completed

## Task Summary

**Total Tasks**: 185
**Setup Phase**: 28 tasks
**Foundational Phase**: 11 tasks
**User Story 1**: 16 tasks
**User Story 2**: 16 tasks
**User Story 3**: 12 tasks
**User Story 4**: 24 tasks
**User Story 5**: 20 tasks
**User Story 6**: 17 tasks
**User Story 7**: 20 tasks
**Polish Phase**: 21 tasks

**Parallelizable Tasks**: 47 marked with [P]
**Critical Path Tasks**: 138 sequential tasks

**Estimated Duration**: 480-600 minutes (8-10 hours)

---

*This task breakdown enables rapid, incremental delivery with clear testing criteria at each milestone.*
