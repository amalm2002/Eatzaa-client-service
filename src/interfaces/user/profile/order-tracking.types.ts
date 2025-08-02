export interface OrderItem {
    foodId: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    images: string[];
    category: string;
    hasVariants: boolean;
    variants: { name: string; price: number; quantity: number }[];
    restaurantId: string;
    restaurantName: string;
}

export interface DeliveryBoy {
    id?:string;
    name: string;
    mobile: string;
    profileImage: string;
    rating?: number;
    totalDeliveries?: number;
}

export interface Order {
    orderId: string;
    orderTime: string;
    estimatedDelivery: string;
    currentStatus: string;
    items: OrderItem[];
    totalAmount: number;
    deliveryAddress: string;
    createdAt: string;
    paymentMethod: string;
    deliveryBoy?: DeliveryBoy;
}

export interface Wallet {
    balance: number;
    transactions: {
        amount: number;
        type: 'credit' | 'debit';
        description: string;
        createdAt: string;
    }[];
}

export interface DeliveryTimeCardProps {
    order: Order;
    currentTime: Date;
}

export interface OrderStatus {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    time: string;
    desc: string;
}

export interface OrderStatusTimelineProps {
    order: Order;
    orderStatuses: OrderStatus[];
}

export interface RestaurantDetailsProps {
    order: Order;
    staticData: { restaurant: { name: string; address: string; image: string } };
}

export interface DeliveryPartnerCardProps {
    order: Order;
}

export interface OrderSummaryProps {
    order: Order;
}

export interface DeliveryAddressProps {
    order: Order;
}

export interface ActionButtonsProps {
    canCancel: boolean;
    isCancelling: boolean;
    handleCancelOrder: () => void;
    fetchWalletDetails: () => void;
    formatTimeLeft: (seconds: number) => string;
    timeLeft: number;
}

export interface WalletModalProps {
    isWalletModalOpen: boolean;
    setIsWalletModalOpen: (open: boolean) => void;
    wallet: Wallet | null;
}

export interface Review {
  id: string; 
  userId: string;
  deliveryBoyId: string;
  orderId: string;
  rating: number;       
  comment: string;
  createdAt: string;    
  updatedAt?: string;   
}
