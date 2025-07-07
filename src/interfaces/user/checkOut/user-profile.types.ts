import { Address } from "../profile/user-profile.types";

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: Address[];
}