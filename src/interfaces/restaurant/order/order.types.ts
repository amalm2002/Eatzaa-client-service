export interface OrderItem {
    foodId: string;
    name: string;
    quantity: number;
    price: number;
    category: string;
    description: string;
    images: string[];
    hasVariants: boolean;
    variants: { name: string; price: number; quantity: number }[];
    restaurantId: string;
    restaurantName: string;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    pinCode: string;
}

export interface Order {
    _id: string;
    orderId: string;
    userId: string;
    userName?: string;
    items: OrderItem[];
    address: Address[];
    phoneNumber: string;
    payment: {
        method: string;
        status: string;
    };
    orderStatus: 'Pending' | 'Preparing' | 'Packed' | 'Delivered' | 'Cancelled';
    orderNumber: number;
    totalAmount: number;
    createdAt: string;
}
