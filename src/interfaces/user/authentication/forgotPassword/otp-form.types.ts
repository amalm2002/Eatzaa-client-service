export interface OtpFormProps {
    otp: string[];
    handleOtpChange: (index: number, value: string) => void;
    handleVerifyOtp: (e: React.FormEvent) => void;
    handleResendOtp: () => void;
    timer: number;
    errors: { [key: string]: string };
}