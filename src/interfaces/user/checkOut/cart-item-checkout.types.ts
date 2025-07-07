export interface CartItemType {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    restaurantId: string
    restaurant: string | null;
    isVeg: boolean;
    maxAvailableQty: number;
}