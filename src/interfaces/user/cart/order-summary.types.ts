import { CartItemType } from "./cart-item.types";

export interface OrderSummarySectionProps {
    cartItems: CartItemType[];
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
}
