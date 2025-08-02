import { Dish } from "./dish.types";
import { CartItem } from "./cart-reset-popup.types";


export interface DishGridProps {
    dishes: Dish[];
    cartItems: CartItem[];
    handleAddToCart: (dish: Dish) => void;
}


export interface Review {
    _id: string;
    foodId: string;
    userId: string;
    orderId: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
    userName?: string;
    userAvatar?: string;
    verified?: boolean;
    helpful?: number;
}

export interface MenuItem {
    _id: string;
    restaurantId: string;
    name: string;
    description: string;
    category: 'veg' | 'non-veg' | 'drinks';
    price: number;
    quantity: number;
    images: string[];
    hasVariants: boolean;
    isActive: boolean;
    variants: any[];
    timing: string;
    averageRating?: number;
    totalReviews?: number;
    reviews?: Review[];
}
