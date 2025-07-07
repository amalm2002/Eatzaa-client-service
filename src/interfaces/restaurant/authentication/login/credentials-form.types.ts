export interface CredentialsFormProps {
    formData: { email: string; mobile: string };
    errors: { email: string; mobile: string };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmitCredentials: (e: React.FormEvent) => void;
}