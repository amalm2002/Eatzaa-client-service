export interface DocumentData {
    idProof: File | null;
    fssaiLicense: File | null;
    businessCertificate: File | null;
    bankAccountNumber: string;
    ifscCode: string;
    idProofUrl?: string;
    fassiLicenseUrl?: string;
    businessCertificateUrl?: string;
    restaurant_id: string;
}

export interface DocumentUploadPageProps {
    formData: {
        restaurantName: string;
        email: string;
        mobile: string;
    };
    navigate: (path: string) => void;
    setStep: (step: "credentials" | "otp" | "documents" | "location") => void;
}
