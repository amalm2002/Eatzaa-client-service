import { useState, useEffect, useRef } from "react";
import { ConfirmationResult } from "firebase/auth";
import { useDispatch } from "react-redux";
import { deliveryBoyLogin } from "../../../../service/redux/slices/deliveryBoySlice";
import { auth } from "../../../../service/firebase/firebase";
import { sendOtp } from "../../../../hooks/auth";
import { useNavigate } from "react-router-dom";

type Page = 'login' | 'otp' | 'details' | 'vehicle' | 'zone' | 'location' | 'resubmit';

interface OtpPageProps {
    mobileNumber: string;
    setOtp: React.Dispatch<React.SetStateAction<string>>;
    handleNavigation: (page: Page) => void;
    confirmationResult: ConfirmationResult | null;
    backendData: {
        token: string;
        refreshToken: string;
        _id: string;
        mobile: string;
        isVerified: boolean;
        message: string;
        missingFields: string;
    } | null;
}

const OtpPage: React.FC<OtpPageProps> = ({
    mobileNumber,
    setOtp,
    handleNavigation,
    confirmationResult,
    backendData,

}) => {

    const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);

    const [error, setError] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState<number>(30);
    const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
    const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

    const navigate = useNavigate()
    const dispatch = useDispatch();

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            setIsResendDisabled(false);
        }
    }, [timeLeft]);

    const handleDigitChange = (index: number, value: string): void => {
        if (!/^\d?$/.test(value)) return;
        const newDigits = [...digits];
        newDigits[index] = value;
        setDigits(newDigits);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Backspace' && !digits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const otpValue = digits.join('');
        if (otpValue.length !== 6) {
            setError('Please enter all 6 digits of the OTP');
            return;
        }
        if (timeLeft === 0) {
            setError('OTP has expired. Please request a new OTP.');
            return;
        }
        if (confirmationResult && backendData) {
            confirmationResult
                .confirm(otpValue)
                .then(() => {
                    setOtp(otpValue);
                    setError('');
                    // Store tokens and dispatch login action
                    localStorage.setItem('deliveryBoyToken', backendData.token);
                    localStorage.setItem('deliveryBoyRefreshToken', backendData.refreshToken);
                    localStorage.setItem('role', 'DeliveryBoy');
                    localStorage.setItem('deliveryBoyId',backendData._id)
                   
                    // handleNavigation('location');
                    console.log("backend dara", backendData);

                    const missing = backendData.missingFields

                    if (missing === "location") {
                        handleNavigation('location');
                    } else if (missing === 'vehicle') {
                        handleNavigation('vehicle');
                    } else if (missing === "details") {
                        handleNavigation('details');
                    } else if (missing === 'zone') {
                        handleNavigation('zone')
                    } else if (backendData.message === 'You are already registered' && backendData.isVerified !== false) {
                        dispatch(
                            deliveryBoyLogin({
                                delivery_boy_id: backendData._id,
                                delivery_boy_name: backendData.mobile,
                                role: 'DeliveryBoy',
                                isLogin: true,
                                // isOnline: false,?
                            })
                        );
                        navigate('/deliveryBoy-Home')
                    }

                })
                .catch(() => {
                    setError('Invalid OTP. Please try again.');
                });
        } else {
            setError('OTP verification failed. Please try again.');
        }
    };

    const handleResend = (): void => {
        setTimeLeft(30);
        setIsResendDisabled(true);
        setDigits(['', '', '', '', '', '']);
        setError('');
        sendOtp(handleNavigation, auth, mobileNumber, (result: any) => {
            const parent = document.getElementById('deliveryBoyLogin');
            if (parent) {
                parent.dispatchEvent(
                    new CustomEvent('updateConfirmationResult', { detail: result })
                );
            }
        });
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full">
            <button
                onClick={() => handleNavigation('login')}
                className="mb-6 flex items-center text-orange-500 hover:text-orange-700"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                    />
                </svg>
                Back
            </button>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">OTP Verification</h2>
                <p className="text-gray-500 mt-2">
                    Enter the 6-digit code sent to +91 {mobileNumber}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between gap-2">
                        {digits.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el: any) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleDigitChange(index, e.target.value)
                                }
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                                    handleKeyDown(index, e)
                                }
                                className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500"
                            />
                        ))}
                    </div>
                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 text-white font-medium py-4 px-6 rounded-xl transition duration-150 ease-in-out shadow-md hover:shadow-lg"
                >
                    Verify & Continue
                </button>
                <div id="recaptcha-container"></div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    {timeLeft > 0 ? (
                        <>Resend OTP in <span className="font-medium">{timeLeft}s</span></>
                    ) : (
                        <button
                            onClick={handleResend}
                            disabled={isResendDisabled}
                            className="text-orange-600 font-medium hover:text-orange-700 disabled:opacity-50"
                        >
                            Resend OTP
                        </button>
                    )}
                </p>
            </div>
        </div>
    );
};

export default OtpPage;