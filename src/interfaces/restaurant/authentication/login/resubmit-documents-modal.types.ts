import { RefObject } from "react";

export type ResubmitDataKeys = "idProof" | "fssaiLicense" | "businessCertificate" | "bankAccountNumber" | "ifscCode";
export type PreviewImageKeys = "idProof" | "fssaiLicense" | "businessCertificate";

export interface ResubmitDocumentsModalProps {
    showResubmitModal: boolean;
    setShowResubmitModal: (value: boolean) => void;
    resubmitData: {
        idProof: File | null;
        fssaiLicense: File | null;
        businessCertificate: File | null;
        bankAccountNumber: string;
        ifscCode: string;
    };
    previewImages: {
        idProof: string;
        fssaiLicense: string;
        businessCertificate: string;
    };
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, field: ResubmitDataKeys) => void;
    handleRemoveImage: (field: PreviewImageKeys) => void;
    handleResubmitChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleResubmitDocuments: (e: React.FormEvent) => void;
    idProofRef: RefObject<HTMLInputElement | null>;
    fssaiLicenseRef: RefObject<HTMLInputElement | null>;
    businessCertificateRef: RefObject<HTMLInputElement | null>;
}