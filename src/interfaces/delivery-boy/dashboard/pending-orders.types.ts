import { PartnerData } from "./partner-data.types";
import { RecentOrder } from "./recent-order.types";

export interface PendingOrdersProps {
    partnerData: PartnerData;
    recentOrders: RecentOrder[];
}