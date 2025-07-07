import { LockKeyhole } from "lucide-react";
import { OtpFormProps } from "../../../../interfaces/restaurant/authentication/login/otp-form.types";

const OtpForm: React.FC<OtpFormProps> = ({
  formData,
  errors,
  handleOtpChange,
  handleSubmitOtp,
  handleResendOtp,
  isResendDisabled,
  timer,
}) => {
  return (
    <form onSubmit={handleSubmitOtp} className="space-y-6">
      <div>
        <label className="block text-blue-100 font-medium mb-1 text-center">
          Enter 6-digit OTP sent to your mobile
        </label>
        <p className="text-blue-200/70 text-sm text-center mb-4">
          We've sent a verification code to {formData.mobile}
        </p>
        {errors.otp && <p className="text-red-500 text-sm text-center">{errors.otp}</p>}
        <div className="flex justify-center gap-2 my-6 flex-wrap">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              id={`otp-${index}`}
              key={index}
              type="text"
              maxLength={1}
              value={formData.otp[index]}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-12 h-12 text-center text-xl font-bold bg-white/10 border-2 border-blue-300/30 rounded-lg focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300/30 transition-all duration-300 text-white"
            />
          ))}
        </div>
        <p className="text-blue-200 text-sm text-center">
          Didn't receive code?
          <button
            onClick={handleResendOtp}
            disabled={isResendDisabled}
            className={`text-orange-300 font-medium cursor-pointer hover:underline ${
              isResendDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
          </button>
        </p>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-medium text-lg hover:from-orange-600 hover:to-orange-700 transition duration-300 shadow-lg flex items-center justify-center gap-2"
        >
          <LockKeyhole className="w-5 h-5" />
          <span>Verify & Login</span>
        </button>
      </div>
      <div id="recaptcha-container"></div>
    </form>
  );
};

export default OtpForm;