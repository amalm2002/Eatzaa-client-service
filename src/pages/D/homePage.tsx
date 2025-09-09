import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deliveryBoyLogout } from '../../service/redux/slices/deliveryBoySlice';
import Cookies from 'js-cookie';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import { toast } from 'sonner';
import { isPointInPolygon } from 'geolib';
import Sidebar from '../../components/delivery-boy/Sidebar';
import Header from '../../components/delivery-boy/Header';
import StatusCard from '../../components/delivery-boy/home/StatusCard';
import StatsCards from '../../components/delivery-boy/home/StatsCards';
import PendingOrders from '../../components/delivery-boy/home/PendingOrders';
import WeeklySummary from '../../components/delivery-boy/home/WeeklySummary';
import RecentOrders from '../../components/delivery-boy/home/RecentOrders';
import { PartnerData } from '../../interfaces/delivery-boy/dashboard/partner-data.types';
import { Coordinates } from '../../interfaces/delivery-boy/location/coordinates.types';
import { RecentOrder } from '../../interfaces/delivery-boy/dashboard/recent-order.types';
import { RootState } from '../../interfaces/delivery-boy/dashboard/root-state.types';
import { deliveryBoyApi } from '../../api/endpoints/deliveryBoyApi';
import { useInHandCashLimit } from '../../hooks/useInHandCashLimit';

