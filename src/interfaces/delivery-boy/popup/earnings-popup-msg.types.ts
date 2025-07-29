export interface EarningsPopupProps {
    isOpen?: boolean;
    onClose?: () => void;
    earnings?: number;
    orderDetails?: {
        orderId: string;
        customerName: string;
        deliveryTime: string;
    };
}