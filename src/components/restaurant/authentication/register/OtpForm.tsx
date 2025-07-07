import { Utensils } from "lucide-react";
import { OtpFormProps } from "../../../../interfaces/restaurant/authentication/register/otp-form.types";

const OtpForm = ({ otp, error, timer, isExpired, mobile, handleOtpChange, handleVerifyOtp, handleResendOtp, setStep }: OtpFormProps) => {
  return (
    <div className="md:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
            <Utensils className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Verify OTP</h2>
          <p className="text-gray-500">Enter the OTP sent to {mobile}</p>
        </div>

        <div className="space-y-4 md:space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-center">Enter 4-digit OTP</label>
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-300 bg-white"
                />
              ))}
            </div>
            {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
          </div>

          <div className="pt-2">
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-800 text-white py-3 md:py-4 rounded-lg font-medium text-lg hover:from-blue-600 hover:to-blue-900 transition duration-300 shadow-lg"
            >
              Verify OTP
            </button>
          </div>

          <div className="text-center">
            {timer > 0 ? (
              <p className="text-gray-500 text-sm">
                Time remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
              </p>
            ) : (
              <p className="text-blue-600 font-medium cursor-pointer hover:underline" onClick={handleResendOtp}>
                Resend OTP
              </p>
            )}
            <p className="text-blue-600 font-medium cursor-pointer hover:underline mt-2" onClick={() => setStep("credentials")}>
              Back to Registration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpForm;