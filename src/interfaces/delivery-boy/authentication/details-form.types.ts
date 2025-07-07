import { Page } from "./login.types";
import { UserDetails } from "./user-details.types";

export interface DetailsPageProps {
    userDetails: UserDetails;
    setUserDetails: React.Dispatch<React.SetStateAction<UserDetails>>;
    handleNavigation: (page: Page) => void;
}

export interface DetailsHeaderProps {
    activeSection: 'personal' | 'documents' | 'bank';
    setActiveSection: (section: 'personal' | 'documents' | 'bank') => void;
    handleNavigation: (page: 'login' | 'otp' | 'details' | 'vehicle' | 'zone' | 'location' | 'resubmit') => void;
}