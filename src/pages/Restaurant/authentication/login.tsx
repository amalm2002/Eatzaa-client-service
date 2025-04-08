// import { useEffect, useState } from "react";
// import { Mail, Phone, Store, Utensils, ChefHat, HeartCrack, X, LockKeyhole, Coffee, ArrowRight, Loader2 } from "lucide-react";
// import { sendOtp } from "../../../hooks/auth";
// import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
// import { auth } from "../../../service/firebase/firebase";
// import createAxios from "../../../service/axiousServices/restaurantAxious";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { restaurantLogin } from "../../../service/redux/slices/restaurantSlice";

// declare global {
//   interface Window {
//     recaptchaVerifier?: RecaptchaVerifier;
//   }
// }

// if (window.recaptchaVerifier) {
//   window.recaptchaVerifier.clear();
// }

// const Login = () => {
//   const [loginStep, setLoginStep] = useState("credentials")
//   const [formData, setFormData] = useState({
//     email: "",
//     mobile: "",
//     otp: ["", "", "", "", "", ""],
//     restaurantName: "",
//     restaurantId: "",
//     token: "",
//     refreshToken: ""
//   });

//   const [errors, setErrors] = useState({
//     email: "",
//     mobile: "",
//     otp: "",
//   });

//   const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
//   const [timer, setTimer] = useState(30)
//   const [isResendDisabled, setIsResendDisabled] = useState(true)
//   const [showPopup, setShowPopup] = useState(false);

//   const navigate = useNavigate()
//   const dispatch = useDispatch()

//   useEffect(() => {
//     if (loginStep === 'otp' && timer > 0) {
//       const countDowen = setInterval(() => {
//         setTimer((prev) => prev - 1)
//       }, 1000);

//       return () => clearInterval(countDowen)
//     }

//     if (timer === 0) {
//       setIsResendDisabled(false)
//     }
//   })

//   const axiousInstance = createAxios()

//   const handleChange = async (e: any) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//     if (e.target.name === "email" && e.target.value.trim()) {
//       setErrors((prev) => ({ ...prev, email: "" }));
//     }
//     if (e.target.name === "mobile" && /^[1-9][0-9]{9}$/.test(e.target.value)) {
//       setErrors((prev) => ({ ...prev, mobile: "" }));
//     }
//   };

//   const handleOtpChange = (index: number, value: string) => {
//     if (!/^\d?$/.test(value)) return;
//     const newOtp = [...formData.otp];
//     newOtp[index] = value;
//     setFormData({ ...formData, otp: newOtp });


//     if (value && index < 5) {
//       const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
//       if (nextInput) {
//         nextInput.focus();
//       }
//     }


//   };

//   // const handleSubmitCredentials = async (e: any) => {
//   //   e.preventDefault();
//   //   const { data } = await axiousInstance.post("/restaurant-login", formData);
//   //   console.log('==============', data);

//   //   if (data.message === "Success") {
//   //     if (!data.isVerified) {
//   //       setShowPopup(true)
//   //       return
//   //     }

//   //     console.log("Sending OTP to:", formData.email, formData.mobile);
//   //     sendOtp(setLoginStep, auth, formData.mobile, setConfirmationResult);

//   //     setFormData((prev) => ({
//   //       ...prev,
//   //       restaurantName: data.restaurantName || "",
//   //       restaurantId: data._id || "",
//   //       token: data.token || "",
//   //       refreshToken: data.refreshToken || "",
//   //       isOnline: data.isOnline
//   //     }));
//   //   }

//   // };


//   const handleSubmitCredentials = async (e: any) => {
//     e.preventDefault();
//     let valid = true;
//     let newErrors = { email: "", mobile: "", otp: "" };

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required";
//       valid = false;
//     }

//     if (!formData.mobile.trim()) {
//       newErrors.mobile = "Mobile number is required";
//       valid = false;
//     } else if (!/^[1-9]\d{9}$/.test(formData.mobile)) {
//       newErrors.mobile = "Enter a valid 10-digit mobile number without leading 0";
//       valid = false;
//     }

//     setErrors(newErrors);
//     if (!valid) return;

//     try {
//       const { data } = await axiousInstance.post("/restaurant-login", formData);
//       console.log('login data from the backend :', data);

//       if (data.message === "Success") {
//         if (!data.isVerified) {
//           setShowPopup(true);
//           return;
//         }

//         sendOtp(setLoginStep, auth, formData.mobile, setConfirmationResult);
//         setFormData((prev) => ({
//           ...prev,
//           restaurantName: data.restaurantName || "",
//           restaurantId: data._id || "",
//           token: data.token || "",
//           refreshToken: data.refreshToken || "",
//           isOnline: data.isOnline,
//         }));
//       }
//     } catch (error) {
//       console.log("Login failed. Please try again.", (error as Error).message);
//     }
//   };

