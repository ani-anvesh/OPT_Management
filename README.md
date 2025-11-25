# Employee Skill Development & Onboarding System

A comprehensive employee management system for tracking professional development, training progress, timesheets, and expenses with manager oversight capabilities.

## 🚀 Features

### Employee Features
- **Self-Onboarding**: Register with unique employee ID generation and work eligibility document upload
- **Training Progress**: Track assigned training modules with real-time progress calculation
- **Interactive Completion**: Mark modules as complete with instant progress updates
- **Timesheet Management**: Submit weekly timesheets with daily breakdown
- **Expense Tracking**: Upload expenses with receipt attachments (PDF, JPG, PNG)
- **PDF Export**: Generate professional reports for timesheets and expenses

### Manager Features
- **Dashboard Overview**: Real-time statistics for pending, approved, and rejected timesheets
- **Approval Workflows**: Review and approve/reject employee timesheets
- **Employee Oversight**: View all employees and their submission status
- **Filtering & Search**: Filter timesheets by status and employee

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: SQLite with better-sqlite3
- **Authentication**: express-session with bcrypt
- **File Upload**: Multer
- **PDF Generation**: PDFKit

## 📋 Prerequisites

- Node.js 18+
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd OPT_Management
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Setup Database
```bash
cd ../server
npm run seed
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd server
npm run dev
```
Backend will run on `http://localhost:3001`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 👤 Demo Credentials

### Employee Account
- **Email**: john.doe@company.com
- **Password**: Password123

### Manager Account
- **Email**: manager@company.com
- **Password**: Manager123

### Admin Account
- **Email**: admin@company.com
- **Password**: Admin123

## 📁 Project Structure

```
OPT_Management/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── App.jsx         # Main app component
│   └── package.json
├── server/                  # Express backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Express middleware
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── database/          # Database & seeds
│   └── uploads/           # File storage
└── specs/                  # Feature specifications
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Employee registration
- `POST /api/auth/login` - Login (employee/manager)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees/dashboard` - Employee dashboard data

### Training
- `GET /api/training/modules` - Get assigned training modules
- `POST /api/training/modules/:id/complete` - Mark module complete

### Timesheets
- `GET /api/timesheets` - Get employee timesheets
- `POST /api/timesheets` - Create timesheet
- `GET /api/timesheets/:id` - Get timesheet details
- `POST /api/timesheets/:id/submit` - Submit timesheet

### Expenses
- `GET /api/expenses` - Get employee expenses
- `POST /api/expenses` - Create expense (with file upload)
- `GET /api/expenses/summary` - Get expense statistics
- `DELETE /api/expenses/:id` - Delete expense

### Export
- `GET /api/export/timesheet/:id` - Export timesheet as PDF
- `GET /api/export/expenses` - Export expenses as PDF

### Manager
- `GET /api/manager/stats` - Dashboard statistics
- `GET /api/manager/timesheets` - All timesheets
- `GET /api/manager/timesheets/:id` - Timesheet details
- `POST /api/manager/timesheets/:id/approve` - Approve timesheet
- `POST /api/manager/timesheets/:id/reject` - Reject timesheet
- `GET /api/manager/employees` - All employees

## 📊 Database Schema

The system uses SQLite with the following main tables:
- **employees**: User accounts and profile information
- **training_modules**: Available training courses
- **employee_training**: Training assignments and progress
- **timesheets**: Weekly timesheet records
- **timesheet_entries**: Daily hour entries
- **expenses**: Expense records with receipt paths
- **managers**: Manager accounts

## 🎯 User Stories Implemented

1. ✅ **US1**: Employee Self-Onboarding
2. ✅ **US2**: Training Progress Tracking
3. ✅ **US3**: Interactive Module Completion
4. ✅ **US4**: Timesheet Management
5. ✅ **US5**: Expense Upload
6. ✅ **US6**: PDF Export
7. ✅ **US7**: Manager Dashboard

## 🧪 Testing

### Manual Testing
1. Register a new employee account
2. Login and explore the dashboard
3. Mark training modules as complete
4. Create and submit a timesheet
5. Add expenses with receipts
6. Export PDF reports
7. Login as manager and review submissions

### Test Data
The seed script creates:
- 5 demo employees
- 10 training modules
- 2 manager accounts
- Sample timesheets and expenses

## 🔒 Security Features

- Password hashing with bcrypt
- Session-based authentication
- HTTP-only secure cookies
- File type and size validation
- Role-based access control
- SQL injection prevention

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3001
SESSION_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3001/api
```

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy dist folder to Vercel
```

### Backend (Railway/Heroku)
```bash
cd server
npm start
# Configure environment variables in platform
```

## 📚 Documentation

- [Technical Specification](./specs/001-opt-mvp/spec.md)
- [Implementation Plan](./specs/001-opt-mvp/plan.md)
- [Project Constitution](./specs/001-opt-mvp/constitution.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC

## 👥 Authors

- Development powered by Claude Code

## 🆘 Support

For issues or questions, please create an issue in the repository.

---

**Status**: MVP Complete ✅
**Version**: 1.0.0
**Last Updated**: 2025-11-25
