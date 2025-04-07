import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import createAxios from "../../service/axiousServices/userAxious";
import { useLocation, useNavigate } from "react-router-dom";


const OtpPage: React.FC = () => {

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedStartTime = localStorage.getItem("otpTimerStart");

    if (savedStartTime) {
      const elapsedTime = Math.floor((Date.now() - parseInt(savedStartTime)) / 1000);
      const remainingTime = Math.max(30 - elapsedTime, 0);
      setTimer(remainingTime);
      if (remainingTime === 0) {
        setIsExpired(true);
        setIsResendDisabled(false);
        setError("OTP has expired. Please resend.");
      }
    } else {
      localStorage.setItem("otpTimerStart", Date.now().toString());
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setIsResendDisabled(false);
      setIsExpired(true);
      setError("OTP has expired. Please resend.");
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    if (isExpired) {
      toast.error("OTP has expired. Please resend.");
      setError("OTP has expired. Please resend.");
      return;
    }

    const enteredOtp = otp.join("");
    const axiosInstance = createAxios();

    if (enteredOtp.length === 4) {
      try {
        const response = await axiosInstance.post("/signup", {
          email: location.state?.email || "",
          otp: enteredOtp,
          formData: location.state?.formData,
          token: location.state?.token,
        });

        // console.log('responeseeeeeeeeeeeeeee', response);


        toast.success(response.data.message);
        localStorage.setItem("userToken", response.data.token);
        localStorage.removeItem("otpTimerStart");

        if (response.data.message === "invalid otp") {
          setError(response?.data?.message || "Invalid OTP");
          toast.error(response.data.message);
        } else if (response.data.message === "Success") {
          navigate("/login");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "OTP verification failed");
      }
    } else {
      setError("Please enter a valid 4-digit OTP.");
    }
  };

  const handleResendOtp = async () => {
    setOtp(["", "", "", ""]);
    setTimer(30);
    setIsResendDisabled(true);
    setIsExpired(false);
    setError(null);
    localStorage.setItem("otpTimerStart", Date.now().toString());
    alert("OTP Resent!");

    try {
      const axiosInstance = createAxios();
      const response = await axiosInstance.post("/resendOtp", {
        email: location.state?.email,
        formData: location.state?.formData,
      });

      if (response.data.token) {
        navigate(".", { state: { ...location.state, token: response.data.token } });
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
        <div className="bg-[rgb(60,110,113)] p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold text-white">OTP Verification</h2>
          <p className="text-white/80 mt-2">Enter the 4-digit OTP sent to your phone</p>

          <div className="flex justify-center gap-3 mt-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-white/50 bg-white text-[rgb(60,110,113)] rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-white"
              />
            ))}
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <button
            onClick={handleVerify}
            className="w-full bg-white text-[rgb(60,110,113)] py-2 rounded-lg hover:bg-white/90 mt-6 transition-all duration-300 font-semibold"
          >
            Verify OTP
          </button>

          <p className="text-white mt-4">
            {timer > 0 ? (
              <>Resend OTP in <span className="font-semibold text-white">{timer}s</span></>
            ) : (
              <>You can now resend OTP</>
            )}
          </p>

          <button
            onClick={handleResendOtp}
            disabled={isResendDisabled}
            className={`w-full py-2 rounded-lg mt-3 transition-all duration-300 font-semibold ${isResendDisabled
              ? "bg-white/30 text-white/70 cursor-not-allowed"
              : "bg-white text-[rgb(60,110,113)] hover:bg-white/90"
              }`}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </>
  );
};

export default OtpPage;
