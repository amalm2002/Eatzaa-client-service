import { DeliveryBoy } from "./delivery-boy.types";

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
    restaurantPhone?: string;
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
