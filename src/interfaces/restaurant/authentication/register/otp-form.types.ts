export interface OtpFormProps {
    otp: string[];
    error: string | null;
    timer: number;
    isExpired: boolean;
    mobile: string;
    handleOtpChange: (index: number, value: string) => void;
    handleVerifyOtp: () => void;
    handleResendOtp: () => void;
    setStep: (step: "credentials" | "otp" | "documents" | "location") => void;
}