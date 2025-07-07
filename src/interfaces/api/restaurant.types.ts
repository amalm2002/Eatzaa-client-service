export interface RestaurantMenuItem {
  _id: string;
  name: string;
  restaurantName: string;
  restaurantId: string;
  images: string[];
  category: string;
  description: string;
  price: number;
  timing: string;
  isOnline: boolean;
  isActive: boolean;
  hasVariants: boolean;
  variants: any[];
  quantity: number;
  createdAt: string;
  updatedAt: string;
}
export interface RestaurantMenuResponse {
    data: RestaurantMenuItem[];
}