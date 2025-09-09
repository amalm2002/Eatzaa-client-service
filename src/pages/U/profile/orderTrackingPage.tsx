import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../../../api/endpoints/userApi';
import Navbar from '../../../components/user/layouts/Navbar';
import DeliveryTimeCard from '../../../components/user/order-tracking/DeliveryTimeCard';
import OrderStatusTimeline from '../../../components/user/order-tracking/OrderStatusTimeline';
import RestaurantDetails from '../../../components/user/order-tracking/RestaurantDetails';
import DeliveryPartnerCard from '../../../components/user/order-tracking/DeliveryPartnerCard';
import OrderSummary from '../../../components/user/order-tracking/OrderSummary';
import DeliveryAddress from '../../../components/user/order-tracking/DeliveryAddress';
import ActionButtons from '../../../components/user/order-tracking/ActionButtons';
import WalletModal from '../../../components/user/order-tracking/WalletModal';
import { CheckCircle, ChefHat, Package, Navigation, AlertTriangle } from 'lucide-react';
import { Order, Wallet } from '../../../interfaces/user/profile/order-tracking.types';

const OrderTrackingUI = () => {
  const { id } = useParams<{ id: string }>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [order, setOrder] = useState<Order | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [canCancel, setCanCancel] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const staticData = {
    restaurant: {
      name: 'Delicious Bites Restaurant',
      address: '123 Food Street, Downtown',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop',
    },
  };

  const orderStatuses = [
    { id: 'pending', label: 'Order Confirmed', icon: CheckCircle, time: order?.orderTime || '2:30 PM', desc: 'Your order has been confirmed' },
    { id: 'accepted', label: 'Order Accepted', icon: CheckCircle, time: '', desc: 'Your order has been accepted by the delivery partner' },
    { id: 'preparing', label: 'Preparing Food', icon: ChefHat, time: '', desc: 'Chef is preparing your delicious meal' },
    { id: 'packed', label: 'Ready for Pick Up', icon: Package, time: '', desc: 'Food is packed and ready for pickup' },
    { id: 'picked', label: 'Picked Up', icon: Navigation, time: '', desc: 'Your order has been picked up by the delivery partner' },
    { id: 'delivered', label: 'Delivered', icon: Package, time: '', desc: 'Enjoy your meal!' },
    { id: 'cancelled', label: 'Order Cancelled', icon: AlertTriangle, time: '', desc: 'Your order has been cancelled' },
  ];

  useEffect(() => {
    if (!order || order.currentStatus === 'delivered') return;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [order?.currentStatus]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await userApi.getOrderDetails(dispatch, id!);
        const formattedOrder: Order = {
          orderId: orderData._id,
          orderTime: new Date(orderData.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          estimatedDelivery: new Date(new Date(orderData.createdAt).getTime() + 45 * 60000).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          currentStatus: orderData.orderStatus.toLowerCase(),
          items: orderData.items.map((item: any) => ({
            foodId: item.foodId,
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            images: item.images || ['/api/placeholder/150/150'],
            category: item.category,
            hasVariants: item.hasVariants,
            variants: item.variants || [],
            restaurantId: item.restaurantId,
            restaurantName: item.restaurantName,
          })),
          totalAmount: orderData.totalAmount,
          deliveryAddress: orderData.address[0]
            ? `${orderData.address[0].street}, ${orderData.address[0].city}, ${orderData.address[0].state}, ${orderData.address[0].pinCode}`
            : 'Unknown Address',
          createdAt: orderData.createdAt,
          paymentMethod: orderData.payment.method,
          deliveryBoy: orderData.deliveryBoy
            ? {
              id: orderData.deliveryBoy.id,
              name: orderData.deliveryBoy.name,
              mobile: orderData.deliveryBoy.mobile,
              profileImage: orderData.deliveryBoy.profileImage,
              rating: 4.8,
              totalDeliveries: orderData.deliveryBoy.totalDeliveries,
            }
            : undefined,
        };

        setOrder(formattedOrder);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error((error as Error).message || 'Failed to fetch order details.');
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
      const interval = setInterval(fetchOrder, 10000);
      return () => clearInterval(interval);
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (!order) return;

    const cancelWindowMinutes = 2;
    const cancelWindowSeconds = cancelWindowMinutes * 60;
    const orderTime = new Date(order.createdAt).getTime();

    const updateTimer = () => {
      const currentTimeMs = new Date().getTime();
      const elapsedSeconds = Math.floor((currentTimeMs - orderTime) / 1000);
      const remainingSeconds = Math.max(cancelWindowSeconds - elapsedSeconds, 0);

      setTimeLeft(remainingSeconds);
      setCanCancel(
        (order.currentStatus === 'pending' || order.currentStatus === 'accepted') &&
        remainingSeconds > 0
      );
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [order]);

  const fetchWalletDetails = async () => {
    // Placeholder for wallet fetching logic
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    setIsCancelling(true);
    try {
      const response = await userApi.cancelOrder(dispatch, order.orderId);
      setOrder({ ...order, currentStatus: 'cancelled' });
      setCanCancel(false);
      toast.success(response.message || 'Order cancelled successfully');
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error((error as Error).message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatTimeLeft = (seconds: number) => {
    if (seconds === 0) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Order not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DeliveryTimeCard order={order} currentTime={currentTime} />
            <OrderStatusTimeline order={order} orderStatuses={orderStatuses} />
            <RestaurantDetails order={order} staticData={staticData} />
          </div>
          <div className="space-y-6">
            <DeliveryPartnerCard order={order} />
            <OrderSummary order={order} />
            <DeliveryAddress order={order} />
            <ActionButtons
              canCancel={canCancel}
              isCancelling={isCancelling}
              handleCancelOrder={handleCancelOrder}
              fetchWalletDetails={fetchWalletDetails}
              formatTimeLeft={formatTimeLeft}
              timeLeft={timeLeft}
            />
          </div>
        </div>
      </div>
      <WalletModal
        isWalletModalOpen={isWalletModalOpen}
        setIsWalletModalOpen={setIsWalletModalOpen}
        wallet={wallet}
      />
    </div>
  );
};

export default OrderTrackingUI;