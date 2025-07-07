export interface UserDetails {
    name: string;
    mobile: string;
    panCard: string;
    panCardImages: (File | null)[];
    license: string;
    licenseImages: (File | null)[];
    bankAccount: string;
    ifscCode: string;
    profileImage: File | null;
}
