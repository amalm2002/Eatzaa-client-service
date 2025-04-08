import { useState, useEffect } from "react";
import { CheckCircle, Mail, Phone, Store, Utensils, ChefHat, Clock, Calendar, Users } from "lucide-react";
import createAxios from "../../../service/axiousServices/restaurantAxious";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { validateRestaurantRegister } from "../../../utils/validation";

import DocumentUploadPage from "../documents/documentUploadPage";
import RestaurntLocation from "../location/restaurantLocation";

interface FormData {
  restaurantName: string;
  email: string;
  mobile: string;
}

interface ValidationErrors {
  [key: string]: string;
}



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
  const [showAnimation, setShowAnimation] = useState<boolean>(false)


  const axiosInstance = createAxios();
  const navigate = useNavigate();



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
    setShowAnimation(true)

    const errors: ValidationErrors = validateRestaurantRegister(formData);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      setShowAnimation(false)
      return;
    }

    try {
      const response = await axiosInstance.post("/restaurant-checking", { email: formData.email, mobile: formData.mobile });

      console.log('response form the restaurnt checking', response);

      if (response.data.otpToken) setOtpToken(response.data.otpToken);

      if (response.data.message === "Restaurant already registered") {
        setError("Restaurant already registered, Please Login");
      } else if (response.data.message === "restaurant not registered") {
        setStep("otp");
        setTimer(60);
        setIsExpired(false);
        setError(null);
      } else if (response.data.message === 'Document is missing please upload') {
        setStep('documents')
      } else if (response.data.message === 'Please select your location') {
        // navigate('/restaurant-location')
        setStep('location')
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert("Error: Server issue");
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
        const response = await axiosInstance.post("/restaurant-register", { otp: otpValue, otpToken: storedOtpToken, formData });
        console.log('otp page response', response);

        // localStorage.setItem('restaurantId',response?.data?.restaurant_id)

        if (response.data.error) setError(response.data.error);
        else if (response.data.message === "Success") {
          setStep("documents");
          localStorage.setItem('restaurantId', response?.data?.restaurant_id)
        }
      } catch (error: any) {
        alert(error.response?.data?.message || "OTP verification failed");
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
      const response = await axiosInstance.post('/restaurant-otp-resend', { formData });
      if (response.data.otpToken) {
        setOtpToken(response.data.otpToken);
        localStorage.setItem("otpToken", response.data.otpToken);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "OTP resend failed");
    }
  };

  const OtpPage = () => (
    <div className="md:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
            <Utensils className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Verify OTP</h2>
          <p className="text-gray-500">Enter the OTP sent to {formData.mobile}</p>
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

  // In Register.tsx
  <DocumentUploadPage formData={formData} navigate={navigate} setStep={setStep} />

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="md:w-1/2 bg-gradient-to-br from-blue-900 to-indigo-800 text-white flex flex-col justify-center items-center p-6 py-10 relative">
        <div className="absolute top-4 left-4 flex items-center">
          <ChefHat className="w-6 h-6 md:w-8 md:h-8 text-orange-300 mr-2" />
          <span className="font-extrabold text-lg md:text-xl">Eatzaa</span>
        </div>

        <div className="absolute opacity-10 right-0 top-0 hidden md:block">
          <Utensils className="w-64 h-64 text-white" />
        </div>

        <div className="z-10 max-w-md">
          <Store className="w-16 h-16 md:w-20 md:h-20 text-orange-300 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-200">
            Eatzaaa
          </h1>
          <p className="mt-4 text-center text-base md:text-lg text-gray-100">
            The ultimate platform for restaurant owners to showcase their culinary creations and manage their business with elegance.
          </p>

          <div className="mt-6 md:mt-8 space-y-3 md:space-y-4 bg-white/10 p-4 md:p-6 rounded-xl backdrop-blur-sm">
            <h3 className="font-semibold text-lg md:text-xl mb-2">Why Join Us?</h3>
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-2 rounded-full">
                <CheckCircle className="text-green-400 w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="text-sm md:text-base">Secure and intuitive restaurant management</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-2 rounded-full">
                <CheckCircle className="text-green-400 w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="text-sm md:text-base">Beautifully showcase your menu offerings</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-2 rounded-full">
                <CheckCircle className="text-green-400 w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="text-sm md:text-base">Insightful analytics to grow your business</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-2 rounded-full">
                <CheckCircle className="text-green-400 w-4 h-4 md:w-5 md:h-5" />
              </div>
              <span className="text-sm md:text-base">Connect with food lovers in your area</span>
            </div>
          </div>
        </div>
      </div>

      {step === "credentials" && (
        <div className="md:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 bg-gray-50">
          <div className="w-full max-w-md">
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
                <Utensils className="w-10 h-10 md:w-12 md:h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-500">Register your restaurant in minutes</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
              <div>
                <label className="block text-gray-700 font-medium mb-1">Restaurant Name</label>
                <div className="flex items-center border-2 border-gray-300 rounded-lg p-3 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 bg-white">
                  <Store className="text-blue-500 mr-2" />
                  <input
                    type="text"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    className={`w-full focus:outline-none ${validationErrors.restaurantName ? "border-red-500" : ""}`}
                    placeholder="Enter your restaurant name"
                  />
                </div>
                {validationErrors.restaurantName && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.restaurantName}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Email Address</label>
                <div className="flex items-center border-2 border-gray-300 rounded-lg p-3 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 bg-white">
                  <Mail className="text-blue-500 mr-2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full focus:outline-none ${validationErrors.email ? "border-red-500" : ""}`}
                    placeholder="your@email.com"
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Mobile Number</label>
                <div className="flex items-center border-2 border-gray-300 rounded-lg p-3 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 bg-white">
                  <Phone className="text-blue-500 mr-2" />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 Enter 10-digit mobile number"
                    className={`w-full focus:outline-none ${validationErrors.mobile ? "border-red-500" : ""}`}
                  />
                </div>
                {validationErrors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.mobile}</p>
                )}
              </div>

              {/* <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-800 text-white py-3 md:py-4 rounded-lg font-medium text-lg hover:from-blue-600 hover:to-blue-900 transition duration-300 shadow-lg"
                >
                  Register Now
                </button>
              </div> */}

              <div className="pt-2 relative">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-800 text-white py-3 md:py-4 rounded-lg font-medium text-lg hover:from-blue-600 hover:to-blue-900 transition duration-300 shadow-lg"
                  disabled={showAnimation}
                >
                  Register Now
                </button>
              </div>

              <div className="flex flex-col sm:flex-row justify-between text-sm mt-4 text-gray-500 space-y-2 sm:space-y-0">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>2 min setup</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Free 30-day trial</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>24/7 support</span>
                </div>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                By registering, you agree to our{" "}
                <span className="text-blue-600 font-medium cursor-pointer hover:underline">Terms of Service</span>{" "}
                and{" "}
                <span className="text-blue-600 font-medium cursor-pointer hover:underline">Privacy Policy</span>
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Already have an account?{" "}
                <span className="text-blue-600 font-medium cursor-pointer hover:underline"><a href="/restaurant-login">Login instead</a></span>
              </p>
            </div>

          </div>
        </div>
      )}

      {step === "otp" && <OtpPage />}
      {step === "documents" && <DocumentUploadPage formData={formData} navigate={navigate} setStep={setStep} />}
      {step === "location" && <RestaurntLocation />}

      {showAnimation && (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-white/10">
        <div className="absolute w-[400px] h-[400px]">
          <div className="absolute w-[350px] h-[350px] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              boxShadow: "0 0 20px 20px rgba(255, 255, 255, 255), 0 0 40px 20px rgba(255, 255, 255, 255)",
              filter: "blur(0px)"
            }}
          />
        </div>
        <div className="relative w-[360px] h-[360px] rounded-full bg-white  backdrop-blur-xl flex items-center justify-center z-10">
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