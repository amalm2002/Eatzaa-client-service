import { ConfirmationResult } from "firebase/auth";
import { Page } from "./login.types";

export interface OtpPageProps {
    mobileNumber: string;
    setOtp: React.Dispatch<React.SetStateAction<string>>;
    handleNavigation: (page: Page) => void;
    confirmationResult: ConfirmationResult | null;
    backendData: {
        token: string;
        refreshToken: string;
        _id: string;
        mobile: string;
        isVerified: boolean;
        message: string;
        missingFields: string;
    } | null;
}