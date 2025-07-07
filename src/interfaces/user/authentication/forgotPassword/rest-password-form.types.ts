export interface ResetPasswordFormProps {
    newPassword: string;
    setNewPassword: (value: string) => void;
    confirmPassword: string;
    setConfirmPassword: (value: string) => void;
    showPassword: boolean;
    setShowPassword: (value: boolean) => void;
    showConfirmPassword: boolean;
    setShowConfirmPassword: (value: boolean) => void;
    handleResetPassword: (e: React.FormEvent) => void;
    errors: { [key: string]: string };
}