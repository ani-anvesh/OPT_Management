import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Employee Development System
        </h1>
        <p className="text-gray-600">
          Track your professional growth and compliance
        </p>
      </div>
      <LoginForm />
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
        <h3 className="font-bold text-blue-900 mb-2">Demo Credentials:</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Employee:</strong> john.doe@company.com / Password123</p>
          <p><strong>Manager:</strong> manager@company.com / Manager123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
