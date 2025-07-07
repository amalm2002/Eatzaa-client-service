import { Dish } from "./dish.types";
import { CartItem } from "./cart-reset-popup.types";


export interface DishGridProps {
    dishes: Dish[];
    cartItems: CartItem[];
    handleAddToCart: (dish: Dish) => void;
}