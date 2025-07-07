import { UserDetails } from "./user-details.types";

export interface PersonalInfoFormProps {
    userDetails: UserDetails;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSingleFileChange: (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage') => void;
    errors: Partial<Record<keyof UserDetails, string>>;
}

export interface DocumentsFormProps {
    userDetails: UserDetails;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, field: 'panCardImages' | 'licenseImages', index: number) => void;
    errors: Partial<Record<keyof UserDetails, string>>;
}