//   // const handleSubmitOtp = (e: any) => {
//   //   e.preventDefault();
//   //   console.log(confirmationResult, 'conformation result is here');

//   //   if (formData.otp && confirmationResult) {

//   //     const otpValue: string = formData.otp.join('');

//   //     confirmationResult.confirm(otpValue)
//   //       .then(async () => {
//   //         const restaurantData = {
//   //           restaurant: formData.restaurantName,
//   //           restaurant_id: formData.restaurantId,
//   //           isLogin: true,
//   //           isOnline: false
//   //         };

//   //         dispatch(restaurantLogin(restaurantData));
//   //         localStorage.setItem('restaurantToken', formData.token);
//   //         localStorage.setItem('restaurantRefreshToken', formData.refreshToken);

//   //         navigate("/restaurant-dashboard");
//   //       })
//   //       .catch(() => {
//   //         alert("Enter a valid OTP");
//   //       });

//   //   } else {
//   //     alert("Enter a valid otp");
//   //   }
//   //   setTimeout(() => {
//   //     console.log("OTP Verified:", formData.otp.join(""));

//   //   }, 1500);
//   // };


//   const handleSubmitOtp = (e: any) => {
//     e.preventDefault();
//     let otpValue = formData.otp.join("").trim();

//     if (otpValue.length !== 6) {
//       setErrors((prev) => ({ ...prev, otp: "Enter a valid 6-digit OTP" }));
//       return;
//     }

//     if (timer === 0) {
//       alert("OTP has expired. Please request a new OTP.");
//       return;
//     }
//     if (formData.otp && confirmationResult) {

//       const otpValue: string = formData.otp.join('');

//       confirmationResult.confirm(otpValue)
//         .then(async () => {
//           const restaurantData = {
//             restaurant: formData.restaurantName,
//             restaurant_id: formData.restaurantId,
//             isLogin: true,
//             isOnline: false
//           };

//           dispatch(restaurantLogin(restaurantData));
//           localStorage.setItem('restaurantToken', formData.token);
//           localStorage.setItem('restaurantRefreshToken', formData.refreshToken);

//           navigate("/restaurant-dashboard");
//         })
//         .catch(() => {
//           setErrors((prev) => ({ ...prev, otp: "Invalid OTP. Try again." }));
//         });
//     } else {
//       setErrors((prev) => ({ ...prev, otp: "Invalid OTP. Try again." }));
//     }
//   };

//   const handleResendOtp = () => {
//     setIsResendDisabled(true)
//     setTimer(30)
//     sendOtp(setLoginStep, auth, formData.mobile, setConfirmationResult)
//   }

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen">
//       {/* Left Section - Form now on left side */}
//       <div className="md:w-1/2 bg-gradient-to-br from-indigo-900 to-blue-800 text-white flex flex-col justify-center p-6 py-10 relative">

//         {/* Top restaurant icon */}
//         <div className="absolute top-4 left-4 flex items-center">
//           <ChefHat className="w-6 h-6 md:w-8 md:h-8 text-orange-300 mr-2" />
//           <span className="font-extrabold text-lg md:text-xl">Eatzaa</span>
//         </div>


//         {/* Form Container */}
//         <div className="mx-auto w-full max-w-md px-4 py-8 rounded-xl bg-white/10 backdrop-blur-sm">
//           <div className="text-center mb-8">
//             <div className="inline-block p-3 bg-blue-200/20 rounded-full mb-3">
//               <Coffee className="w-10 h-10 md:w-12 md:h-12 text-orange-300" />
//             </div>
//             <h2 className="text-2xl md:text-3xl font-bold">Welcome Back</h2>
//             <p className="text-blue-100 mt-2">Log in to manage your restaurant</p>
//           </div>

//           {showPopup && (
//             <div className="flex justify-center mb-6">
//               <div className="bg-gradient-to-r from-red-600 to-red-400 text-white p-5 rounded-2xl shadow-xl flex items-start gap-4 animate-fadeIn w-full max-w-md">
//                 <HeartCrack className="w-7 h-7 text-white animate-pulse" />
//                 <div className="flex-1">
//                   <p className="font-extrabold text-lg">Registration Pending!</p>
//                   <p className="text-sm opacity-90">
//                     Your request is under review. Please wait for admin verification. <br />
//                     Check your email for approval updates.
//                   </p>
//                 </div>
//                 <X
//                   className="w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition"
//                   onClick={() => setShowPopup(false)}
//                 />
//               </div>
//             </div>
//           )}

