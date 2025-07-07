export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: Address[];
    favoriteRestaurants: FavoriteRestaurant[];
    recentOrders: Order[];
}

export interface Address {
    houseName: string;
    street: string;
    city: string;
    state: string;
    pinCode: string;
}

export interface FavoriteRestaurant {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    imageUrl: string;
}

export interface Order {
    id: string;
    restaurantName: string;
    date: string;
    status: 'delivered' | 'processing' | 'cancelled';
    total: number;
    items: OrderItem[];
}

export interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

