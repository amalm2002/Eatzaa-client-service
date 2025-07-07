import { CartItemType } from "./cart-item.types";

export interface CheckoutButtonProps {
    total: number;
    itemCount: number;
    cartItems: CartItemType[];
    subtotal: number;
    deliveryFee: number;
    tax: number;
}