//           {loginStep === "credentials" && (
//             <form onSubmit={handleSubmitCredentials} className="space-y-4">
//               <div>
//                 <label className="block text-blue-100 font-medium mb-1">Email Address</label>
//                 <div className="flex items-center border-2 border-blue-300/30 rounded-lg p-3 transition-all duration-300 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-300/20 bg-white/5">
//                   <Mail className="text-blue-300 mr-2" />
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="w-full focus:outline-none bg-transparent text-white placeholder-blue-200/50"
//                     placeholder="your@email.com"
//                   />
//                 </div>
//               </div>
//               {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

//               <div>
//                 <label className="block text-blue-100 font-medium mb-1">Mobile Number</label>
//                 <div className="flex items-center border-2 border-blue-300/30 rounded-lg p-3 transition-all duration-300 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-300/20 bg-white/5">
//                   <Phone className="text-blue-300 mr-2" />
//                   <input
//                     type="tel"
//                     name="mobile"
//                     value={formData.mobile}
//                     onChange={handleChange}
//                     placeholder="+91 Enter 10-digit mobile number"
//                     className="w-full focus:outline-none bg-transparent text-white placeholder-blue-200/50"
//                   />
//                 </div>
//               </div>

//               {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}

//               <div className="pt-4">
//                 <button
//                   type="submit"
//                   className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-medium text-lg hover:from-orange-600 hover:to-orange-700 transition duration-300 flex items-center justify-center gap-2"
//                 >
//                   <span>Get OTP</span>
//                   <ArrowRight className="w-5 h-5" />
//                 </button>
//               </div>
//               <div id="recaptcha-container"></div>

//             </form>
//           )}

//           {loginStep === "otp" && (
//             <form onSubmit={handleSubmitOtp} className="space-y-6">
//               <div>
//                 <label className="block text-blue-100 font-medium mb-1 text-center">
//                   Enter 6-digit OTP sent to your mobile
//                 </label>
//                 <p className="text-blue-200/70 text-sm text-center mb-4">
//                   We've sent a verification code to {formData.mobile}
//                 </p>
//                 {errors.otp && <p className="text-red-500 text-sm text-center">{errors.otp}</p>}
//                 <div className="flex justify-center gap-2 my-6 flex-wrap">
//                   {[0, 1, 2, 3, 4, 5].map((index) => (
//                     <input
//                       id={`otp-${index}`}
//                       key={index}
//                       type="text"
//                       maxLength={1}
//                       value={formData.otp[index]}
//                       onChange={(e) => handleOtpChange(index, e.target.value)}
//                       className="w-12 h-12 text-center text-xl font-bold bg-white/10 border-2 border-blue-300/30 rounded-lg focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-300/30 transition-all duration-300 text-white"
//                     />
//                   ))}
//                 </div>
//                 <p className="text-blue-200 text-sm text-center">
//                   Didn't receive code?
//                   <button
//                     onClick={handleResendOtp}
//                     disabled={isResendDisabled}
//                     className={`text-orange-300 font-medium cursor-pointer hover:underline ${isResendDisabled ? "opacity-50 cursor-not-allowed" : ""
//                       }`}
//                   >
//                     {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
//                   </button>
//                 </p>
//               </div>

//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-medium text-lg hover:from-orange-600 hover:to-orange-700 transition duration-300 shadow-lg flex items-center justify-center gap-2"
//                 >
//                   <LockKeyhole className="w-5 h-5" />
//                   <span>Verify & Login</span>
//                 </button>
//               </div>
//               <div id="recaptcha-container"></div>
//             </form>
//           )}

//           {loginStep === "verifying" && (
//             <div className="flex flex-col items-center justify-center py-8">
//               <Loader2 className="w-12 h-12 text-blue-300 animate-spin mb-4" />
//               <p className="text-blue-100 text-lg">Verifying your account...</p>
//             </div>
//           )}

//           <div className="mt-6 text-center">
//             <p className="text-blue-200/70 text-sm">
//               New to Eatzaa Food Venture? <span className="text-orange-300 font-medium cursor-pointer"><a href="/restaurant-register">Register your restaurant</a></span>
//             </p>
//             <p className="text-blue-200/70 text-sm mt-2">
//               Need help? <span className="text-orange-300 font-medium cursor-pointer hover:underline">Contact support</span>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Right Section - Visual display */}
//       <div className="md:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 bg-gray-50 relative overflow-hidden">
//         {/* Decorative elements */}
//         <div className="absolute top-0 right-0 -mt-16 -mr-16 opacity-10">
//           <Utensils className="w-64 h-64 text-blue-900" />
//         </div>
//         <div className="absolute bottom-0 left-0 -mb-16 -ml-16 opacity-10">
//           <Store className="w-64 h-64 text-blue-900" />
//         </div>

