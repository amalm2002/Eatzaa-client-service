export interface OtpFormProps {
    formData: { otp: string[]; mobile: string };
    errors: { otp: string };
    handleOtpChange: (index: number, value: string) => void;
    handleSubmitOtp: (e: React.FormEvent) => void;
    handleResendOtp: () => void;
    isResendDisabled: boolean;
    timer: number;
}