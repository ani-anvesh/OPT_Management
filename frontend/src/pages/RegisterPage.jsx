import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Employee Development System
        </h1>
        <p className="text-gray-600">
          Register to start tracking your professional development
        </p>
      </div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
