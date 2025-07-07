export interface OrderApiResponse {
    data: {
        _id: string;
        createdAt: string;
        orderStatus: string;
        address: { street: string; city: string; state: string; pinCode: string }[];
        items: {
            foodId: string;
            name: string;
            description: string;
            price: number;
            quantity: number;
            images?: string[];
            category: string;
            hasVariants: boolean;
            variants?: { name: string; price: number; quantity: number }[];
            restaurantId: string;
            restaurantName: string;
            restaurantPhone?: string;
        }[];
        totalAmount: number;
        payment: { method: string };
        deliveryBoy?: {
            name: string;
            mobile: string;
            profileImage: string;
            rating?: number;
            totalDeliveries?: number;
        };
    };
}
