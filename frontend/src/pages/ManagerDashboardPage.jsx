import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';

const ManagerDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [timesheets, setTimesheets] = useState([]);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('submitted');
  const [view, setView] = useState('overview'); // 'overview', 'timesheets', 'timesheet-detail'

  useEffect(() => {
    fetchData();
  }, [statusFilter, view]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (view === 'overview') {
        const statsResponse = await api.get('/manager/stats');
        setStats(statsResponse.data);

        const timesheetsResponse = await api.get('/manager/timesheets/pending');
        setTimesheets(timesheetsResponse.data.timesheets);
      } else if (view === 'timesheets') {
        const params = statusFilter !== 'all' ? { status: statusFilter } : {};
        const timesheetsResponse = await api.get('/manager/timesheets', { params });
        setTimesheets(timesheetsResponse.data.timesheets);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimesheetDetails = async (timesheetId) => {
    try {
      setLoading(true);
      const response = await api.get(`/manager/timesheets/${timesheetId}`);
      setSelectedTimesheet(response.data.timesheet);
      setView('timesheet-detail');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load timesheet details');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (timesheetId) => {
    if (!confirm('Are you sure you want to approve this timesheet?')) {
      return;
    }

    try {
      await api.post(`/manager/timesheets/${timesheetId}/approve`);
      setView('overview');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve timesheet');
    }
  };

  const handleReject = async (timesheetId) => {
    const reason = prompt('Please provide a reason for rejection (optional):');

    try {
      await api.post(`/manager/timesheets/${timesheetId}/reject`, { reason });
      setView('overview');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject timesheet');
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !stats && !selectedTimesheet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
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
              onClick={() => setView('overview')}
              className={`py-4 px-1 text-sm font-medium ${
                view === 'overview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setView('timesheets')}
              className={`py-4 px-1 text-sm font-medium ${
                view === 'timesheets' || view === 'timesheet-detail'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Timesheets
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && <ErrorMessage message={error} />}

        {view === 'overview' && stats && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Timesheets</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.timesheetStats.pending_timesheets}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Employees</h3>
                <p className="text-3xl font-bold text-gray-900">{stats.employeeStats.total_employees}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Approved</h3>
                <p className="text-3xl font-bold text-green-600">{stats.timesheetStats.approved_timesheets}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Rejected</h3>
                <p className="text-3xl font-bold text-red-600">{stats.timesheetStats.rejected_timesheets}</p>
              </div>
            </div>

            {/* Pending Timesheets */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Pending Timesheets</h2>
              </div>
              {timesheets.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {timesheets.map((timesheet) => (
                    <div
                      key={timesheet.id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {timesheet.employee_name}
                            </h3>
                            <span className="text-sm text-gray-500">({timesheet.employee_number})</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(timesheet.status)}`}>
                              {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <span>{timesheet.department}</span>
                            <span>Week of {formatDate(timesheet.week_start_date)}</span>
                            <span>{timesheet.total_hours} hours</span>
                            {timesheet.submitted_at && (
                              <span>Submitted: {formatDate(timesheet.submitted_at)}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => fetchTimesheetDetails(timesheet.id)}
                            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-sm"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleApprove(timesheet.id)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(timesheet.id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <p className="text-lg">No pending timesheets</p>
                  <p className="text-sm mt-2">All timesheets have been reviewed</p>
                </div>
              )}
            </div>
          </>
        )}

        {view === 'timesheets' && (
          <>
            {/* Filter Bar */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Filter by status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* All Timesheets */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">All Timesheets</h2>
              </div>
              {timesheets.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {timesheets.map((timesheet) => (
                    <div
                      key={timesheet.id}
                      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => fetchTimesheetDetails(timesheet.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {timesheet.employee_name}
                            </h3>
                            <span className="text-sm text-gray-500">({timesheet.employee_number})</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(timesheet.status)}`}>
                              {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <span>{timesheet.department}</span>
                            <span>Week of {formatDate(timesheet.week_start_date)}</span>
                            <span>{timesheet.total_hours} hours</span>
                            {timesheet.submitted_at && (
                              <span>Submitted: {formatDate(timesheet.submitted_at)}</span>
                            )}
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <p className="text-lg">No timesheets found</p>
                </div>
              )}
            </div>
          </>
        )}

        {view === 'timesheet-detail' && selectedTimesheet && (
          <TimesheetDetail
            timesheet={selectedTimesheet}
            onBack={() => {
              setSelectedTimesheet(null);
              setView('timesheets');
            }}
            onApprove={handleApprove}
            onReject={handleReject}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
          />
        )}
      </main>
    </div>
  );
};

// Timesheet Detail Component
const TimesheetDetail = ({ timesheet, onBack, onApprove, onReject, formatDate, getStatusColor }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {timesheet.employee_name} - Week of {formatDate(timesheet.week_start_date)}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {timesheet.employee_number} | {timesheet.department}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(timesheet.status)}`}>
          {timesheet.status.charAt(0).toUpperCase() + timesheet.status.slice(1)}
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Total Hours</p>
            <p className="text-2xl font-bold text-blue-600">{timesheet.total_hours}</p>
          </div>
          {timesheet.submitted_at && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Submitted</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(timesheet.submitted_at)}</p>
            </div>
          )}
        </div>

        {timesheet.entries && timesheet.entries.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timesheet.entries.map((entry, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatDate(entry.date)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {entry.hours}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {entry.project_description || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {entry.work_location}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {timesheet.status === 'submitted' && (
          <div className="flex justify-end space-x-4">
            <button
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => onReject(timesheet.id)}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Reject
            </button>
            <button
              onClick={() => onApprove(timesheet.id)}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboardPage;