//         {/* Main content */}
//         <div className="max-w-md text-center z-10">
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">Manage Your Restaurant With Ease</h2>
//           <p className="text-gray-600 mb-6">
//             Access your restaurant dashboard, update your menu, check orders, and gain valuable insights
//             about your customers' preferences.
//           </p>

//           <div className="grid grid-cols-2 gap-4 mt-8">
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <h3 className="font-semibold text-blue-800 mb-2">Real-time Orders</h3>
//               <p className="text-gray-600 text-sm">Receive and manage orders in real-time with instant notifications</p>
//             </div>
//             <div className="bg-green-50 p-4 rounded-lg">
//               <h3 className="font-semibold text-green-700 mb-2">Menu Management</h3>
//               <p className="text-gray-600 text-sm">Update your menu items, prices, and availability with ease</p>
//             </div>
//             <div className="bg-purple-50 p-4 rounded-lg">
//               <h3 className="font-semibold text-purple-700 mb-2">Customer Insights</h3>
//               <p className="text-gray-600 text-sm">Understand your customers better with detailed analytics</p>
//             </div>
//             <div className="bg-orange-50 p-4 rounded-lg">
//               <h3 className="font-semibold text-orange-700 mb-2">Table Reservations</h3>
//               <p className="text-gray-600 text-sm">Manage bookings and optimize your seating arrangements</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;



import { useEffect, useRef, useState } from "react";
import { Mail, Phone, Store, Utensils, ChefHat, HeartCrack, X, LockKeyhole, Coffee, ArrowRight, Loader2, Upload, Clock } from "lucide-react";
import { sendOtp } from "../../../hooks/auth";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { auth } from "../../../service/firebase/firebase";
import createAxios from "../../../service/axiousServices/restaurantAxious";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { restaurantLogin } from "../../../service/redux/slices/restaurantSlice";
import { deleteFromCloudinary } from "../../../utils/deleteFromCloudinary";
import { toast } from "sonner";
import { DotLottieReact } from '@lottiefiles/dotlottie-react'


declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

if (window.recaptchaVerifier) {
  window.recaptchaVerifier.clear();
}

