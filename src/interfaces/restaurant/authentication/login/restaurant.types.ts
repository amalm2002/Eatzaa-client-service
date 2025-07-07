export interface Restaurant {
    _id: string;
    email: string;
    mobile: number;
    restaurantName: string;
    isOnline: boolean;
    isVerified: boolean;
    location: {
        latitude: number;
        longitude: number;
    };
    rejectionReason: string;
    restaurantDocuments: {
        bankAccountNumber: string;
        businessCertificateUrl: string;
        fssaiLicenseUrl: string;
        idProofUrl: string;
        ifscCode: string;
    };
}
