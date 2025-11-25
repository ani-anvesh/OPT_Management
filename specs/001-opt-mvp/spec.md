# Feature Specification: OPT Student Management System MVP

**Feature Branch**: `001-opt-mvp`
**Created**: 2025-11-24
**Status**: Draft
**Input**: User description: "OPT Student Management System - 1-Day MVP Usecase Document"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Student Self-Registration (Priority: P1)

An OPT student needs to register in the system to begin tracking their compliance activities. The student visits the registration page, fills out their personal information, uploads their I-20 document, and receives immediate confirmation with a unique student ID.

**Why this priority**: This is the foundation of the entire system. Without student accounts, no other features can function. It's the entry point for all users.

**Independent Test**: Can be fully tested by completing registration form with valid data and verifying student account creation with auto-generated ID. Delivers immediate value by allowing students to establish their presence in the system.

**Acceptance Scenarios**:

1. **Given** a new student visits the registration page, **When** they enter name, email, password, and institution details, **Then** their account is created and they receive a unique student ID
2. **Given** a student uploads an I-20 document during registration, **When** the file is valid (PDF format), **Then** the document is stored and linked to their profile
3. **Given** a student completes registration, **When** they log in for the first time, **Then** they see a confirmation message and are directed to their dashboard

---

### User Story 2 - View Curriculum Progress (Priority: P1)

An OPT student needs to track their academic progress through their program curriculum. The student logs into their dashboard and immediately sees a visual representation of their curriculum with a progress bar showing completion percentage and courses organized by status.

**Why this priority**: Progress tracking is core to OPT compliance. Students need visibility into their academic standing to maintain their status. This provides immediate visual feedback on their program journey.

**Independent Test**: Can be fully tested by logging in as a student with a pre-populated curriculum and viewing the dashboard with progress calculations. Delivers value by giving students instant awareness of where they stand in their program.

**Acceptance Scenarios**:

1. **Given** a student logs into their dashboard, **When** they view the curriculum section, **Then** they see all assigned courses with current status (Not Started, In Progress, Completed)
2. **Given** a student has completed courses, **When** the dashboard calculates progress, **Then** the progress bar accurately reflects percentage complete based on total courses
3. **Given** a student views their curriculum, **When** progress is calculated, **Then** an estimated completion date is displayed based on current pace

---

### User Story 3 - Mark Course Complete (Priority: P2)

An OPT student completes a course and needs to update their progress in the system. The student navigates to their curriculum, locates the completed course, clicks "Mark Complete," and watches their progress bar update in real-time.

**Why this priority**: Enables students to maintain accurate records of their academic progress, which is essential for compliance reporting. Builds on P1 by adding interactivity to the read-only dashboard.

**Independent Test**: Can be fully tested by marking a single course complete and verifying progress recalculation. Delivers value by empowering students to maintain their own records.

**Acceptance Scenarios**:

1. **Given** a student has a course in progress, **When** they click "Mark Complete" on that course, **Then** the course status changes to Completed and the timestamp is recorded
2. **Given** a student marks a course complete, **When** the system recalculates progress, **Then** the progress bar updates immediately without page refresh
3. **Given** a student has marked all courses complete, **When** they view their dashboard, **Then** the progress bar shows 100% and displays a completion celebration message

---

### User Story 4 - Submit Weekly Timesheet (Priority: P1)

An OPT student working on practical training needs to log their hours for compliance. The student accesses the timesheet form, enters hours for each day of the week (Monday through Sunday), adds project description and work location, sees the auto-calculated total, and submits for permanent record.

**Why this priority**: Timesheet tracking is a legal requirement for OPT compliance. Without accurate hour logging, students risk visa status issues. This is mission-critical functionality.

**Independent Test**: Can be fully tested by filling out a single week's timesheet and verifying submission locks the record. Delivers compliance value immediately.

**Acceptance Scenarios**:

