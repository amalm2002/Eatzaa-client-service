export interface Dish {
    _id: string;
    name: string;
    rating: number;
    timing: string;
    category: string;
    restaurantName: string;
    imageUrl: string;
    discount: string;
    quantity: number;
    adFlag?: boolean;
    isOnline: boolean;
    price: number;
    restaurantId: string;
    description: string;
    hasVariants: boolean;
    images: string[];
    variants: { name: string; price: number; quantity: number }[];
}