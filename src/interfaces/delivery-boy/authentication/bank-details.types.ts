import { UserDetails } from "./user-details.types";

export interface BankDetailsFormProps {
    userDetails: UserDetails;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: Partial<Record<keyof UserDetails, string>>;
}
