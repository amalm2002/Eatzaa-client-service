import { OtpFormProps } from "../../../interfaces/user/authentication/forgotPassword/otp-form.types";

const OtpForm = ({ otp, handleOtpChange, handleVerifyOtp, handleResendOtp, timer, errors }: OtpFormProps) => {
    return (
        <div className="max-w-md w-full space-y-6 animate-fadeIn">
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
        </div>
    );
};

export default OtpForm;