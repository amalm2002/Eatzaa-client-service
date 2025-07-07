export interface RestaurantCardProps {
    id?: string;
    name: string;
    restaurant: string;
    image: string;
    rating: number;
    cuisine: string;
    deliveryTime: string;
    opened: boolean;
    minimumOrder: string;
    distance?: string;
    promotion?: string;
    featured?: boolean;
    freeDelivery?: boolean;
    tags?: string[];
    onClick?: () => void;
}