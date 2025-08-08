import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import AddressSection from '../../components/user/check-out/AddressSection';
import PaymentSection from '../../components/user/check-out/PaymentSection';
import OrderSummarySection from '../../components/user/check-out/OrderSummarySection';
import Navbar from '../../components/user/layouts/Navbar';
import { toast } from 'sonner';
import { useSocket } from '../../context/SocketContext';
import { Address } from '../../interfaces/user/profile/user-profile.types';
import { RazorpayInstance, RazorpayOptions } from '../../interfaces/user/checkOut/razorpay.types';
import { userApi } from '../../api/endpoints/userApi';
import { OrderData } from '../../interfaces/api/order.types';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const Checkout = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  const userId = useSelector((store: { userAuth: { user_id: string } }) => store.userAuth.user_id);
  const userName = useSelector((store: { userAuth: { user: string } }) => store.userAuth.user);
  const { state } = useLocation();
  const { cartItems = [], subtotal = 0, deliveryFee = 0, tax = 0, total = 0 } = state || {};
  const dispatch = useSelector((state: any) => state);
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  const restaurant_id = cartItems.length > 0 ? cartItems[0].restaurantId : null;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLocationSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleAddressSelect = (address: Address | null) => {
    setSelectedAddress(address);
  };

  const handlePhoneUpdate = (phone: string) => {
    setPhoneNumber(phone);
  };

  const handlePaymentSelect = (method: string) => {
    setPaymentMethod(method);
  };

  const handlePlaceOrder = async () => {
    if (!location) {
      toast.error('Please select a delivery location');
      return;
    }
    if (location.lat === 23.226390067116835 && location.lng === 79.17271614074708) {
      toast.error('Please select a valid delivery location');
      return;
    }
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    if (!phoneNumber) {
      toast.error('Please provide a phone number');
      return;
    }
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    const formattedAddress = `${selectedAddress.houseName}, ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.pinCode}`;

    const orderData: OrderData = {
      userId,
      userName: userName,
      cartItems,
      subtotal,
      deliveryFee,
      tax,
      total,
      location: {
        latitude: location.lat,
        longitude: location.lng,
      },
      address: formattedAddress,
      phoneNumber,
      paymentMethod,
    };

    try {
      if (paymentMethod === 'upi') {
        const response = await userApi.createOrder(dispatch, {
          amount: total,
          userId,
          cartItems,
        });
        const { orderId, razorpayKey, paymentDbId } = response;
        if (!orderId || !razorpayKey || !paymentDbId) {
          toast.error('Invalid response from server');
          return;
        }

        if (!window.Razorpay) {
          toast.error('Razorpay SDK not loaded. Please try again.');
          return;
        }

        const options: RazorpayOptions = {
          key: razorpayKey,
          amount: total * 100,
          currency: 'INR',
          name: 'Eatzaa Food Hub',
          description: 'Order Payment',
          order_id: orderId,
          handler: async function (response: any) {
            try {
              const verifyResponse = await userApi.verifyPayment(dispatch, {
                paymentDbId: paymentDbId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  ...orderData,
                  paymentId: response.razorpay_payment_id,
                },
              });
              if (verifyResponse.data.success) {
                await userApi.updateUserCart(dispatch, userId);
                toast.success('Payment verified and order placed successfully!');
                if (socket && isConnected && restaurant_id) {
                  socket.emit('order-placed', { restaurantId: restaurant_id, orderId: verifyResponse.data.orderId });
                }
                navigate('/order-history', { state: { activeTab: 'orders' } });
              } else {
                toast.error('Order placement failed');
              }
            } catch (error: any) {
              console.error('Payment verification failed:', error);
              toast.error('Payment verification failed. Contact support.');
            }
          },
          prefill: {
            name: 'Eatzaa Food Hub',
            email: 'eatzaafoodhub@gmail.com',
            contact: phoneNumber,
          },
          theme: {
            color: '#2C938C',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', async function (response: any) {
          try {
            let x = await userApi.handleFailedPayment(dispatch, {
              paymentDbId,
              userId: userId,
              razorpay_order_id: response.error.metadata.order_id,
              razorpay_payment_id: response.error.metadata.payment_id,
              error_description: response.error.description,
              error_code: response.error.code,
            });
            console.log('response :', x);
            if (response.data.success) {
              toast.error(`Payment failed: ${response.data.message}. Please try again or choose another payment method.`);
            }
          } catch (error: any) {
            console.error('Failed to handle payment failure:', error);
            toast.error('Error processing payment failure. Please contact support.');
          }
        });
        rzp.open();
      } else {
        const orderResponse = await userApi.placeOrder(dispatch, orderData);
        if (orderResponse.data.success) {
          await userApi.updateUserCart(dispatch, userId);
          toast.success('Order placed successfully!');
          if (socket && isConnected && restaurant_id) {
            socket.emit('order-placed', { restaurantId: restaurant_id, orderId: orderResponse.data.orderId });
          }
          navigate('/order-history', { state: { activeTab: 'orders' } });
        } else {
          toast.error('Order placement failed');
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <AddressSection
              userId={userId}
              onLocationSelect={handleLocationSelect}
              onAddressSelect={handleAddressSelect}
              onPhoneUpdate={handlePhoneUpdate}
            />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <OrderSummarySection
              cartItems={cartItems}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              tax={tax}
              total={total}
            />
            <PaymentSection onPaymentSelect={handlePaymentSelect} />
            <button
              onClick={handlePlaceOrder}
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl text-sm"
            >
              Place Order ₹{total}
            </button>
            <p className="text-center text-xs text-gray-500">
              By placing this order, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;