const DeliveryPartnerDashboard = () => {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isInZone, setIsInZone] = useState<boolean>(true);
  const [zoneMessage, setZoneMessage] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [partnerData, setPartnerData] = useState<PartnerData>({
    name: '',
    rating: 0,
    email: '',
    mobile: '',
    earnings: { today: 0, week: 0 },
    loginHours: '00:00:00',
    ordersCompleted: 0,
    pendingOrders: 0,
    location: { latitude: 0, longitude: 0 },
    zone: { id: { _id: '', name: '', coordinates: [] }, name: '' },
    isOnline: false,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deliveryBoyId = useSelector((store: RootState) => store.deliveryBoyAuth.delivery_boy_id);
  const deliveryBoyRole = useSelector((store: RootState) => store.deliveryBoyAuth.role);
  const deliveryCompletedTrigger = useSelector((store: RootState) => store.deliveryBoyAuth.deliveryCompletedTrigger);
  const { cashLimitStatus, setCashLimitStatus } = useInHandCashLimit()
  // const cashLimitStatus = useInHandCashLimit();


  const hashSensitiveData = (data: string): string => {
    return HmacSHA256(data, `${import.meta.env.VITE_COOKIES_SECRET}`).toString();
  };

  const sensitiveFields: (keyof Pick<PartnerData, 'name' | 'email' | 'mobile'>)[] = ['name', 'email', 'mobile'];

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const storeInCookies = (data: PartnerData, timerValue: number) => {
    const cookieData: PartnerData = {
      ...data,
      location: data.location || { latitude: 0, longitude: 0 },
      zone: data.zone || { id: { _id: '', name: '', coordinates: [] }, name: '' },
    };
    sensitiveFields.forEach((field) => {
      const value = cookieData[field];
      if (value && typeof value === 'string') {
        cookieData[field] = hashSensitiveData(value) as any;
      }
    });
    Cookies.set('deliveryBoyData', JSON.stringify(cookieData), { expires: 1, secure: true, sameSite: 'strict' });
    Cookies.set('timerSeconds', timerValue.toString(), { expires: 1, secure: true, sameSite: 'strict' });
  };

  const loadFromCookies = (): { partnerData: PartnerData | null; timerSeconds: number } => {
    const cookieData = Cookies.get('deliveryBoyData');
    const timerData = Cookies.get('timerSeconds');
    let parsedData: PartnerData | null = null;
    let timerValue = 0;
    if (cookieData) {
      try {
        parsedData = JSON.parse(cookieData);
      } catch (error) {
        console.error('Error parsing cookie data:', error);
      }
    }
    if (timerData) {
      timerValue = parseInt(timerData, 10) || 0;
    }
    return { partnerData: parsedData, timerSeconds: timerValue };
  };

  const formatTimer = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const checkLocation = (currentPartnerData: PartnerData) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation: Coordinates = { latitude, longitude };
        const zoneCoordinates = currentPartnerData.zone.id.coordinates;
        if (!zoneCoordinates || zoneCoordinates.length === 0) {
          console.error('No zone coordinates available');
          setZoneMessage('No zone assigned. Please contact support.');
          setIsInZone(false);
          toast.error('No zone assigned. Please contact support.');
          return;
        }
        const formattedCoordinates = zoneCoordinates.map((coord) => ({
          latitude: coord.latitude,
          longitude: coord.longitude,
        }));
        console.log('newLocation :', newLocation);

        const inZone = isPointInPolygon(newLocation, formattedCoordinates);
        setIsInZone(inZone);
        if (!inZone) {
          setZoneMessage('Please go to your zone and get your orders.');
          setIsOnline(false);
          toast.warning('Please go to your zone and get your orders.');
          updateOnlineStatusInDb(false);
        } else {
          setZoneMessage('You are in your zone. Ready to receive orders.');
          toast.success('You are in your zone. Ready to receive orders.');
        }
      },
      (err) => {
        console.error('Error getting current position:', err);
        setZoneMessage('Unable to get your location. Please enable location services.');
        setIsInZone(false);
        toast.error('Unable to get your location. Please enable location services.');
      }
    );
  };

  const updateOnlineStatusInDb = async (status: boolean) => {
    try {
      const data = await deliveryBoyApi.updateOnlineStatus(dispatch, deliveryBoyId, status);
      const newOnlineStatus = data.isOnline;
      const updatedData: PartnerData = {
        ...partnerData,
        isOnline: newOnlineStatus,
        loginHours: formatTimer(timerSeconds),
      };
      setIsOnline(newOnlineStatus);
      setPartnerData(updatedData);
      storeInCookies(updatedData, timerSeconds);
    } catch (error) {
      console.error('Error updating online status in database:', error);
      toast.error('Failed to update online status. Please try again.');
    }
  };


  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isOnline && isInZone) {
      timer = setInterval(() => {
        setTimerSeconds((prev) => {
          const newSeconds = prev + 1;
          storeInCookies(partnerData, newSeconds);
          setPartnerData((prevData) => ({
            ...prevData,
            loginHours: formatTimer(newSeconds),
          }));
          return newSeconds;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOnline, isInZone]);

  useEffect(() => {
    let locationTimer: NodeJS.Timeout | null = null;
    let watchId: number | null = null;
    if (isOnline) {
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation: Coordinates = { latitude, longitude };
          try {
            await deliveryBoyApi.updateLocation(dispatch, deliveryBoyId, newLocation);
            setPartnerData((prev) => {
              const updatedData: PartnerData = { ...prev, location: newLocation };
              storeInCookies(updatedData, timerSeconds);
              return updatedData;
            });
          } catch (error) {
            console.error('Error updating location to backend:', error);
            toast.error('Failed to update live location.');
          }
        },
        (err) => {
          console.error('Error on watching the live location:', err);
          toast.error('Failed to update live location. Please enable location services.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      locationTimer = setInterval(() => checkLocation(partnerData), 30000);
    }
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (locationTimer) {
        clearInterval(locationTimer);
      }
    };
  }, [isOnline]);

  useEffect(() => {
    const fetchDeliveryBoyData = async () => {
      try {
        const { partnerData: cookieData, timerSeconds: savedTimerSeconds } = loadFromCookies();
        if (cookieData && cookieData.name && cookieData.mobile) {
          setPartnerData((prev) => ({
            ...prev,
            rating: cookieData.rating || 0,
            isOnline: cookieData.isOnline || false,
            earnings: cookieData.earnings || { today: 0, week: 0 },
            loginHours: formatTimer(savedTimerSeconds),
            ordersCompleted: cookieData.ordersCompleted || 0,
            pendingOrders: cookieData.pendingOrders || 0,
            location: cookieData.location || { latitude: 0, longitude: 0 },
            zone: cookieData.zone || { id: { _id: '', name: '', coordinates: [] }, name: '' },
          }));
          setIsOnline(cookieData.isOnline || false);
          setTimerSeconds(savedTimerSeconds);
        }
        const data = await deliveryBoyApi.getDeliveryBoyData(dispatch, deliveryBoyId);
        const updatedData: PartnerData = {
          name: data?.name || '',
          rating: data.rating || 4.8,
          email: data.email || '',
          mobile: data.mobile || '',
          isOnline: data.isOnline || false,
          earnings: { today: data.earnings?.today || 0, week: data.earnings?.week || 0 },
          loginHours: formatTimer(savedTimerSeconds),
          ordersCompleted: data.ordersCompleted || 0,
          pendingOrders: data.pendingOrders || 0,
          inHandCash: data.inHandCash || 0,
          amountToPayDeliveryBoy: data.amountToPayDeliveryBoy || 0,
          location: data?.location || { latitude: 0, longitude: 0 },
          zone: data?.zone || { id: { _id: '', name: '', coordinates: [] }, name: '' },
        };
        setPartnerData(updatedData);
        setIsOnline(data.isOnline);
        storeInCookies(updatedData, savedTimerSeconds);
        checkLocation(updatedData);
      } catch (error) {
        console.error('Error fetching delivery boy data:', error);
      }
    };
    fetchDeliveryBoyData();
  }, [deliveryBoyId, deliveryCompletedTrigger]);

  useEffect(() => {
    const fetchDeliveryBoyOrders = async () => {
      try {
        const orders = await deliveryBoyApi.getDeliveryBoyOrders(dispatch, deliveryBoyId);
        const formattedOrders: RecentOrder[] = orders.map((order: any) => ({
          id: `#${order._id.slice(-4).toUpperCase()}`,
          orderNumber: order.orderNumber,
          restaurant: order.items[0]?.restaurantName || 'Unknown Restaurant',
          amount: order.totalAmount,
          time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: order.orderStatus,
        }));
        setRecentOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching delivery boy orders:', error);
        toast.error('Failed to fetch orders. Please try again.');
      }
    };
    fetchDeliveryBoyOrders();
  }, [deliveryBoyId, deliveryCompletedTrigger]);

  let payAmount = partnerData?.amountToPayDeliveryBoy !== undefined && partnerData.amountToPayDeliveryBoy > 0
    ? partnerData.amountToPayDeliveryBoy
    : partnerData?.inHandCash ?? 0;


  const handlePayInHandCash = async () => {
    try {
      if (payAmount <= 0) {
        toast.error('Invalid payment amount');
        return;
      }

      toast.success('Payment initiated. Please follow the instructions to clear your in-hand cash.');
      const orderResponse = await deliveryBoyApi.createAdminPayment(dispatch, {
        deliveryBoyId,
        amount: payAmount * 100,
        role: deliveryBoyRole,
      });

      if (!orderResponse || !orderResponse.orderId) {
        throw new Error(orderResponse?.error || 'Invalid Razorpay order response');
      }

      const options = {
        key: orderResponse.razorpayKey,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'In-Hand Cash Payment',
        description: `Payment to clear in-hand cash for delivery boy ${deliveryBoyId}`,
        order_id: orderResponse.orderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verificationResponse = await deliveryBoyApi.verifyAdminPayment(dispatch, {
              deliveryBoyId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              role: deliveryBoyRole,
            });

            if (verificationResponse.data.success) {
              const { data } = verificationResponse;
              const response = await deliveryBoyApi.checkTheInHandCash(dispatch, deliveryBoyId);
              setCashLimitStatus(response.data);
              toast.success('Payment processed successfully! In-hand cash cleared.');
            } else {
              throw new Error(verificationResponse.data.message || 'Payment verification failed');
            }
          } catch (error: any) {
            toast.error('Payment verification failed: ' + (error.message || 'Unknown error'));
            console.error('Payment verification error:', error);
          }
        },
        prefill: {
          name: partnerData.name,
          contact: partnerData.mobile
        },
        theme: {
          color: '#4B5563',
        },
        modal: {
          ondismiss: async () => {
            toast.info('Payment cancelled. You can try again after a few minutes.');
            try {
              await deliveryBoyApi.cancelAdminPayment(dispatch, {
                deliveryBoyId,
                orderId: orderResponse.orderId,
                role: deliveryBoyRole,
              });
            } catch (error) {
              console.error('Error cancelling payment:', error);
            }
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to initiate payment';
      toast.error(errorMessage);
      console.error('Payment initiation error:', error);
    }
  };

  const handleToggleOnline = async () => {
    if (!isInZone) {
      toast.warning('Please go to your zone and get your orders.');
      setZoneMessage('Please go to your zone and get your orders.');
      return;
    }
    if (!cashLimitStatus.success) {
      toast.warning(cashLimitStatus.message);
      return;
    }
    try {
      await updateOnlineStatusInDb(!isOnline);
    } catch (error) {
      console.error('Error toggling online status:', error);
      toast.error('Failed to toggle online status. Please try again.');
    }
  };

  const handleLogout = async () => {
    if (isOnline) {
      toast.warning('Please turn off your online status before logging out.');
      return;
    }
    setTimerSeconds(0);
    setPartnerData((prev) => ({ ...prev, loginHours: '00:00:00' }));
    Cookies.remove('timerSeconds');
    dispatch(deliveryBoyLogout());
    localStorage.removeItem('deliveryBoyToken');
    localStorage.removeItem('deliveryBoyRefreshToken');
    Cookies.remove('deliveryBoyData');
    navigate('/delivery-boy/login');
  };

  return (
    <div className="flex h-screen bg-orange-50 text-gray-800 font-sans">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} partnerData={partnerData} handleLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentTime={currentTime} partnerData={partnerData} />
        <main className="flex-1 overflow-y-auto p-6 bg-orange-50">
          <StatusCard
            isOnline={isOnline}
            isInZone={isInZone}
            zoneMessage={zoneMessage}
            partnerData={partnerData}
            handleToggleOnline={handleToggleOnline}
            cashLimitStatus={cashLimitStatus}
            handlePayInHandCash={handlePayInHandCash}
          />
          <StatsCards partnerData={partnerData} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PendingOrders partnerData={partnerData} recentOrders={recentOrders} />
            <WeeklySummary partnerData={partnerData} />
          </div>
          <RecentOrders recentOrders={recentOrders} />
        </main>
      </div>
    </div>
  );
};

export default DeliveryPartnerDashboard;