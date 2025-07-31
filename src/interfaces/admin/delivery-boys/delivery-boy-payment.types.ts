export interface DeliveryBoy {
    id: string;
    name: string;
    phone: string;
    joinDate: string;
    weeklyEarnings: number;
    inHandCash: number;
    totalCash: number;
    ordersCompleted: number;
    lastPaymentDate: string;
    nextPaymentDate: string;
    status: 'pending' | 'paid' | 'overdue';
    completeAmount: number;
    amountToPayDeliveryBoy: number;
    monthlyEarnings: {
        month: string;
        amount: number;
        orders: number;
        status: 'pending' | 'paid';
    }[];
}

export interface VerifyPaymentResponse {
    success: boolean;
    message: string;
    deliveryBoyId: string;
    paymentId: string;
    data: {
        completeAmount: number;
        monthlyAmount: number;
        inHandCash: number;
        earnings: Array<{
            date: string;
            amount: number;
            paymentId: string;
        }>;
    };
}

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'paid':
            return 'bg-gray-200 text-gray-800 border border-gray-300';
        case 'pending':
            return 'bg-gray-100 text-gray-700 border border-gray-200';
        case 'overdue':
            return 'bg-gray-300 text-gray-900 border border-gray-400';
        default:
            return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const isPayButtonEnabled = (nextPaymentDate: string) => {
    const now = new Date();
    const nextPaidAt = new Date(nextPaymentDate);
    return now >= nextPaidAt;
};

export const isAlreadyPaid = (deliveryBoy: DeliveryBoy) => {
    return (
        deliveryBoy.amountToPayDeliveryBoy === 0 &&
        deliveryBoy.inHandCash === 0 &&
        deliveryBoy.completeAmount === 0 &&
        deliveryBoy.totalCash === 0
    );
};