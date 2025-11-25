import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';

const TrainingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completingModuleId, setCompletingModuleId] = useState(null);

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const fetchTrainingData = async () => {
    try {
      const response = await api.get('/training/modules');
      setModules(response.data.modules);
      setProgress(response.data.progress);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load training data');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteModule = async (moduleId) => {
    setCompletingModuleId(moduleId);
    setError('');

    try {
      const response = await api.post(`/training/modules/${moduleId}/complete`);

      // Update local state
      setModules(prevModules =>
        prevModules.map(module =>
          module.id === moduleId
            ? { ...module, status: 'Completed', completion_date: new Date().toISOString() }
            : module
        )
      );

      // Update progress
      setProgress(response.data.progress);

      // Show celebration if 100% complete
      if (response.data.progress.percentage === 100) {
        alert('🎉 Congratulations! You have completed all training modules!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark module as complete');
    } finally {
      setCompletingModuleId(null);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Training Modules</h1>
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
              className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/training')}
              className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600"
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
        {error && <ErrorMessage message={error} />}

        {/* Progress Summary */}
        {progress && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Training Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Overall Progress</p>
                <p className="text-3xl font-bold text-blue-600">{progress.percentage}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-green-600">{progress.completed} modules</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-semibold text-yellow-600">{progress.inProgress} modules</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Not Started</p>
                <p className="text-2xl font-semibold text-gray-600">{progress.notStarted} modules</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{progress.completed} / {progress.total} completed</span>
                {progress.estimatedCompletionDate && (
                  <span>
                    Est. completion: {new Date(progress.estimatedCompletionDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p>Total Hours: {progress.completedHours} / {progress.totalHours} hours completed</p>
            </div>
          </div>
        )}

        {/* Training Modules List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Training Modules</h2>
          </div>

          {modules.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {modules.map((module) => (
                <div key={module.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{module.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                          {module.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{module.code}</p>
                      <p className="text-gray-700 mb-3">{module.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {module.estimated_hours} hours
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {module.category}
                        </span>
                        {module.completion_date && (
                          <span className="text-green-600">
                            Completed: {new Date(module.completion_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      {module.status !== 'Completed' && (
                        <button
                          onClick={() => handleCompleteModule(module.id)}
                          disabled={completingModuleId === module.id}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {completingModuleId === module.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            'Mark Complete'
                          )}
                        </button>
                      )}
                      {module.status === 'Completed' && (
                        <div className="flex items-center text-green-600">
                          <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="text-lg">No training modules assigned yet</p>
              <p className="text-sm mt-2">Check back later or contact your manager for module assignments</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrainingPage;