1. **Given** a student accesses the timesheet form, **When** they enter hours for each day of the week, **Then** the system validates no day exceeds 24 hours
2. **Given** a student enters daily hours, **When** they complete the form, **Then** total hours are automatically calculated and displayed
3. **Given** a student submits a timesheet, **When** submission is confirmed, **Then** the timesheet becomes read-only and displays a submitted timestamp
4. **Given** a student views submitted timesheets, **When** they access the timesheet list, **Then** they can see all past submissions but cannot edit them

---

### User Story 5 - Upload Expense Documents (Priority: P2)

An OPT student needs to track expenses for reimbursement or tax purposes. The student navigates to expense management, uploads a receipt (PDF, JPG, or PNG), selects a category, enters the amount and description, and sees the expense appear in their list.

**Why this priority**: Expense tracking supports financial compliance and reimbursement workflows. While important, it's secondary to timesheets and curriculum tracking.

**Independent Test**: Can be fully tested by uploading a single expense with receipt and verifying it appears in the filtered list. Delivers organizational value for financial record-keeping.

**Acceptance Scenarios**:

1. **Given** a student uploads an expense receipt, **When** the file type is valid (PDF, JPG, PNG), **Then** the document is stored and linked to the expense record
2. **Given** a student creates an expense entry, **When** they select a category and enter amount, **Then** the expense appears in the expense list with preview capability
3. **Given** a student has multiple expenses, **When** they apply category filters, **Then** only expenses matching the selected category are displayed
4. **Given** a student views an expense, **When** they click the document link, **Then** they can preview or download the original receipt

---

### User Story 6 - Export Compliance Report (Priority: P2)

An OPT student needs to provide comprehensive documentation to their DSO or employer. The student clicks "Export OPT Package" from their dashboard, waits 2-3 seconds while the system generates a PDF, and downloads a complete compliance report containing their student information, I-20 details, curriculum progress summary, timesheet hours summary, and expense breakdown.

**Why this priority**: Provides the "output" of all tracked data in a professional, shareable format. Essential for compliance reviews but depends on other features being complete first.

**Independent Test**: Can be fully tested by clicking export and verifying PDF contains all expected sections with accurate data. Delivers high perceived value by transforming tracked data into official documentation.

**Acceptance Scenarios**:

1. **Given** a student has complete profile data, **When** they click "Export OPT Package," **Then** a PDF is generated containing student info and I-20 details
2. **Given** a student has curriculum progress, **When** the PDF is generated, **Then** it includes a summary of completed courses and progress percentage
3. **Given** a student has submitted timesheets, **When** the PDF is generated, **Then** it includes total hours worked across all timesheet submissions
4. **Given** a student has expense records, **When** the PDF is generated, **Then** it includes an expense breakdown organized by category
5. **Given** the PDF is generated, **When** the download completes, **Then** the filename follows format: `OPT_Package_[StudentName]_[Date].pdf`

---

### User Story 7 - DSO Dashboard View (Priority: P3)

A Designated School Official (DSO) needs to monitor all students under their supervision. The DSO logs in with administrator credentials, sees a list of all registered students with their compliance status, applies filters to find specific students, and exports timesheet data as CSV for institutional reporting.

**Why this priority**: Supports administrative oversight but is optional for core student functionality. Can be simplified or deferred if development time is constrained.

**Independent Test**: Can be fully tested by logging in as DSO and verifying student list display and CSV export. Delivers value for institutional compliance but doesn't block student workflows.

**Acceptance Scenarios**:

1. **Given** a DSO logs into the system, **When** they access the dashboard, **Then** they see a list of all registered students with basic info
2. **Given** the DSO views student records, **When** they apply status filters, **Then** only students matching the selected status are displayed
3. **Given** the DSO needs reporting data, **When** they click "Export Timesheets," **Then** a CSV file downloads containing all student timesheet data
4. **Given** the DSO views a student record, **When** they check compliance status, **Then** an indicator shows whether the student is compliant based on timesheet submissions

---

### Edge Cases

