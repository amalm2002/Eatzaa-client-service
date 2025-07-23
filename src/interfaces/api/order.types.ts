// export interface Variant {
//   name: string;
//   price: number;
// }

export interface CartItem {
  id: string;
  menuId?: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];
  restaurantId: string;
  restaurantName: string;
  category: string;
  discount: number;
  timing: string;
  rating: number;
  hasVariants: boolean;
  variants: any;
  maxAvailableQty: number;
}

export interface OrderData {
  userId: string;
  cartItems: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  location: { latitude: number; longitude: number };
  address: string;
  phoneNumber: string;
  paymentMethod: string;
  paymentId?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  razorpayKey: string;
  error?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  orderId: string;
}

export interface PlaceOrderResponse {
  success?: boolean;
  orderId: string;
  paymentId?: string;
  message?: string
}
