import { Address } from "../profile/user-profile.types";

export interface AddressSectionProps {
    onLocationSelect: (lat: number, lng: number) => void;
    onAddressSelect: (address: Address | null) => void;
    onPhoneUpdate: (phone: string) => void;
    userId: string;
}