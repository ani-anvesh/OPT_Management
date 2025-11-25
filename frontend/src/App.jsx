import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';
import TrainingPage from './pages/TrainingPage';

// Placeholder pages - will be created in later phases
const TimesheetPage = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Timesheet Page</h1></div>;
const ExpensePage = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Expense Page</h1></div>;
const ManagerDashboard = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Manager Dashboard</h1></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <EmployeeDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/training"
            element={
              <ProtectedRoute>
                <TrainingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/timesheets"
            element={
              <ProtectedRoute>
                <TimesheetPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <ExpensePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager/dashboard"
            element={
              <ProtectedRoute requireManager={true}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
