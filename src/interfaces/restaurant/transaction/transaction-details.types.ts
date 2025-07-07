export interface Transaction {
    _id: string;
    restaurantId: string;
    subscriptionId: string;
    amount: number;
    currency: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    status: "created" | "paid" | "failed";
    createdAt: string;
    updatedAt: string;
    expireAt?: string;
    isActive: boolean;
    errorCode?: string;
    errorDescription?: string;
    subscriptionPlan?: { name: string; period: string };
}