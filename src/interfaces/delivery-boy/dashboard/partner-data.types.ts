import { Zone } from "../location/zone.types";
import { Earnings } from "./earnings.types";
import { Location } from "../location/location.types";

export interface PartnerData {
    name: string;
    rating: number;
    email: string;
    mobile: string;
    earnings: Earnings;
    loginHours: string;
    ordersCompleted: number;
    pendingOrders: number;
    location: Location;
    zone: Zone;
    isOnline: boolean;
}
