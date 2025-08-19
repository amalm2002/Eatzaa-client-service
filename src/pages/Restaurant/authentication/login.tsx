import { useEffect, useState, useRef } from "react";
import { ChefHat, Coffee, Loader2 } from "lucide-react";
import { sendOtp } from "../../../hooks/auth";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { auth } from "../../../service/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { restaurantLogin } from "../../../service/redux/slices/restaurantSlice";
import { deleteFromCloudinary } from "../../../utils/deleteFromCloudinary";
import { toast } from "sonner";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import CredentialsForm from "../../../components/restaurant/authentication/login/CredentialsForm";
import OtpForm from "../../../components/restaurant/authentication/login/OtpForm";
import VerificationPendingPopup from "../../../components/restaurant/authentication/login/VerificationPendingPopup";
import RejectionPopup from "../../../components/restaurant/authentication/login/RejectionPopup";
import ResubmitDocumentsModal from "../../../components/restaurant/authentication/login/ResubmitDocumentsModal";
import LoginSidebar from "../../../components/restaurant/authentication/login/LoginSidebar";
import { Restaurant } from "../../../interfaces/restaurant/authentication/login/restaurant.types";
import { restaurantApi } from "../../../api/endpoints/restaurantApi";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

if (window.recaptchaVerifier) {
  window.recaptchaVerifier.clear();
}