- What happens when a student tries to upload an I-20 document larger than 10MB?
- How does the system handle a student marking the same course complete multiple times?
- What validation prevents a student from submitting a timesheet with negative hours?
- What happens when a DSO exports timesheets but no timesheets exist in the system?
- How does the system handle special characters or extremely long names in PDF generation?
- What occurs if a student tries to upload expense receipts in unsupported formats (e.g., HEIC, BMP)?
- How does progress calculation work if a student's curriculum has zero courses assigned?
- What prevents concurrent timesheet submissions for the same week period?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow new students to create accounts by providing name, email, password, and institution information
- **FR-002**: System MUST validate email addresses are in proper format and not already registered
- **FR-003**: System MUST auto-generate a unique student ID for each new registration
- **FR-004**: System MUST allow students to upload I-20 documents during registration in PDF format
- **FR-005**: System MUST store uploaded documents securely and link them to student profiles
- **FR-006**: System MUST display a curriculum dashboard showing all assigned courses with status indicators
- **FR-007**: System MUST calculate and display curriculum progress as a percentage based on completed vs. total courses
- **FR-008**: System MUST provide an estimated completion date based on current progress pace
- **FR-009**: System MUST allow students to mark courses as complete with timestamp recording
- **FR-010**: System MUST recalculate progress automatically when course status changes
- **FR-011**: System MUST provide a weekly timesheet form with fields for each day (Monday-Sunday)
- **FR-012**: System MUST validate timesheet entries to prevent any day from exceeding 24 hours
- **FR-013**: System MUST automatically calculate and display total weekly hours
- **FR-014**: System MUST allow students to add project descriptions and work locations to timesheets
- **FR-015**: System MUST lock timesheets as read-only after submission with confirmation timestamp
- **FR-016**: System MUST allow students to view all previously submitted timesheets
- **FR-017**: System MUST allow students to upload expense receipts in PDF, JPG, or PNG formats
- **FR-018**: System MUST provide category selection for expense classification
- **FR-019**: System MUST allow students to enter expense amounts and descriptions
- **FR-020**: System MUST display expense lists with filtering by category
- **FR-021**: System MUST provide document preview or download for expense receipts
- **FR-022**: System MUST generate PDF compliance reports containing student info, I-20 details, curriculum progress, timesheet summaries, and expense breakdowns
- **FR-023**: System MUST name exported PDFs using format: `OPT_Package_[StudentName]_[Date].pdf`
- **FR-024**: System MUST provide DSO authentication with administrator-level access
- **FR-025**: System MUST display all registered students in DSO dashboard with status indicators
- **FR-026**: System MUST allow DSOs to filter student records by compliance status
- **FR-027**: System MUST allow DSOs to export timesheet data as CSV files
- **FR-028**: System MUST persist all student data, timesheets, expenses, and documents across sessions
- **FR-029**: System MUST prevent students from editing or deleting submitted timesheets
- **FR-030**: System MUST validate file uploads to reject unsupported formats

### Key Entities *(include if feature involves data)*

- **Student**: Represents an OPT student with name, email, password, institution, student ID, I-20 document reference, EAD expiration date, OPT start date, and account status
- **Course**: Represents an academic course with name, code, credits, semester, program association, and description
- **StudentCourse**: Links students to courses with status tracking (Not Started, In Progress, Completed), grade, and completion timestamp
- **Timesheet**: Represents a weekly work log with student reference, period start/end dates, daily hour entries, total hours, project description, work location, submission status, and submission timestamp
- **Expense**: Represents a financial expense with student reference, date, category, amount, description, receipt document reference, and upload timestamp
- **DSO**: Represents a Designated School Official with authentication credentials and administrative access level

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Students can complete registration from landing page to dashboard in under 3 minutes
- **SC-002**: Curriculum progress bar updates within 1 second of marking a course complete
- **SC-003**: Timesheet submission completes and locks within 2 seconds of clicking submit
- **SC-004**: Expense document uploads complete within 5 seconds for files up to 5MB
- **SC-005**: PDF export generates and downloads within 3 seconds for typical student data (10 courses, 10 timesheets, 10 expenses)
- **SC-006**: 100% of submitted timesheets are immutable and cannot be edited or deleted
- **SC-007**: System supports at least 100 concurrent student users without performance degradation
- **SC-008**: DSO can export all student timesheet data as CSV in under 10 seconds
- **SC-009**: 95% of students successfully complete their first timesheet submission without errors on first attempt
- **SC-010**: All file uploads validate format and reject unsupported types before processing
- **SC-011**: Progress calculations are accurate to the exact percentage (e.g., 3 of 10 courses = 30%)
- **SC-012**: Zero data loss occurs during any user operation (registration, submission, upload)

