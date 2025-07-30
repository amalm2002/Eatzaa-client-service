import { PartnerData } from "./partner-data.types";

export interface StatusCardProps {
    isOnline: boolean;
    isInZone: boolean;
    zoneMessage: string;
    partnerData: PartnerData;
    handleToggleOnline: () => void;

    cashLimitStatus: { success: boolean; message: string }; 
    handlePayInHandCash: () => void;
}