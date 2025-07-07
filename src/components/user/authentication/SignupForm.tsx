import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { SignupFormProps } from '../../../interfaces/user/authentication/login/signup-form.types';

const SignupForm = ({
  formData,
  handleChange,
  handleSubmit,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}: SignupFormProps) => {
  return (
    <div className="max-w-md w-full p-8">
      <h2 className="text-2xl font-semibold text-[rgb(60,110,113)] text-center">
        Create Your Account
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-[rgb(60,110,113)]">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)]"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-[rgb(60,110,113)]">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)]"
            placeholder="name@example.com"
          />
        </div>
        <div>
          <label className="block text-[rgb(60,110,113)]">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)]"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-[rgb(60,110,113)]">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)]"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOffIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-[rgb(60,110,113)] text-white py-2 rounded-lg hover:bg-[rgb(50,100,103)] mt-4 transition-all"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center text-[-land
      rgb(60,110,113)] mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-[rgb(60,110,113)] font-semibold">
          Sign in
        </a>
      </p>
    </div>
  );
};

export default SignupForm;