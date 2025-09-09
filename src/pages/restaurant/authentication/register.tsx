import { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { validateRestaurantRegister } from "../../../utils/validation";
import DocumentUploadPage from "../documents/documentUploadPage";
import RestaurntLocation from "../location/restaurantLocation";
import RegisterSidebar from "../../../components/restaurant/authentication/register/RegisterSidebar";
import CredentialsForm from "../../../components/restaurant/authentication/register/CredentialsForm";
import OtpForm from "../../../components/restaurant/authentication/register/OtpForm";
import { FormData } from "../../../interfaces/restaurant/authentication/register/form-data.types";
import { ValidationErrors } from "../../../interfaces/common/validation-errors.types";
import { restaurantApi } from "../../../api/endpoints/restaurantApi";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState<FormData>({
    restaurantName: "",
    email: "",
    mobile: "",
  });

  const [step, setStep] = useState<"credentials" | "otp" | "documents" | "location">("credentials");
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "mobile" ? value.replace(/\D/g, "") : value,
    }));
    if (validationErrors[name]) setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setShowAnimation(true);

    const errors: ValidationErrors = validateRestaurantRegister(formData);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      setShowAnimation(false);
      return;
    }

    try {
      const response = await restaurantApi.checkRestaurant(dispatch, {
        email: formData.email,
        mobile: formData.mobile,
      });

      if (response.otpToken) setOtpToken(response.otpToken);

      if (response.message === "Restaurant already registered") {
        setError("Restaurant already registered, Please Login");
      } else if (response.message === "restaurant not registered") {
        setStep("otp");
        setTimer(60);
        setIsExpired(false);
        setError(null);
      } else if (response.message === "Document is missing please upload") {
        setStep("documents");
      } else if (response.message === "Please select your location") {
        setStep("location");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error("Error: Server issue");
    } finally {
      setTimeout(() => setShowAnimation(false), 2000);
    }
  };

  useEffect(() => {
    if (otpToken) localStorage.setItem("otpToken", otpToken);
  }, [otpToken]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);
    if (value && index < 3) document.getElementById(`otp-${index + 1}`)?.focus();
    else if (!value && index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
  };

  const handleVerifyOtp = async () => {
    if (isExpired) {
      setError("OTP has expired. Please resend.");
      return;
    }

    const otpValue = otp.join("");

    if (otpValue.length === 4) {
      const storedOtpToken = localStorage.getItem("otpToken");
      try {
        const response = await restaurantApi.registerRestaurant(dispatch, {
          otp: otpValue,
          otpToken: storedOtpToken,
          formData,
        });

        if (response.error) setError(response.error);
        else if (response.message === "Success") {
          setStep("documents");
          localStorage.setItem("restaurantId", response?.restaurant_id);
        }
      } catch (error: any) {
        toast.error(error.message || "OTP verification failed");
      }
    } else {
      setError("Please enter a valid 4-digit OTP.");
    }
  };

  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setIsExpired(true);
      setError("OTP has expired. Please resend.");
    }
  }, [step, timer]);

  const handleResendOtp = async () => {
    setTimer(60);
    setOtp(["", "", "", ""]);
    setIsExpired(false);
    setError(null);
    document.getElementById("otp-0")?.focus();

    try {
      const response = await restaurantApi.resendRestaurantOtp(dispatch, formData);
      if (response.otpToken) {
        setOtpToken(response.otpToken);
        localStorage.setItem("otpToken", response.otpToken);
      }
    } catch (error: any) {
      toast.error(error.message || "OTP resend failed");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <RegisterSidebar />
      {step === "credentials" && (
        <CredentialsForm
          formData={formData}
          validationErrors={validationErrors}
          error={error}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          showAnimation={showAnimation}
        />
      )}
      {step === "otp" && (
        <OtpForm
          otp={otp}
          error={error}
          timer={timer}
          isExpired={isExpired}
          mobile={formData.mobile}
          handleOtpChange={handleOtpChange}
          handleVerifyOtp={handleVerifyOtp}
          handleResendOtp={handleResendOtp}
          setStep={setStep}
        />
      )}
      {step === "documents" && <DocumentUploadPage formData={formData} navigate={navigate} setStep={setStep} />}
      {step === "location" && <RestaurntLocation />}
      {showAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-white/10">
          <div className="absolute w-[400px] h-[400px]">
            <div
              className="absolute w-[350px] h-[350px] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                boxShadow: "0 0 20px 20px rgba(255, 255, 255, 255), 0 0 40px 20 Rodrigues rgba(255, 255, 255, 255)",
                filter: "blur(0px)",
              }}
            />
          </div>
          <div className="relative w-[360px] h-[360px] rounded-full bg-white backdrop-blur-xl flex items-center justify-center z-10">
            <div className="absolute w-full h-full rounded-full bg-white opacity-10" />
            <DotLottieReact
              src="https://lottie.host/ec9503d3-e9c6-4cc6-bc47-3fb25bb5540c/PNPeHobbCt.lottie"
              loop
              autoplay
              style={{
                width: 250,
                height: 250,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;