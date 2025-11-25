<!--
SYNC IMPACT REPORT
==================
Version Change: 1.0.0 → 2.0.0 (MAJOR - backward incompatible project scope transformation)

Modified Principles:
- Core Principle #4: "OPT/F-1 privacy and compliance standards" → "HR/workplace privacy and data protection standards"
- Technical Constraints: "DSO roles" → "Manager roles"
- Overall project context: OPT Student Management → Employee Skill Development & Onboarding

Added Sections: None

Removed Sections: None

Templates Requiring Updates:
- ✅ .specify/templates/spec-template.md (already aligned with employee context via manual update)
- ⚠️ .specify/templates/plan-template.md (pending review for employee context alignment)
- ⚠️ .specify/templates/tasks-template.md (pending review for employee context alignment)
- ⚠️ README.md (pending update to reflect employee management system)

Follow-up TODOs:
- Update CLAUDE.md project overview section to reflect Employee Skill Development system
- Update any demo scripts or test data references from "students/DSO" to "employees/managers"

Date: 2025-11-24
-->

# Employee Skill Development & Onboarding System - Constitution

## Core Principles

- All code MUST be **clean, maintainable, and well-commented**.
- The UI and UX MUST be **responsive and visually appealing**, working on both desktop and mobile.
- All core flows MUST include **user validation** (client and server) and robust **error handling**.
- **Sensitive data** (documents, logs, profile info) MUST follow HR/workplace privacy and data protection standards.
- Every user story MUST define **explicit acceptance criteria** and have a demoable, testable outcome before merging.
- Functional delivery and demo-readiness ALWAYS take precedence over advanced features or polish in the MVP sprint.

## Technical Constraints

- Tech stack: React/Vite/Tailwind (frontend), Node/Express (backend), SQLite (database), local file storage for day-one MVP.
- Authentication: Secure session cookies only (no SSO/OAuth for MVP).
- PDF/report/document generation and file upload preview MUST be functional and testable in the demo environment.
- All demo/test accounts, sample data, and Manager roles must be pre-configured—no external services beyond basic deployment (e.g., Vercel/Heroku).

## Development Rules

- All feature proposals and code must be traceable back to a specific user story and acceptance criteria in the project specification.
- The BMAD (Build-Measure-Analyze-Document) method governs all feature delivery. No "vibe coding" or scope creep—every feature starts with a spec/task.
- Commit messages reference relevant user story IDs and must document key decisions or deviations.
- If demo-readiness is threatened, features are either **cut or replaced with stubs**. No partial implementations shipped as "done."
- Code review required before merging to main—even in a 1-day sprint.

## Audit & Amendments

- All requirements, implementation changes, and decisions are captured in the project's audit log (CHANGELOG.md or project board).
- The constitution may only be amended by updating this document, referencing rationale and date, and incrementing the constitution version.
- All open TODOs must be logged and tracked; no TODOs may remain unresolved for >48 hours or at demo time.

**Version:** 2.0.0
**Ratified:** 2025-11-24
**Last Amended:** 2025-11-24
