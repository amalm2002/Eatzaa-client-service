import {
  ApplicationVerifier,
  Auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { toast } from "sonner";

export const onCaptchaVerify = (auth: Auth) => {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
  }
  console.log("RecaptchaVerifier after initialization:", window.recaptchaVerifier);


  // Ensure the container exists before initializing
  if (!document.getElementById("recaptcha-container")) {
    console.error("Recaptcha container not found");
    return;
  }
  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
      size: "invisible",
      callback: (respose: any) => {
        console.log("recaptcha verified result:", respose);
      },
      "expired-callback": () => {
        toast.error("Verification Expired");
        window.recaptchaVerifier?.clear();
      },
      "error-callback": (error: any) => {
        console.error("Recaptcha Error:", error);
        toast.error("Verification failed");
      },
    }
  );

};

export const sendOtp = async (
  setotpInput: any,
  auth: any,
  mobile: string,
  setConfirmationResult: any
) => {
  try {
    const number = "+91" + mobile;
    console.log(setotpInput,
      auth,
      mobile,
      setConfirmationResult);

    onCaptchaVerify(auth);
    // console.log("appVerifier:", window.recaptchaVerifier);

  
    console.log('numberrrrrrrrr',mobile,'----',auth,'------',setotpInput,'-----',setConfirmationResult);
    
    

    const appVerifier: ApplicationVerifier | undefined =
      window?.recaptchaVerifier;

    if (!appVerifier) {
      throw new Error("RecaptchaVerifier could not be created");
    }

    const result = await signInWithPhoneNumber(auth, number, appVerifier);
    console.log(result,'resultttttttttttttt');
    
    setConfirmationResult(result);
    toast.success("OTP sent successfully");
    setotpInput("otp")
  } catch (error) {
    console.log("OTP Send Error:", error);

    // More detailed error handling
    if (error instanceof Error) {
      switch (error.message) {
        case "auth/invalid-app-credential":
          toast.error(
            "Invalid app credentials. Please check your Firebase configuration."
          );
          break;
        case "auth/too-many-requests":
          toast.error("Too many requests. Please try again later.");
          break;
        default:
          toast.error(`OTP Send Failed: ${error.message}`);
      }
    } else {
      toast.error("An unexpected error occurred");
    }
  }
};