const Login: React.FC = () => {
  const [loginStep, setLoginStep] = useState<"credentials" | "otp" | "verifying">("credentials");
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    otp: ["", "", "", "", "", ""],
    restaurantName: "",
    restaurantId: "",
    token: "",
    refreshToken: "",
    role: "Restaurant" as const,
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  const [resubmitData, setResubmitData] = useState({
    idProof: null as File | null,
    fssaiLicense: null as File | null,
    businessCertificate: null as File | null,
    bankAccountNumber: restaurant?.restaurantDocuments.bankAccountNumber || "",
    ifscCode: restaurant?.restaurantDocuments.ifscCode || "",
  });

  const [previewImages, setPreviewImages] = useState({
    idProof: restaurant?.restaurantDocuments.idProofUrl || "",
    fssaiLicense: restaurant?.restaurantDocuments.fssaiLicenseUrl || "",
    businessCertificate: restaurant?.restaurantDocuments.businessCertificateUrl || "",
  });

  const idProofRef = useRef<HTMLInputElement>(null);
  const fssaiLicenseRef = useRef<HTMLInputElement>(null);
  const businessCertificateRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (loginStep === "otp" && timer > 0) {
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
        ifscCode: restaurant.restaurantDocuments.ifscCode || "",
      });
      setPreviewImages({
        idProof: restaurant.restaurantDocuments.idProofUrl || "",
        fssaiLicense: restaurant.restaurantDocuments.fssaiLicenseUrl || "",
        businessCertificate: restaurant.restaurantDocuments.businessCertificateUrl || "",
      });
    }
  }, [restaurant]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

   const handleSubmitCredentials = async (e: React.FormEvent) => {
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
      const data = await restaurantApi.restaurantLogin(dispatch, {
        email: formData.email,
        mobile: formData.mobile,
      });

      if (data.message === "No restaurant found") {
        toast.warning("Your account is not registered. Please sign up to continue.");
        return;
      } else if (data.message === "Restaurant registration is pending ") {
        toast.warning("Your restaurant registration is pending. Please complete it after signing in.");
        return;
      } else if (data.message === "Success") {
        if (data.role !== "Restaurant") {
          toast.error("Access denied: Only restaurant accounts can log in.");
          return;
        }

        setRestaurant(data.restaurant);

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
          role: "Restaurant",
        }));
      }
    } catch (error: any) {
      console.log("Login failed. Please try again.", error.message);
    }
  };

  const handleSubmitOtp = (e: React.FormEvent) => {
    e.preventDefault();
    let otpValue = formData.otp.join("").trim();

    if (otpValue.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: "Enter a valid 6-digit OTP" }));
      return;
    }
    if (timer === 0) {
      toast.message("OTP has expired. Please request a new OTP.");
      return;
    }
    if (formData.otp && confirmationResult) {
      confirmationResult
        .confirm(otpValue)
        .then(async () => {
          const restaurantData: any = {
            restaurant: formData.restaurantName,
            restaurant_id: formData.restaurantId,
            role: formData.role,
            isLogin: true,
            isOnline: false,
          };
          dispatch(restaurantLogin(restaurantData));
          localStorage.setItem("role", formData.role);
          localStorage.setItem("restaurantToken", formData.token);
          localStorage.setItem("restaurantRefreshToken", formData.refreshToken);
          navigate("/restaurant/dashboard");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof resubmitData) => {
    const file = e.target.files?.[0];
    if (file) {
      setResubmitData((prev) => ({ ...prev, [field]: file }));
      const previewUrl = URL.createObjectURL(file);
      setPreviewImages((prev) => ({ ...prev, [field]: previewUrl }));
    }
  };

  const handleRemoveImage = (field: keyof typeof previewImages) => {
    setResubmitData((prev) => ({ ...prev, [field]: null }));
    setPreviewImages((prev) => ({
      ...prev,
      [field]: restaurant?.restaurantDocuments[field as keyof typeof restaurant.restaurantDocuments] || "",
    }));
    if (field === "idProof" && idProofRef.current) idProofRef.current.value = "";
    if (field === "fssaiLicense" && fssaiLicenseRef.current) fssaiLicenseRef.current.value = "";
    if (field === "businessCertificate" && businessCertificateRef.current) businessCertificateRef.current.value = "";
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "restaurant_docs");
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_NAME);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url.split("/").pop() || "";
    } else {
      throw new Error("Failed to upload to Cloudinary");
    }
  };

  const handleResubmitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResubmitData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // const handleResubmitDocuments = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const formDataToSend = new FormData();
  //   formDataToSend.append("restaurantId", restaurant?._id ?? "");

  //   try {
  //     setIsLoading(true);
  //     if (resubmitData.idProof && restaurant?.restaurantDocuments.idProofUrl) {
  //       try {
  //         await deleteFromCloudinary(restaurant.restaurantDocuments.idProofUrl);
  //       } catch (deleteError) {
  //         console.warn("Failed to delete old ID Proof, proceeding with upload:", deleteError);
  //       }
  //       const idProofName = await uploadToCloudinary(resubmitData.idProof);
  //       formDataToSend.append("idProof", idProofName);
  //     } else if (restaurant?.restaurantDocuments.idProofUrl) {
  //       formDataToSend.append("idProof", restaurant.restaurantDocuments.idProofUrl);
  //     }

  //     if (resubmitData.fssaiLicense && restaurant?.restaurantDocuments.fssaiLicenseUrl) {
  //       try {
  //         await deleteFromCloudinary(restaurant.restaurantDocuments.fssaiLicenseUrl);
  //       } catch (deleteError) {
  //         console.warn("Failed to delete old FSSAI License, proceeding with upload:", deleteError);
  //       }
  //       const fssaiLicenseName = await uploadToCloudinary(resubmitData.fssaiLicense);
  //       formDataToSend.append("fssaiLicense", fssaiLicenseName);
  //     } else if (restaurant?.restaurantDocuments.fssaiLicenseUrl) {
  //       formDataToSend.append("fssaiLicense", restaurant.restaurantDocuments.fssaiLicenseUrl);
  //     }

  //     if (resubmitData.businessCertificate && restaurant?.restaurantDocuments.businessCertificateUrl) {
  //       try {
  //         await deleteFromCloudinary(restaurant.restaurantDocuments.businessCertificateUrl);
  //       } catch (deleteError) {
  //         console.warn("Failed to delete old Business Certificate, proceeding with upload:", deleteError);
  //       }
  //       const businessCertificateName = await uploadToCloudinary(resubmitData.businessCertificate);
  //       formDataToSend.append("businessCertificate", businessCertificateName);
  //     } else if (restaurant?.restaurantDocuments.businessCertificateUrl) {
  //       formDataToSend.append("businessCertificate", restaurant.restaurantDocuments.businessCertificateUrl);
  //     }

  //     formDataToSend.append("bankAccountNumber", resubmitData.bankAccountNumber);
  //     formDataToSend.append("ifscCode", resubmitData.ifscCode);

  //     const response = await axiosInstance.post("/resubmit-restaurant-docs", formDataToSend, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     if (response.data.message === "success") {
  //       toast.success("Documents resubmitted successfully!");
  //       setShowResubmitModal(false);
  //       setShowRejectionPopup(false);
  //       setRestaurant(response.data.restaurant);
  //     }
  //   } catch (error) {
  //     console.error("Error resubmitting documents:", error);
  //     toast.error("Failed to resubmit documents");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleResubmitDocuments = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("restaurantId", restaurant?._id ?? "");

    try {
      setIsLoading(true);
      if (resubmitData.idProof && restaurant?.restaurantDocuments.idProofUrl) {
        try {
          await deleteFromCloudinary(restaurant.restaurantDocuments.idProofUrl);
        } catch (deleteError) {
          console.warn("Failed to delete old ID Proof, proceeding with upload:", deleteError);
        }
        const idProofName = await uploadToCloudinary(resubmitData.idProof);
        formDataToSend.append("idProof", idProofName);
      } else if (restaurant?.restaurantDocuments.idProofUrl) {
        formDataToSend.append("idProof", restaurant.restaurantDocuments.idProofUrl);
      }

      if (resubmitData.fssaiLicense && restaurant?.restaurantDocuments.fssaiLicenseUrl) {
        try {
          await deleteFromCloudinary(restaurant.restaurantDocuments.fssaiLicenseUrl);
        } catch (deleteError) {
          console.warn("Failed to delete old FSSAI License, proceeding with upload:", deleteError);
        }
        const fssaiLicenseName = await uploadToCloudinary(resubmitData.fssaiLicense);
        formDataToSend.append("fssaiLicense", fssaiLicenseName);
      } else if (restaurant?.restaurantDocuments.fssaiLicenseUrl) {
        formDataToSend.append("fssaiLicense", restaurant.restaurantDocuments.fssaiLicenseUrl);
      }

      if (resubmitData.businessCertificate && restaurant?.restaurantDocuments.businessCertificateUrl) {
        try {
          await deleteFromCloudinary(restaurant.restaurantDocuments.businessCertificateUrl);
        } catch (deleteError) {
          console.warn("Failed to delete old Business Certificate, proceeding with upload:", deleteError);
        }
        const businessCertificateName = await uploadToCloudinary(resubmitData.businessCertificate);
        formDataToSend.append("businessCertificate", businessCertificateName);
      } else if (restaurant?.restaurantDocuments.businessCertificateUrl) {
        formDataToSend.append("businessCertificate", restaurant.restaurantDocuments.businessCertificateUrl);
      }

      formDataToSend.append("bankAccountNumber", resubmitData.bankAccountNumber);
      formDataToSend.append("ifscCode", resubmitData.ifscCode);

      const response = await restaurantApi.resubmitRestaurantDocuments(dispatch, restaurant?._id ?? "", formDataToSend);

      if (response.message === "success") {
        toast.success("Documents resubmitted successfully!");
        setShowResubmitModal(false);
        setShowRejectionPopup(false);
        setRestaurant(response.restaurant);
      }
    } catch (error: any) {
      console.error("Error resubmitting documents:", error);
      toast.error("Failed to resubmit documents");
    } finally {
      setIsLoading(false);
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

          <VerificationPendingPopup
            showVerificationPopup={showVerificationPopup}
            setShowVerificationPopup={setShowVerificationPopup}
          />
          <RejectionPopup
            showRejectionPopup={showRejectionPopup}
            setShowRejectionPopup={setShowRejectionPopup}
            setShowResubmitModal={setShowResubmitModal}
          />

          {loginStep === "credentials" && (
            <CredentialsForm
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              handleSubmitCredentials={handleSubmitCredentials}
            />
          )}

          {loginStep === "otp" && (
            <OtpForm
              formData={formData}
              errors={errors}
              handleOtpChange={handleOtpChange}
              handleSubmitOtp={handleSubmitOtp}
              handleResendOtp={handleResendOtp}
              isResendDisabled={isResendDisabled}
              timer={timer}
            />
          )}

          {loginStep === "verifying" && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 text-blue-300 animate-spin mb-4" />
              <p className="text-blue-100 text-lg">Verifying your account...</p>
            </div>
          )}

          <ResubmitDocumentsModal
            showResubmitModal={showResubmitModal}
            setShowResubmitModal={setShowResubmitModal}
            resubmitData={resubmitData}
            previewImages={previewImages}
            handleFileChange={handleFileChange}
            handleRemoveImage={handleRemoveImage}
            handleResubmitChange={handleResubmitChange}
            handleResubmitDocuments={handleResubmitDocuments}
            idProofRef={idProofRef}
            fssaiLicenseRef={fssaiLicenseRef}
            businessCertificateRef={businessCertificateRef}
          />

          <div className="mt-6 text-center">
            <p className="text-blue-200/70 text-sm">
              New to Eatzaa Food Venture?{" "}
              <span className="text-orange-300 font-medium cursor-pointer">
                <a href="/restaurant/register">Register your restaurant</a>
              </span>
            </p>
            <p className="text-blue-200/70 text-sm mt-2">
              Need help?{" "}
              <span className="text-orange-300 font-medium cursor-pointer hover:underline">
                Contact support
              </span>
            </p>
          </div>
        </div>
      </div>

      <LoginSidebar />

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