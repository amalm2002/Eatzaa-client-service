import { FormData } from "./form-data.types";

export interface EmailFormProps {
    formData: FormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSendOtp: (e: React.FormEvent<HTMLFormElement>) => void;
    errors: { [key: string]: string };
}