## Assumptions *(include if relevant)*

- **Assumption 1**: All students have access to modern web browsers (Chrome, Firefox, Safari, Edge) released within the last 2 years
- **Assumption 2**: Students will access the system primarily from desktop or laptop computers, though mobile responsiveness is desired
- **Assumption 3**: File uploads for I-20 documents and expense receipts will typically be under 5MB
- **Assumption 4**: Each student will have a single curriculum assigned at registration (pre-populated for MVP)
- **Assumption 5**: Timesheets are submitted weekly, with one timesheet per week period
- **Assumption 6**: DSO users will be created manually in the system (no self-registration for DSOs in MVP)
- **Assumption 7**: Email verification for student accounts will be mocked for demo purposes (not requiring actual email infrastructure)
- **Assumption 8**: Currency for expenses will default to USD for MVP scope
- **Assumption 9**: Student data will not need to be migrated from existing systems for initial deployment
- **Assumption 10**: System will operate in a single timezone (EST/EDT) for MVP

## Scope *(include if relevant)*

### In Scope (MVP - Day 1)

- Student registration with I-20 upload
- Profile viewing and basic information display
- Curriculum dashboard with progress visualization
- Course completion tracking with manual status updates
- Weekly timesheet form with validation and submission
- Timesheet history viewing (read-only)
- Expense upload with categorization
- Expense list with filtering
- PDF export of complete OPT compliance package
- DSO dashboard with student list
- DSO filtering by status
- DSO CSV export of timesheet data
- Session-based authentication
- Local file storage for documents
- Pre-populated curriculum data

### Out of Scope (Future Phases)

- Email notifications and reminders
- Multi-institution support with separate tenancy
- Advanced analytics and reporting dashboards
- Real-time SEVIS integration
- Automated load testing beyond 100 users
- Course curriculum creation/editing by DSOs
- Employer portal for timesheet approval
- Form I-983 training plan generation
- Mobile native applications (iOS/Android)
- Audit trail logging for all user actions
- Two-factor authentication
- Password reset via email
- Student profile editing after registration
- Bulk student import/export
- Custom report builder
- Integration with external calendar systems
- Automated compliance checks and alerts

## Dependencies *(include if relevant)*

- **Technical Dependencies**:
  - Reliable file storage system for document uploads (local filesystem for MVP)
  - PDF generation library capable of creating formatted documents
  - Web server infrastructure supporting HTTP sessions
  - Database system for persistent data storage (SQLite for MVP)

- **External Dependencies**:
  - Students must have valid I-20 documents to upload during registration
  - DSO credentials must be created by system administrators before DSO access

- **Process Dependencies**:
  - Curriculum structure must be defined and pre-populated before student registration
  - Expense categories must be predefined before students can categorize expenses

## Risks *(include if relevant)*

- **Risk 1**: Students may upload extremely large files that slow down the system or exceed storage capacity
  - *Mitigation*: Implement file size limits (10MB) with clear error messages

- **Risk 2**: Students may attempt to manipulate timesheet data after submission to alter compliance records
  - *Mitigation*: Enforce immutability of submitted timesheets at database level

- **Risk 3**: PDF generation may fail for students with incomplete data
  - *Mitigation*: Validate all required data exists before initiating PDF generation and provide clear error messages

- **Risk 4**: Concurrent course completion updates could cause race conditions in progress calculations
  - *Mitigation*: Implement atomic database transactions for status updates

- **Risk 5**: System may not scale beyond MVP user count (100 concurrent users) for production deployment
  - *Mitigation*: Document scalability limitations clearly and plan architecture review for Phase 2

---

**Note**: This specification is designed for rapid MVP development with a target completion time of 8-10 hours. All features prioritize functional completeness over polish, with the understanding that refinements will occur in subsequent phases.
