import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { validateForgotPassword } from '../../../utils/validation';
import Navbar from '../../../components/user/layouts/Navbar';
import EmailForm from '../../../components/user/forgot-password/EmailForm';
import OtpForm from '../../../components/user/forgot-password/OtpForm';
import ResetPasswordForm from '../../../components/user/forgot-password/ResetPasswordForm';
import Sidebar from '../../../components/user/forgot-password/Sidebar';
import { FormData } from '../../../interfaces/user/authentication/forgotPassword/form-data.types';
import { userApi } from '../../../api/endpoints/userApi';

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
            const response = await userApi.sendForgotPasswordOtp(dispatch, formData.email);
            setToken(response.token);
            setStep('otp');
            setTimer(120);
            setIsTimerActive(true);
            toast.success('OTP sent to your email');
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'An error occurred while sending OTP');
        }
    };

    const handleResendOtp = async () => {
        try {
            const response = await userApi.sendForgotPasswordOtp(dispatch, formData.email);
            setToken(response.token);
            setTimer(120);
            setIsTimerActive(true);
            setOtp(['', '', '', '']);
            toast.success('OTP resent to your email');
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
            await userApi.verifyForgotPasswordOtp(dispatch, {
                email: formData.email,
                otp: otpCode,
                token,
            });
            setStep('reset');
            setIsTimerActive(false);
            toast.success('OTP verified successfully');
        } catch (error: any) {
            setErrors({ otp: error.response?.data?.message || 'Invalid OTP' });
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForgotPassword({
            email: formData.email,
            newPassword,
            confirmPassword,
        });
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await userApi.resetPassword(dispatch, {
                email: formData.email,
                password: newPassword,
                token,
            });
            toast.success('Password reset successfully');
            navigate('/login');
        } catch (error: any) {
            setServerError(error.response?.data?.message || 'An error occurred while resetting password');
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 py-8">
                <div className="flex flex-col md:flex-row bg-white shadow-2xl rounded-2xl overflow-hidden max-w-4xl w-full h-[500px] md:h-[600px] transition-all duration-300">
                    <Sidebar />
                    <div className="flex-1 p-6 md:p-10 flex justify-center items-center bg-white h-full">
                        {serverError && <div className="text-red-500 text-center">{serverError}</div>}
                        {step === 'email' && (
                            <EmailForm
                                formData={formData}
                                handleChange={handleChange}
                                handleSendOtp={handleSendOtp}
                                errors={errors}
                            />
                        )}
                        {step === 'otp' && (
                            <OtpForm
                                otp={otp}
                                handleOtpChange={handleOtpChange}
                                handleVerifyOtp={handleVerifyOtp}
                                handleResendOtp={handleResendOtp}
                                timer={timer}
                                errors={errors}
                            />
                        )}
                        {step === 'reset' && (
                            <ResetPasswordForm
                                newPassword={newPassword}
                                setNewPassword={setNewPassword}
                                confirmPassword={confirmPassword}
                                setConfirmPassword={setConfirmPassword}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                showConfirmPassword={showConfirmPassword}
                                setShowConfirmPassword={setShowConfirmPassword}
                                handleResetPassword={handleResetPassword}
                                errors={errors}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;