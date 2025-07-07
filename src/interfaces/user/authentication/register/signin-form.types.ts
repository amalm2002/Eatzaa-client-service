import { FormData } from "./form-data.types";
import { ValidationErrors } from "../../../common/validation-errors.types";

export interface SigninFormProps {
    formData: FormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    errors: ValidationErrors;
    showPassword: boolean;
    setShowPassword: (value: boolean) => void;
    serverError: string | null;
}