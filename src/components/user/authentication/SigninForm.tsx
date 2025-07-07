import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { SigninFormProps } from '../../../interfaces/user/authentication/register/signin-form.types';

const SigninForm = ({
  formData,
  handleChange,
  handleSubmit,
  errors,
  showPassword,
  setShowPassword,
  serverError,
}: SigninFormProps) => {
  return (
    <div className="max-w-md w-full p-8">
      <h2 className="text-2xl font-semibold text-gray-800 text-center">Welcome Back!</h2>
      <p className="text-gray-500 text-center">Sign in to continue your journey with FoodHub</p>

      {serverError && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-4">
          <label className="block text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)] ${
              errors.email ? 'border-red-500' : ''
            }`}
            placeholder="name@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)] ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          className="w-full bg-[rgb(60,110,113)] text-white py-2 rounded-lg hover:bg-[rgb(50,100,105)] transition-all"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-gray-700 mt-4">
        <a href="/forgot-password" className="text-[rgb(60,110,113)]">Forgot password</a>
      </p>
    </div>
  );
};

export default SigninForm;