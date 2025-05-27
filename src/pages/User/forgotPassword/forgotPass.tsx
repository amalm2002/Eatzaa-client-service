import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Navbar from '../../../components/user/Navbar';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import createAxios from '../../../service/axiousServices/userAxious';
import { toast } from 'sonner';
import { validateForgotPassword } from '../../../utils/validation';

interface FormData {
    email: string;
    otp?: string;
    newPassword?: string;
    confirmPassword?: string;
}

const ForgotPassword: React.FC = () => {
    const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [formData, setFormData] = useState<FormData>({ email: '' });
    const [otp, setOtp] = useState(['', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [timer, setTimer] = useState(120);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [token, setToken] = useState<string>('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosInstance = createAxios(dispatch);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ email: e.target.value });
        setErrors({});
        if (serverError) {
            setServerError(null);
        }
    };

    const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validateForgotPassword({ email: formData.email });
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axiosInstance.post('/forgot-password-check', { email: formData.email });
            if (response.data.message === 'OTP sent successfully') {
                setToken(response.data.token);
                setStep('otp');
                setTimer(120);
                setIsTimerActive(true);
                toast.success('OTP sent to your email');
            } else {
                setServerError(response.data.message || 'Failed to send OTP');
            }
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'An error occurred while sending OTP');
        }
    };

    const handleResendOtp = async () => {
        try {
            const response = await axiosInstance.post('/forgot-password-check', { email: formData.email });
            if (response.data.message === 'OTP sent successfully') {
                setToken(response.data.token);
                setTimer(120);
                setIsTimerActive(true);
                setOtp(['', '', '', '']);
                toast.success('OTP resent to your email');
            } else {
                setServerError(response.data.message || 'Failed to resend OTP');
            }
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'An error occurred while sending OTP');
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (/^\d?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            setErrors({});
            if (value && index < 3) {
                document.getElementById(`otp-${index + 1}`)?.focus();
            }
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpCode = otp.join('');
        if (timer <= 0) {
            setErrors({ otp: 'OTP has expired' });
            return;
        }
        if (otpCode.length !== 4 || !/^\d{4}$/.test(otpCode)) {
            setErrors({ otp: 'Please enter a valid 4-digit OTP' });
            return;
        }

        try {
            const response = await axiosInstance.post('/verify-otp', {
                email: formData.email,
                otp: otpCode,
                token
            });

            if (response.data.message === 'OTP verified') {
                setStep('reset');
                setIsTimerActive(false);
                toast.success('OTP verified successfully');
            } else {
                setErrors({ otp: 'Invalid OTP' });
            }
        } catch (error: any) {
            setErrors({ otp: error.response?.data?.message || 'Invalid OTP' });
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForgotPassword({
            email: formData.email,
            newPassword,
            confirmPassword
        });
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const response = await axiosInstance.post('/reset-password', {
                email: formData.email,
                password: newPassword,
                token,
            });
            if (response.data.message === 'Password reset successfully') {
                toast.success('Password reset successfully');
                navigate('/login');
            } else {
                setServerError(response.data.message || 'Failed to reset password');
            }
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'An error occurred while resetting password');
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-8">
                <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden max-w-4xl w-full h-[500px] md:h-[600px] transition-all duration-300">
                    <div className="hidden md:flex flex-1 bg-[rgb(60,110,113)] text-white p-12 flex-col justify-center items-center h-full">
                        <h2 className="text-4xl font-bold tracking-tight animate-fadeIn">FoodHub</h2>
                        <h3 className="text-2xl mt-3 font-semibold">Taste Excellence</h3>
                        <p className="mt-6 text-center text-lg max-w-xs animate-slideUp">
                            Reset your password and dive back into a world of delicious meals!
                        </p>
                        <ul className="mt-8 space-y-4 text-left">
                            <li className="flex items-center text-lg animate-slideUp delay-100">
                                <span className="text-yellow-300 mr-3">✔</span> Seamless Ordering
                            </li>
                            <li className="flex items-center text-lg animate-slideUp delay-200">
                                <span className="text-yellow-300 mr-3">✔</span> Exclusive Offers
                            </li>
                            <li className="flex items-center text-lg animate-slideUp delay-300">
                                <span className="text-yellow-300 mr-3">✔</span> 24/7 Support
                            </li>
                        </ul>
                        <div className="mt-10 text-sm text-center animate-slideUp delay-400">
                            <p>📍 123 Gourmet Street, Foodville</p>
                            <p>📞 +1 (555) 123-4567</p>
                        </div>
                    </div>

                    <div className="flex-1 p-6 md:p-10 flex justify-center items-center bg-white h-full">
                        <div className="max-w-md w-full space-y-6 animate-fadeIn">
                            {serverError && (
                                <div className="text-red-500 text-center">{serverError}</div>
                            )}
                            {step === 'email' && (
                                <>
                                    <div className="text-center">
                                        <h2 className="text-3xl font-bold text-gray-800">Forgot Password</h2>
                                        <p className="text-gray-500 mt-2">Enter your email to receive an OTP</p>
                                    </div>
                                    <form onSubmit={handleSendOtp} className="space-y-6">
                                        <div>
                                            <label className="block text-gray-700 font-medium">Email Address</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)] transition-all`}
                                                placeholder="name@example.com"
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-[rgb(60,110,113)] text-white py-3 rounded-lg hover:bg-[rgb(50,100,105)] transition-all transform hover:scale-105"
                                        >
                                            Send OTP
                                        </button>
                                    </form>
                                </>
                            )}

                            {step === 'otp' && (
                                <>
                                    <div className="text-center">
                                        <h2 className="text-3xl font-bold text-gray-800">Enter OTP</h2>
                                        <p className="text-gray-500 mt-2">Check your email for the 4-digit code</p>
                                    </div>
                                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                                        <div className="flex justify-center space-x-3">
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    id={`otp-${index}`}
                                                    type="text"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    className={`w-14 h-14 text-center text-xl border ${errors.otp ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(60,110,113)] transition-all`}
                                                    
                                                />
                                            ))}
                                        </div>
                                        {errors.otp && <p className="text-red-500 text-sm text-center">{errors.otp}</p>}
                                        <div className="text-center">
                                            <p className="text-gray-600">
                                                Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleResendOtp}
                                                disabled={timer > 0}
                                                className={`text-[rgb(60,110,113)] hover:underline mt-2 ${timer > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-all'}`}
                                            >
                                                Resend OTP
                                            </button>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-[rgb(60,110,113)] text-white py-3 rounded-lg hover:bg-[rgb(50,100,105)] transition-all transform hover:scale-105"
                                        >
                                            Verify OTP
                                        </button>
                                    </form>
                                </>
                            )}

                            {step === 'reset' && (
                                <>
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;