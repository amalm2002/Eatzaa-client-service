
export interface CartItemType {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    images: string[];
    restaurantId: string;
    restaurant: string;
    category: string;
    discount: number;
    timing: string;
    rating: number;
    hasVariants: boolean;
    variants: { name: string; price: number; quantity: number }[];
    maxAvailableQty: number;
}


export interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
}