const Login = () => {

  const [loginStep, setLoginStep] = useState("credentials");
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    otp: ["", "", "", "", "", ""],
    restaurantName: "",
    restaurantId: "",
    token: "",
    refreshToken: ""
  });

  const [errors, setErrors] = useState({
    email: "",
    mobile: "",
    otp: "",
  });

  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [showVerificationPopup, setShowVerificationPopup] = useState<boolean>(false);
  const [showRejectionPopup, setShowRejectionPopup] = useState<boolean>(false);
  const [showResubmitModal, setShowResubmitModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [restaurant, setRestaurant] = useState<null | {
    _id: string;
    email: string;
    mobile: number;
    restaurantName: string;
    isOnline: boolean;
    isVerified: boolean;
    location: {
      latitude: number;
      longitude: number;
    };
    rejectionReason: string;
    restaurantDocuments: {
      bankAccountNumber: string;
      businessCertificateUrl: string;
      fssaiLicenseUrl: string;
      idProofUrl: string;
      ifscCode: string;
    };
  }>(null);

  const [resubmitData, setResubmitData] = useState({
    idProof: null as File | null,
    fssaiLicense: null as File | null,
    businessCertificate: null as File | null,
    bankAccountNumber: restaurant?.restaurantDocuments.bankAccountNumber || "",
    ifscCode: restaurant?.restaurantDocuments.ifscCode || ""
  });

  const [previewImages, setPreviewImages] = useState({
    idProof: restaurant?.restaurantDocuments.idProofUrl || "",
    fssaiLicense: restaurant?.restaurantDocuments.fssaiLicenseUrl || "",
    businessCertificate: restaurant?.restaurantDocuments.businessCertificateUrl || ""
  });


  const navigate = useNavigate();
  const dispatch = useDispatch();
  const axiosInstance = createAxios();

  useEffect(() => {
    if (loginStep === 'otp' && timer > 0) {
      const countDown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countDown);
    }
    if (timer === 0) {
      setIsResendDisabled(false);
    }
  }, [loginStep, timer]);

  useEffect(() => {
    if (restaurant) {
      setResubmitData({
        idProof: null,
        fssaiLicense: null,
        businessCertificate: null,
        bankAccountNumber: restaurant.restaurantDocuments.bankAccountNumber || "",
        ifscCode: restaurant.restaurantDocuments.ifscCode || ""
      });
      setPreviewImages({
        idProof: restaurant.restaurantDocuments.idProofUrl || "",
        fssaiLicense: restaurant.restaurantDocuments.fssaiLicenseUrl || "",
        businessCertificate: restaurant.restaurantDocuments.businessCertificateUrl || ""
      });
      console.log("Loaded restaurant:", restaurant);
    }
  }, [restaurant])

  const handleChange = async (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "email" && e.target.value.trim()) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
    if (e.target.name === "mobile" && /^[1-9][0-9]{9}$/.test(e.target.value)) {
      setErrors((prev) => ({ ...prev, mobile: "" }));
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmitCredentials = async (e: any) => {
    e.preventDefault();
    let valid = true;
    let newErrors = { email: "", mobile: "", otp: "" };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      valid = false;
    } else if (!/^[1-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number without leading 0";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    try {
      const { data } = await axiosInstance.post("/restaurant-login", formData);
      // console.log('login data from the backend :', data);

      if (data.message === "Success") {

        setRestaurant(data.restaurant)

        if (!data.isRejected && !data.isVerified) {
          setShowVerificationPopup(true);
          return;
        }
        if (data.isRejected && !data.isVerified) {
          setShowRejectionPopup(true);
          return;
        }

        sendOtp(setLoginStep, auth, formData.mobile, setConfirmationResult);
        setFormData((prev) => ({
          ...prev,
          restaurantName: data.restaurantName || "",
          restaurantId: data._id || "",
          token: data.token || "",
          refreshToken: data.refreshToken || "",
          isOnline: data.isOnline,
        }));
      }
    } catch (error) {
      console.log("Login failed. Please try again.", (error as Error).message);
    }
  };

  const handleSubmitOtp = (e: any) => {
    e.preventDefault();
    let otpValue = formData.otp.join("").trim();

    if (otpValue.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: "Enter a valid 6-digit OTP" }));
      return;
    }
    if (timer === 0) {
      alert("OTP has expired. Please request a new OTP.");
      return;
    }
    if (formData.otp && confirmationResult) {
      confirmationResult.confirm(otpValue)
        .then(async () => {
          const restaurantData = {
            restaurant: formData.restaurantName,
            restaurant_id: formData.restaurantId,
            isLogin: true,
            isOnline: false
          };
          dispatch(restaurantLogin(restaurantData));
          localStorage.setItem('restaurantToken', formData.token);
          localStorage.setItem('restaurantRefreshToken', formData.refreshToken);
          navigate("/restaurant-dashboard");
        })
        .catch(() => {
          setErrors((prev) => ({ ...prev, otp: "Invalid OTP. Try again." }));
        });
    } else {
      setErrors((prev) => ({ ...prev, otp: "Invalid OTP. Try again." }));
    }
  };

  const handleResendOtp = () => {
    setIsResendDisabled(true);
    setTimer(30);
    sendOtp(setLoginStep, auth, formData.mobile, setConfirmationResult);
  };

  //  handile the re-submit restaurnt dcuments code :

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof resubmitData) => {
    const file = e.target.files?.[0];
    if (file) {
      setResubmitData(prev => ({ ...prev, [field]: file }));
      const previewUrl = URL.createObjectURL(file);
      setPreviewImages(prev => ({ ...prev, [field]: previewUrl }));
    }
  };

  const idProofRef = useRef<HTMLInputElement>(null)
  const fssaiLicenseRef = useRef<HTMLInputElement>(null)
  const businessCertificateRef = useRef<HTMLInputElement>(null)

  const handleRemoveImage = (field: keyof typeof previewImages) => {
    setResubmitData(prev => ({ ...prev, [field]: null }));
    setPreviewImages(prev => ({ ...prev, [field]: restaurant?.restaurantDocuments[field as keyof typeof restaurant.restaurantDocuments] || "" }));
    if (field === 'idProof' && idProofRef.current) idProofRef.current.value = '';
    if (field === 'fssaiLicense' && fssaiLicenseRef.current) fssaiLicenseRef.current.value = '';
    if (field === 'businessCertificate' && businessCertificateRef.current) businessCertificateRef.current.value = '';
  };

  //upload the new image on cloudinary

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'restaurant_docs')
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_NAME);
    console.log('upload cloudinary func');

    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    })
    console.log('upload response :', response);

    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url.split('/').pop() || '';
    } else {
      throw new Error("Failed to upload to Cloudinary");
    }
  }

  const handleResubmitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResubmitData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // const handleResubmitDocuments = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   const formDataToSend = new FormData();
  //   formDataToSend.append('restaurantId', formData.restaurantId);

  //   try {

  //     if (resubmitData.idProof && restaurant?.restaurantDocuments.idProofUrl) {
  //       await deleteFromCloudinary(restaurant.restaurantDocuments.idProofUrl)
  //       const idProofName = await uploadToCloudinary(resubmitData.idProof)
  //       formDataToSend.append('idProof', idProofName)
  //     } else if (restaurant?.restaurantDocuments.idProofUrl) {
  //       formDataToSend.append('idProof', restaurant.restaurantDocuments.idProofUrl)
  //     }

  //     if (resubmitData.fssaiLicense && restaurant?.restaurantDocuments.fssaiLicenseUrl) {
  //       await deleteFromCloudinary(restaurant.restaurantDocuments.fssaiLicenseUrl)
  //       const fssaiLicenseName = await uploadToCloudinary(resubmitData.fssaiLicense)
  //       formDataToSend.append('fssaiLicense', fssaiLicenseName)
  //     } else if (restaurant?.restaurantDocuments.fssaiLicenseUrl) {
  //       formDataToSend.append('fssaiLicense', restaurant.restaurantDocuments.fssaiLicenseUrl)
  //     }

  //     if (resubmitData.businessCertificate && restaurant?.restaurantDocuments.businessCertificateUrl) {
  //       await deleteFromCloudinary(restaurant.restaurantDocuments.businessCertificateUrl)
  //       const businessCertificateName = await uploadToCloudinary(resubmitData.businessCertificate)
  //       formDataToSend.append('businessCertificate', businessCertificateName)
  //     } else if (restaurant?.restaurantDocuments.businessCertificateUrl) {
  //       formDataToSend.append('businessCertificate', restaurant.restaurantDocuments.businessCertificateUrl)
  //     }

  //     formDataToSend.append('bankAccountNumber', resubmitData.bankAccountNumber);
  //     formDataToSend.append('ifscCode', resubmitData.ifscCode);

  //     const response = await axiosInstance.post('/resubmitRestaurantDocs', formDataToSend, {
  //       headers: { 'Content-Type': 'multipart/form-data' }
  //     });
  //     if (response.data.message === 'success') {
  //       alert('Documents resubmitted successfully!');
  //       setShowResubmitModal(false);
  //       setShowRejectionPopup(false);
  //     }
  //   } catch (error) {
  //     console.error('Error resubmitting documents:', error);
  //     alert('Failed to resubmit documents');
  //   }
  // };


  const handleResubmitDocuments = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('restaurantId', restaurant?._id ?? '');

    try {
      setIsLoading(true)
      // Handle ID Proof
      if (resubmitData.idProof && restaurant?.restaurantDocuments.idProofUrl) {
        try {
          await deleteFromCloudinary(restaurant.restaurantDocuments.idProofUrl);
        } catch (deleteError) {
          console.warn('Failed to delete old ID Proof, proceeding with upload:', deleteError);
        }
        const idProofName = await uploadToCloudinary(resubmitData.idProof);
        formDataToSend.append('idProof', idProofName);
      } else if (restaurant?.restaurantDocuments.idProofUrl) {
        formDataToSend.append('idProof', restaurant.restaurantDocuments.idProofUrl);
      }

      // Handle FSSAI License
      if (resubmitData.fssaiLicense && restaurant?.restaurantDocuments.fssaiLicenseUrl) {
        try {
          await deleteFromCloudinary(restaurant.restaurantDocuments.fssaiLicenseUrl);
        } catch (deleteError) {
          console.warn('Failed to delete old FSSAI License, proceeding with upload:', deleteError);
        }
        const fssaiLicenseName = await uploadToCloudinary(resubmitData.fssaiLicense);
        formDataToSend.append('fssaiLicense', fssaiLicenseName);
      } else if (restaurant?.restaurantDocuments.fssaiLicenseUrl) {
        formDataToSend.append('fssaiLicense', restaurant.restaurantDocuments.fssaiLicenseUrl);
      }

      if (resubmitData.businessCertificate && restaurant?.restaurantDocuments.businessCertificateUrl) {
        try {
          await deleteFromCloudinary(restaurant.restaurantDocuments.businessCertificateUrl);
        } catch (deleteError) {
          console.warn('Failed to delete old Business Certificate, proceeding with upload:', deleteError);
        }
        const businessCertificateName = await uploadToCloudinary(resubmitData.businessCertificate);
        formDataToSend.append('businessCertificate', businessCertificateName);
      } else if (restaurant?.restaurantDocuments.businessCertificateUrl) {
        formDataToSend.append('businessCertificate', restaurant.restaurantDocuments.businessCertificateUrl);
      }

      formDataToSend.append('bankAccountNumber', resubmitData.bankAccountNumber);
      formDataToSend.append('ifscCode', resubmitData.ifscCode);

      const response = await axiosInstance.post('/resubmit-restaurant-docs', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.message === 'success') {
        toast.success('Documents resubmitted successfully!');
        setShowResubmitModal(false);
        setShowRejectionPopup(false);
        setRestaurant(response.data.restaurant);
      }
    } catch (error) {
      console.error('Error resubmitting documents:', error);
      toast.error('Failed to resubmit documents');
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="md:w-1/2 bg-gradient-to-br from-indigo-900 to-blue-800 text-white flex flex-col justify-center p-6 py-10 relative">
        <div className="absolute top-4 left-4 flex items-center">
          <ChefHat className="w-6 h-6 md:w-8 md:h-8 text-orange-300 mr-2" />
          <span className="font-extrabold text-lg md:text-xl">Eatzaa</span>
        </div>

        <div className="mx-auto w-full max-w-md px-4 py-8 rounded-xl bg-white/10 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-200/20 rounded-full mb-3">
              <Coffee className="w-10 h-10 md:w-12 md:h-12 text-orange-300" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">Welcome Back</h2>
            <p className="text-blue-100 mt-2">Log in to manage your restaurant</p>
          </div>

          {/* Verification Pending Popup */}
          {showVerificationPopup && (
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-white p-5 rounded-2xl shadow-xl flex items-start gap-4 animate-fadeIn w-full max-w-md">
                <Clock className="w-7 h-7 text-white animate-pulse" />
                <div className="flex-1">
                  <p className="font-extrabold text-lg">Verification Pending!</p>
                  <p className="text-sm opacity-90">
                    Your request is under review. Please wait for admin verification.<br />
                    Check your email for approval updates.
                  </p>
                </div>
                <X
                  className="w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition"
                  onClick={() => setShowVerificationPopup(false)}
                />
              </div>
            </div>
          )}

          {/* Rejection Popup */}
          {showRejectionPopup && (
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-red-600 to-red-400 text-white p-5 rounded-2xl shadow-xl flex items-start gap-4 animate-fadeIn w-full max-w-md">
                <HeartCrack className="w-7 h-7 text-white animate-pulse" />
                <div className="flex-1">
                  <p className="font-extrabold text-lg">Document Verification Failed!</p>
                  <p className="text-sm opacity-90">
                    Your document verification failed. Please resubmit your documents.<br />
                    <button
                      onClick={() => setShowResubmitModal(true)}
                      className="text-orange-300 hover:underline mt-2 inline-block"
                    >
                      Resubmit Now
                    </button>
                  </p>
                </div>
                <X
                  className="w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition"
                  onClick={() => setShowRejectionPopup(false)}
                />
              </div>
            </div>
          )}

          {loginStep === "credentials" && (
            <form onSubmit={handleSubmitCredentials} className="space-y-4">
              <div>
                <label className="block text-blue-100 font-medium mb-1">Email Address</label>
                <div className="flex items-center border-2 border-blue-300/30 rounded-lg p-3 transition-all duration-300 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-300/20 bg-white/5">
                  <Mail className="text-blue-300 mr-2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full focus:outline-none bg-transparent text-white placeholder-blue-200/50"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <div>
                <label className="block text-blue-100 font-medium mb-1">Mobile Number</label>
                <div className="flex items-center border-2 border-blue-300/30 rounded-lg p-3 transition-all duration-300 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-300/20 bg-white/5">
                  <Phone className="text-blue-300 mr-2" />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 Enter 10-digit mobile number"
                    className="w-full focus:outline-none bg-transparent text-white placeholder-blue-200/50"
                  />
                </div>
              </div>
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-medium text-lg hover:from-orange-600 hover:to-orange-700 transition duration-300 flex items-center justify-center gap-2"
                >
                  <span>Get OTP</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <div id="recaptcha-container"></div>
            </form>
          )}

          {loginStep === "otp" && (
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
                    className={`text-orange-300 font-medium cursor-pointer hover:underline ${isResendDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
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
          )}

          {loginStep === "verifying" && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 text-blue-300 animate-spin mb-4" />
              <p className="text-blue-100 text-lg">Verifying your account...</p>
            </div>
          )}

          {/* Resubmit Documents Modal */}
          {showResubmitModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-blue-100/50 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                    Resubmit Documents
                  </h3>
                  <X
                    className="w-6 h-6 cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
                    onClick={() => setShowResubmitModal(false)}
                  />
                </div>

                <form onSubmit={handleResubmitDocuments} className="space-y-6">
                  {/* ID Proof */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">ID Proof</label>
                    <div className="relative flex items-center border-2 border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 hover:border-indigo-400 hover:shadow-lg">
                      <Upload className="text-indigo-500 mr-3" />
                      <input
                        ref={idProofRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'idProof')}
                        className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      {previewImages.idProof && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage('idProof')}
                          className="absolute right-4 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                    {previewImages.idProof && (
                      <div className="mt-4">
                        <img
                          src={previewImages.idProof.startsWith('blob:')
                            ? previewImages.idProof
                            : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${previewImages.idProof}`}
                          alt="ID Proof Preview"
                          className="w-32 h-22 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* FSSAI License */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">FSSAI License</label>
                    <div className="relative flex items-center border-2 border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 hover:border-indigo-400 hover:shadow-lg">
                      <Upload className="text-indigo-500 mr-3" />
                      <input
                        ref={fssaiLicenseRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'fssaiLicense')}
                        className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      {previewImages.fssaiLicense && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage('fssaiLicense')}
                          className="absolute right-4 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                    {previewImages.fssaiLicense && (
                      <div className="mt-4">
                        <img
                          src={previewImages.fssaiLicense.startsWith('blob:')
                            ? previewImages.fssaiLicense
                            : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${previewImages.fssaiLicense}`}
                          alt="FSSAI License Preview"
                          className="w-32 h-22 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* Business Certificate */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Business Certificate</label>
                    <div className="relative flex items-center border-2 border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 hover:border-indigo-400 hover:shadow-lg">
                      <Upload className="text-indigo-500 mr-3" />
                      <input
                        ref={businessCertificateRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'businessCertificate')}
                        className="w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      {previewImages.businessCertificate && (
                        <button
                          type="button"
                          onClick={() => handleRemoveImage('businessCertificate')}
                          className="absolute right-4 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                    {previewImages.businessCertificate && (
                      <div className="mt-4">
                        <img
                          src={previewImages.businessCertificate.startsWith('blob:')
                            ? previewImages.businessCertificate
                            : `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload/${previewImages.businessCertificate}`}
                          alt="Business Certificate Preview"
                          className="w-32 h-22 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
                  </div>

                  {/* Bank Account Number */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Bank Account Number</label>
                    <div className="flex items-center border-2 border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-200">
                      <input
                        type="text"
                        name="bankAccountNumber"
                        value={resubmitData.bankAccountNumber}
                        onChange={handleResubmitChange}
                        placeholder="Bank Account Number"
                        className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* IFSC Code */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">IFSC Code</label>
                    <div className="flex items-center border-2 border-gray-200 rounded-xl p-4 bg-white transition-all duration-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-200">
                      <input
                        type="text"
                        name="ifscCode"
                        value={resubmitData.ifscCode}
                        onChange={handleResubmitChange}
                        placeholder="IFSC Code"
                        className="w-full focus:outline-none text-gray-700 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-blue-600 transition duration-300 shadow-lg"
                    >
                      Submit Documents
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResubmitModal(false)}
                      className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-xl font-semibold text-lg hover:from-gray-600 hover:to-gray-700 transition duration-300 shadow-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-blue-200/70 text-sm">
              New to Eatzaa Food Venture? <span className="text-orange-300 font-medium cursor-pointer"><a href="/restaurant-register">Register your restaurant</a></span>
            </p>
            <p className="text-blue-200/70 text-sm mt-2">
              Need help? <span className="text-orange-300 font-medium cursor-pointer hover:underline">Contact support</span>
            </p>
          </div>
        </div>
      </div>

      <div className="md:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 bg-gray-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 opacity-10">
          <Utensils className="w-64 h-64 text-blue-900" />
        </div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 opacity-10">
          <Store className="w-64 h-64 text-blue-900" />
        </div>

        <div className="max-w-md text-center z-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Manage Your Restaurant With Ease</h2>
          <p className="text-gray-600 mb-6">
            Access your restaurant dashboard, update your menu, check orders, and gain valuable insights
            about your customers' preferences.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Real-time Orders</h3>
              <p className="text-gray-600 text-sm">Receive and manage orders in real-time with instant notifications</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-700 mb-2">Menu Management</h3>
              <p className="text-gray-600 text-sm">Update your menu items, prices, and availability with ease</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-700 mb-2">Customer Insights</h3>
              <p className="text-gray-600 text-sm">Understand your customers better with detailed analytics</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-700 mb-2">Table Reservations</h3>
              <p className="text-gray-600 text-sm">Manage bookings and optimize your seating arrangements</p>
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="fixed inset-0 bg-white/15 bg-opacity-70 z-50 flex justify-center items-center">
          <DotLottieReact
            src="https://lottie.host/4bb05fdc-1d61-4219-b2eb-96365755cdd5/clhETaNW1v.lottie"
            loop
            autoplay
            style={{ width: "250px", height: "250px" }}
          />
        </div>
      )}
    </div>
  );
};

export default Login;