import { Zone } from "../location/zone.types";
import { Earnings } from "./earnings.types";
import { Location } from "../location/location.types";

interface PaymentHistory {
  _id: string;
  amount: number;
  createdAt: string;
  razorpayPaymentId: string;
  status: string;
  deliveryBoyId: string;
  razorpayOrderId: string;
  role: string;
  amountToPayDeliveryBoy: number;
  completeAmount: number;
  inHandCash: number;
  monthlyAmount: number;
}

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
    inHandCash?: number;
    amountToPayDeliveryBoy?: number;
    paymentHistory?: PaymentHistory[];
}
