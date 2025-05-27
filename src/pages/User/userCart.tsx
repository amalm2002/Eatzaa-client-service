import { useState, useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import createAxios from '../../service/axiousServices/userAxious';
import CartItem from '../../components/user/CartItems';
import PricingSummary from '../../components/user/PricingTypeSummary';
import CheckoutButton from '../../components/user/CheckoutButton';
import Navbar from '../../components/user/Navbar';
import restaurantCreateAxios from '../../service/axiousServices/restaurantAxious'
import { toast } from 'sonner';

export interface CartItemType {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  restaurant: string;
  isVeg: boolean;
  maxAvailableQty: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const axiosInstance = createAxios(dispatch);
  const restaurantAxiosInstance = restaurantCreateAxios(dispatch)
  const userId = useSelector((store: { userAuth: { user_id: string } }) => store.userAuth.user_id);


  const mapItemsWithImages = async (rawItems: any[]): Promise<CartItemType[]> => {
    const mappedItems: CartItemType[] = rawItems.map((item: any) => ({
      id: item.menuId,
      name: item.name,
      description: item.category === 'veg' ? `Fresh ${item.name} dish` : `Delicious ${item.name} dish`,
      price: item.price,
      quantity: item.quantity,
      image: '/api/placeholder/150/150',
      restaurant: item.restaurantName,
      isVeg: item.category === 'veg',
      maxAvailableQty: 10,
    }));

    const updatedItems = await Promise.all(
      mappedItems.map(async (item) => {
        try {
          const res = await restaurantAxiosInstance.get(`/menu-item/${item.id}`);
          const imageFromMenu = res.data?.images?.[0] || item.image;
          const availableQty = Math.min(res.data?.quantity || 0, 10);
          return { ...item, image: imageFromMenu, maxAvailableQty: availableQty };
        } catch (err) {
          console.error(`Error fetching menu for item ${item.id}`, err);
          return item;
        }
      })
    );

    return updatedItems;
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axiosInstance.get(`/get-cart/${userId}`);
        const fetchedItems = response.data.response.items || [];
        const updatedItems = await mapItemsWithImages(fetchedItems);
        setCartItems(updatedItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItems([]);
      }
    };

    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  const updateQuantity = async (id: string, newQuantity: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    const maxQty = item.maxAvailableQty ?? 10;
    if (newQuantity < 1 || newQuantity > maxQty) {
      alert(`Please choose a quantity between 1 and ${maxQty}`);
      return;
    }

    try {

      const response = await axiosInstance.patch(`/update-cart-item/${userId}`, {
        menuId: id,
        quantity: newQuantity,
      });

      if (response.data.message === 'Cart item quantity updated successfully') {
        toast.success(response.data.message);
        const updatedItems = await mapItemsWithImages(response.data.response.cart.items);
        setCartItems(updatedItems);
      }

    } catch (err) {
      console.error('Error updating cart item quantity:', err);
      toast.error((err as Error).message || 'Something went wrong');
    }
  };

  const removeItem = async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/remove-cart-item/${userId}/${id}`);

      if (response.data.message === 'Item removed from cart successfully') {
        toast.success(response.data.message);
        const updatedItems = await mapItemsWithImages(response.data.response.cart.items);
        setCartItems(updatedItems);
      }

    } catch (error) {
      console.error('Error removing cart item:', error);
      toast.error('Failed to remove item');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 40;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <div className="flex flex-col items-center justify-center min-h-96 px-4">
          <div className="text-center">
            <div className="w-32 h-32 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-16 h-16 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious food to get started!</p>
            <Link
              to="/"
              className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <Navbar />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-64px)]">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Cart</h2>
            <div className="divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <div className="lg:sticky lg:top-20">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Summary</h3>
                <PricingSummary
                  subtotal={subtotal}
                  deliveryFee={deliveryFee}
                  tax={tax}
                  total={total}
                />
                <div className="border-t border-gray-200 pt-4">
                  <CheckoutButton
                    total={total}
                    itemCount={cartItems.length}
                    cartItems={cartItems}
                    subtotal={subtotal}
                    deliveryFee={deliveryFee}
                    tax={tax}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;