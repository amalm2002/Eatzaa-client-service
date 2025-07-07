import { ValidationErrors } from "../../../common/validation-errors.types";
import { FormData } from "./form-data.types";

export interface CredentialsFormProps {
    formData: FormData;
    validationErrors: ValidationErrors;
    error: string | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    showAnimation: boolean;
}