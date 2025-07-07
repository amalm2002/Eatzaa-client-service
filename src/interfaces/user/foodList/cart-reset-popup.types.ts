export interface CartItem {
    menuId: string;
    quantity: number;
    price: number;
    name: string;
    category: string;
    restaurantName: string;
    discount: number;
    restaurantId: string;
    description: string;
    timing: string;
    rating: number;
    hasVariants: boolean;
    images: string[];
    variants: { name: string; price: number; quantity: number }[];
}

export interface CartResetPopupProps {
    showPopup: boolean;
    handleCancel: () => void;
    handleResetCart: () => void;
}