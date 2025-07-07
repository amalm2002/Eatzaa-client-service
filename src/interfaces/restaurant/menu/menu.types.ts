export interface Variant {
  name: string;
  price: number;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  images: string[];
  hasVariants: boolean;
  variants: Variant[];
  timing: string;
  restaurantId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isActive: boolean;
}