import { UserDetails } from "./user-details.types";
import { Page } from "./login.types";

export interface ResubmitDetailsPageProps {
    userDetails: UserDetails;
    setUserDetails: React.Dispatch<React.SetStateAction<UserDetails>>;
    handleNavigation: (page: Page) => void;
}

export interface ResubmitHeaderProps {
    activeSection: 'personal' | 'documents' | 'bank';
    setActiveSection: (section: 'personal' | 'documents' | 'bank') => void;
    rejectionReason: string;
}

export interface ResubmitPersonalInfoFormProps {
    userDetails: UserDetails;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSingleFileChange: (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage') => void;
    errors: Partial<Record<keyof UserDetails, string>>;
    existingProfileImage: string | null;
}

export interface ResubmitDocumentsFormProps {
    userDetails: UserDetails;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, field: 'panCardImages' | 'licenseImages', index: number) => void;
    errors: Partial<Record<keyof UserDetails, string>>;
    existingPanCardImages: string[];
    existingLicenseImages: string[];
}

export interface ResubmitBankDetailsFormProps {
    userDetails: UserDetails;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors: Partial<Record<keyof UserDetails, string>>;
}