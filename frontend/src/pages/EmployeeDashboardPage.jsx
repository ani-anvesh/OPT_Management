import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';

const EmployeeDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/employees/dashboard');
      setDashboard(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ErrorMessage message={error} />
      </div>
    );
  }

  const { profile, recentTraining, recentTimesheets, recentExpenses } = dashboard;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/training')}
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Training
            </button>
            <button
              onClick={() => navigate('/timesheets')}
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Timesheets
            </button>
            <button
              onClick={() => navigate('/expenses')}
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Expenses
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Summary Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="text-lg font-semibold text-gray-900">{profile.employee_id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="text-lg font-semibold text-gray-900">{profile.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(profile.employment_start_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-lg font-semibold text-green-600 capitalize">{profile.status}</p>
            </div>
          </div>
          {profile.work_eligibility_doc_path && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Work Eligibility Document</p>
              <a
                href={`http://localhost:3001${profile.work_eligibility_doc_path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View Document
              </a>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Training Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Training Progress</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-blue-600">{profile.training.percentage}%</span>
              <span className="text-sm text-gray-500">
                {profile.training.completed} / {profile.training.total} modules
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${profile.training.percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Timesheets */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Timesheets</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-green-600">{profile.timesheets.submitted}</span>
              <span className="text-sm text-gray-500">Submitted</span>
            </div>
            <p className="text-sm text-gray-600">
              Total Hours: {profile.timesheets.totalHours || 0} hrs
            </p>
          </div>

          {/* Expenses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expenses</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-purple-600">{profile.expenses.count}</span>
              <span className="text-sm text-gray-500">Submissions</span>
            </div>
            <p className="text-sm text-gray-600">
              Total: ${(profile.expenses.totalAmount || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Training */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Training</h3>
              <button
                onClick={() => navigate('/training')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View All
              </button>
            </div>
            {recentTraining.length > 0 ? (
              <div className="space-y-3">
                {recentTraining.map((module) => (
                  <div key={module.id} className="border-l-4 border-blue-500 pl-3 py-2">
                    <p className="font-medium text-gray-900">{module.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{module.code}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        module.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        module.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {module.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No training modules assigned yet</p>
            )}
          </div>

          {/* Recent Timesheets */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Timesheets</h3>
              <button
                onClick={() => navigate('/timesheets')}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                View All
              </button>
            </div>
            {recentTimesheets.length > 0 ? (
              <div className="space-y-3">
                {recentTimesheets.map((timesheet) => (
                  <div key={timesheet.id} className="border-l-4 border-green-500 pl-3 py-2">
                    <p className="font-medium text-gray-900">
                      Week of {new Date(timesheet.week_start_date).toLocaleDateString()}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{timesheet.total_hours} hours</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        timesheet.status === 'submitted' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {timesheet.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No timesheets submitted yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboardPage;
