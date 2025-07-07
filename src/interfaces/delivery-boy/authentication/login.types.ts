export type Page = 'login' | 'otp' | 'location' | 'details' | 'vehicle' | 'zone' | 'resubmit';

export interface LoginPageProps {
    setMobileNumber: React.Dispatch<React.SetStateAction<string>>;
    handleNavigation: (page: Page) => void;
    handleSendOtp: (mobile: string) => void;
}