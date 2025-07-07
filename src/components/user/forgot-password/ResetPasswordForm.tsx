import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ResetPasswordFormProps } from '../../../interfaces/user/authentication/forgotPassword/rest-password-form.types';

const ResetPasswordForm = ({
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    handleResetPassword,
    errors,
}: ResetPasswordFormProps) => {
    return (
        <div className="max-w-md w-full space-y-6 animate-fadeIn">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
                <p className="text-gray-500 mt-2">Enter your new password</p>
            </div>
            <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="relative">
                    <label className="block text-gray-700 font-medium">New Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full px-4 py-3 border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)] transition-all`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 transition-all"
                    >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                </div>
                <div className="relative">
                    <label className="block text-gray-700 font-medium">Confirm Password</label>
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)] transition-all`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-11 text-gray-500 hover:text-gray-700 transition-all"
                    >
                        {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-[rgb(60,110,113)] text-white py-3 rounded-lg hover:bg-[rgb(50,100,105)] transition-all transform hover:scale-105"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPasswordForm;