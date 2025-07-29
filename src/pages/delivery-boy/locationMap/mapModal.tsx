import React, { useCallback, useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../../service/redux/store';
import { completeDelivery } from '../../../service/redux/slices/notificationSlice';
import { useSocket } from '../../../context/SocketContext';
import { debounce } from 'lodash';
import { MapModalProps } from '../../../interfaces/delivery-boy/location-map/map-modal.types';
import { Order } from '../../../interfaces/delivery-boy/location-map/order.types';
import { UserDetails } from '../../../interfaces/delivery-boy/location-map/user-details.types';
import { deliveryBoyApi } from '../../../api/endpoints/deliveryBoyApi';
import { toggleDeliveryRefresh } from '../../../service/redux/slices/deliveryBoySlice';
import { EarningsPopup } from '../../../components/delivery-boy/popup/DeliveryEarningsPopup';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const deliveryBoyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const formatDistance = (distance: number): string => {
  if (distance < 1000) return `${Math.round(distance)}m`;
  return `${(distance / 1000).toFixed(1)}km`;
};

const formatDuration = (distance: number): string => {
  const speedKmh = 30;
  const durationHours = distance / 1000 / speedKmh;
  const durationMinutes = durationHours * 60;
  if (durationMinutes < 60) return `${Math.round(durationMinutes)} min`;
  const hours = Math.floor(durationMinutes / 60);
  const minutes = Math.round(durationMinutes % 60);
  return `${hours}h ${minutes}m`;
};

const DeliveryMapPage: React.FC<MapModalProps> = ({
  origin,
  destination,
  orderId,
  deliveryBoyId,
}) => {
  const [hasArrived, setHasArrived] = useState(false);
  const [deliveryStep, setDeliveryStep] = useState<
    'going_to_restaurant' | 'confirm_order' | 'verify_pin' | 'going_to_customer' | 'completed'
  >('going_to_restaurant');
  const [currentLocation, setCurrentLocation] = useState(origin);
  const [currentDestination, setCurrentDestination] = useState(destination);
  const [distance, setDistance] = useState<number>(0);
  const [totalDistance, setTotalDistance] = useState<number>(0);
  const [isTracking, setIsTracking] = useState(false);
  const [lastLocationUpdate, setLastLocationUpdate] = useState<Date>(new Date());
  const [showPinVerification, setShowPinVerification] = useState(false);
  const [pinInput, setPinInput] = useState(['', '', '', '', '', '']);
  const [order, setOrder] = useState<Order | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [showEarningsPopup, setShowEarningsPopup] = useState(false);
  const [earnings, setEarnings] = useState<number>(0);
  const mapRef = useRef<L.Map | null>(null);
  const routingControlRef = useRef<L.Routing.Control | null>(null);
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const watchIdRef = useRef<number | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { socket, isConnected } = useSocket();
  const navigate = useNavigate();

  const debouncedSetCurrentLocation = useCallback(
    debounce((newLocation: { latitude: number; longitude: number }) => {
      setCurrentLocation(newLocation);
      setLastLocationUpdate(new Date());
    }, 2000),
    []
  );

  const isValidCoordinates = (location: { latitude: number; longitude: number }): boolean => {
    return (
      typeof location.latitude === 'number' &&
      typeof location.longitude === 'number' &&
      location.latitude >= -90 &&
      location.latitude <= 90 &&
      location.longitude >= -180 &&
      location.longitude <= 180
    );
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await deliveryBoyApi.getOrderDetails(dispatch, orderId);
        const formattedOrder: Order = {
          orderId: orderData._id,
          orderTime: new Date(orderData.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          estimatedDelivery: new Date(new Date(orderData.createdAt).getTime() + 45 * 60000).toLocaleTimeString(
            [],
            { hour: '2-digit', minute: '2-digit' }
          ),
          currentStatus: orderData.orderStatus.toLowerCase(),
          items: orderData.items.map((item) => ({
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
            restaurantPhone: item.restaurantPhone,
          })),
          totalAmount: orderData.totalAmount,
          deliveryAddress: orderData.address[0]
            ? `${orderData.address[0].street}, ${orderData.address[0].city}, ${orderData.address[0].state}, ${orderData.address[0].pinCode}`
            : 'Unknown Address',
          createdAt: orderData.createdAt,
          paymentMethod: orderData.payment.method,
          deliveryBoy: orderData.deliveryBoy
            ? {
              name: orderData.deliveryBoy.name,
              mobile: orderData.deliveryBoy.mobile,
              profileImage: orderData.deliveryBoy.profileImage,
              rating: orderData.deliveryBoy.rating || 4.8,
              totalDeliveries: orderData.deliveryBoy.totalDeliveries || 1000,
            }
            : undefined,
        };

        setOrder(formattedOrder);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error((error as Error).message || 'Failed to fetch order details.');
      }
    };

    if (orderId) {
      fetchOrder();
      const interval = setInterval(fetchOrder, 10000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  useEffect(() => {
    if (!isTracking || !deliveryBoyId) return;

    const fetchLocationFromRedis = async () => {
      try {
        const newLocation = await deliveryBoyApi.getLiveLocation(dispatch, deliveryBoyId);
        if (isValidCoordinates(newLocation)) {
          debouncedSetCurrentLocation(newLocation);
        } else {
          console.error('Invalid coordinates from Redis:', newLocation);
          toast.error('Invalid location data from server');
        }
      } catch (error) {
        console.error('Error fetching location from Redis:', error);
        // toast.error('Failed to fetch live location');
      }
    };

    fetchLocationFromRedis();
    const interval = setInterval(fetchLocationFromRedis, 30000);

    return () => clearInterval(interval);
  }, [isTracking, deliveryBoyId, debouncedSetCurrentLocation]);

  useEffect(() => {
    if (isTracking && navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      };

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          if (isValidCoordinates(newLocation)) {
            debouncedSetCurrentLocation(newLocation);

            if (socket && isConnected) {
              socket.emit('delivery-location-update', {
                orderId,
                deliveryBoyId,
                location: newLocation,
              });
            }
          } else {
            console.error('Invalid geolocation coordinates:', newLocation);
            toast.error('Invalid current location');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to get current location');
        },
        options
      );
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isTracking, socket, isConnected, orderId, deliveryBoyId, debouncedSetCurrentLocation]);

  useEffect(() => {
    if (currentLocation && currentDestination && isValidCoordinates(currentLocation) && isValidCoordinates(currentDestination)) {
      const distanceToDestination = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        currentDestination.latitude,
        currentDestination.longitude
      );
      setDistance(distanceToDestination);
      setHasArrived(distanceToDestination <= 10000);
    } else {
      console.error('Invalid coordinates for distance calculation:', { currentLocation, currentDestination });
      toast.error('Invalid coordinates for distance calculation');
    }
  }, [currentLocation, currentDestination]);

  useEffect(() => {
    if (!mapRef.current || !isValidCoordinates(currentLocation) || !isValidCoordinates(currentDestination)) return;

    if (routingControlRef.current) {
      mapRef.current.removeControl(routingControlRef.current);
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [
        L.latLng(currentLocation.latitude, currentLocation.longitude),
        L.latLng(currentDestination.latitude, currentDestination.longitude),
      ],
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
      }),
      lineOptions: {
        styles: [{ color: '#3B82F6', weight: 4 }],
        extendToWaypoints: true,
        missingRouteTolerance: 100,
      },
      show: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current && routingControlRef.current) {
        mapRef.current.removeControl(routingControlRef.current);
      }
    };
  }, [currentLocation, currentDestination]);

  useEffect(() => {
    localStorage.setItem('deliveryMapPageState', JSON.stringify({ orderId }));
  }, [orderId]);

  useEffect(() => {
    setIsTracking(true);
    return () => setIsTracking(false);
  }, []);

  console.log('distance :', distance);
  console.log('totalDistance:', totalDistance);
  console.log('Payment method :', order?.paymentMethod);

  useEffect(() => {
    if (deliveryStep === 'completed') {
      setShowEarningsPopup(true);
    }
  }, [deliveryStep]);

  const handleArrived = () => {
    if (!socket || !isConnected) {
      toast.error('No socket connection');
      return;
    }
    if (deliveryStep === 'going_to_restaurant') {
      setTotalDistance(distance);
      setDeliveryStep('confirm_order');
      toast.success('Arrived at restaurant');
    } else if (deliveryStep === 'going_to_customer') {
      toast.success('Arrived at customer location');
    }
  };

  const handleConfirmOrder = () => {
    setShowPinVerification(true);
    setDeliveryStep('verify_pin');
  };

  const handlePinChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newPin = [...pinInput];
      newPin[index] = value;
      setPinInput(newPin);
      if (value && index < 5) {
        pinInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePinVerified = async () => {
    const enteredPin = pinInput.join('');
    try {
      const response = await deliveryBoyApi.verifyOrderPin(dispatch, orderId, enteredPin);

      if (response.userId) {
        try {
          const userData = await deliveryBoyApi.getUserDetails(dispatch, response.userId);
          const formattedUserDetails: UserDetails = {
            name: userData.name || 'Unknown Customer',
            phone: userData.phone || '',
            address: userData.address[0]
              ? `${userData.address[0].street}, ${userData.address[0].city}, ${userData.address[0].state}, ${userData.address[0].pinCode}`
              : 'No address available',
          };
          setUserDetails(formattedUserDetails);
        } catch (error) {
          console.error('Error fetching user details:', error);
          toast.error('Failed to fetch user details');
        }
      }

      toast.success('PIN verified successfully');
      setShowPinVerification(false);
      setDeliveryStep('going_to_customer');
      setPinInput(['', '', '', '', '', '']);

      if (response.location) {
        const newDestination = response.location;
        if (isValidCoordinates(newDestination)) {
          setCurrentDestination(newDestination);
          if (socket && isConnected) {
            socket.emit('delivery-location-update', {
              orderId,
              deliveryBoyId,
              location: response.location,
            });
          }
        } else {
          console.error('Invalid customer coordinates:', newDestination);
          toast.error('Invalid customer location data');
        }
      } else {
        console.error('Customer location not provided in response');
        toast.error('Customer location not available');
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      toast.error('Failed to verify PIN');
    }
  };


  const handleCompleteDelivery = async () => {
    if (!socket || !isConnected) {
      toast.error('No socket connection');
      return;
    }

    try {

      const finalTotalDistance = totalDistance + distance;
      const paymentMethod = order?.paymentMethod;
      const orderAmount = order?.totalAmount
      const res = await deliveryBoyApi.orderEarnings(dispatch, paymentMethod, deliveryBoyId, finalTotalDistance, orderAmount);
      console.log('map side loggg :', res);
      setEarnings(res.data.earnings.today);
      await deliveryBoyApi.completeOrder(dispatch, orderId, deliveryBoyId,);

      dispatch(completeDelivery());
      dispatch(toggleDeliveryRefresh());
      setDeliveryStep('completed');
      localStorage.removeItem('deliveryMapPageState');
      setTotalDistance(0);
      toast.success('Delivery completed successfully!');
      // navigate('/deliveryBoy-Home');
    } catch (error) {
      console.error('Error completing delivery:', error);
      toast.error((error as Error).message || 'Failed to complete delivery');
    }
  };

  const handleCallCustomer = () => {
    if (userDetails?.phone) {
      window.open(`tel:${userDetails.phone}`);
    } else {
      toast.error('Customer phone number not available');
    }
  };

  const handleCallRestaurant = () => {
    const phone = order?.items[0]?.restaurantPhone || order?.deliveryBoy?.mobile;
    if (phone) {
      window.open(`tel:${phone}`);
    } else {
      toast.error('Restaurant phone number not available');
    }
  };

  const getStatusColor = () => {
    if (hasArrived) return 'text-green-600';
    if (distance < 500) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getStatusText = () => {
    if (hasArrived) return 'Arrived';
    if (distance < 500) return 'Nearby';
    return 'En Route';
  };

  if (!isValidCoordinates(currentLocation) || !isValidCoordinates(currentDestination)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 shadow-md">
          <p className="text-orange-600">Invalid or missing location data. Please try again.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {!showEarningsPopup && (
        <>
          <div className="p-4 bg-white border-b border-orange-100 flex justify-between items-center shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-600 rounded-full animate-ping opacity-50"></div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-orange-600">Live Delivery Tracking</h2>
                <p className="text-sm text-gray-600">
                  {deliveryStep === 'going_to_restaurant' || deliveryStep === 'confirm_order' || deliveryStep === 'verify_pin'
                    ? 'Heading to Restaurant'
                    : 'Delivering to Customer'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('deliveryMapPageState');
                navigate('/');
              }}
              className="text-gray-600 hover:text-orange-600 text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-50 transition-all"
            >
              ×
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row">
            <div className="flex-1 relative">
              <MapContainer
                ref={mapRef}
                style={containerStyle}
                center={[currentLocation.latitude, currentLocation.longitude]}
                zoom={16}
                scrollWheelZoom={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[currentLocation.latitude, currentLocation.longitude]} icon={deliveryBoyIcon}>
                  <Popup>Your Location</Popup>
                </Marker>
                <Marker position={[currentDestination.latitude, currentDestination.longitude]} icon={destinationIcon}>
                  <Popup>
                    {deliveryStep === 'going_to_restaurant' || deliveryStep === 'confirm_order' || deliveryStep === 'verify_pin'
                      ? 'Restaurant'
                      : 'Customer Location'}
                  </Popup>
                </Marker>
              </MapContainer>

              <div className="absolute top-4 left-4">
                <div className="bg-white px-3 py-1.5 rounded-md shadow-md border border-orange-100">
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                    <span>Updated {Math.round((Date.now() - lastLocationUpdate.getTime()) / 1000)}s ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-80 p-4 bg-white border-l border-orange-100 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-orange-50 p-3 rounded-md text-center border border-orange-100">
                  <p className="text-xs text-gray-600 uppercase">Distance</p>
                  <p className="text-lg font-semibold text-orange-600">{formatDistance(distance)}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-md text-center border border-orange-100">
                  <p className="text-xs text-gray-600 uppercase">ETA</p>
                  <p className="text-lg font-semibold text-orange-600">{formatDuration(distance)}</p>
                </div>
                <div className="bg-orange-50 p-3 rounded-md text-center border border-orange-100 col-span-2">
                  <p className="text-xs text-gray-600 uppercase">Status</p>
                  <p className={`text-sm font-semibold ${getStatusColor()}`}>{getStatusText()}</p>
                </div>
              </div>

              <div className="border border-orange-100 rounded-md p-3">
                <p className="text-sm text-gray-600">Order #{orderId.slice(-6)}</p>
                <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-600' : 'bg-red-600'} animate-pulse`}
                  ></div>
                  <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>

              <div className="border border-orange-100 rounded-md p-3">
                <h3 className="text-sm font-semibold text-orange-600">
                  {deliveryStep === 'going_to_restaurant' || deliveryStep === 'confirm_order' || deliveryStep === 'verify_pin'
                    ? order?.items[0]?.restaurantName || 'Unknown Restaurant'
                    : userDetails?.name || 'Unknown Customer'}
                </h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {deliveryStep === 'going_to_restaurant' || deliveryStep === 'confirm_order' || deliveryStep === 'verify_pin'
                    ? order?.deliveryAddress || 'No address available'
                    : userDetails?.address || 'No address available'}
                </p>
              </div>

              {deliveryStep === 'confirm_order' && (
                <div className="border border-orange-100 rounded-md p-3">
                  <h3 className="text-sm font-semibold text-orange-600 mb-2">Confirm Order Items</h3>
                  {order?.items?.length ? (
                    <ul className="text-sm text-gray-600 mb-3">
                      {order.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600 mb-3">No items available</p>
                  )}
                  <button
                    onClick={handleConfirmOrder}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-all text-sm"
                  >
                    Confirm Order
                  </button>
                </div>
              )}

              {showPinVerification && deliveryStep === 'verify_pin' && (
                <div className="border border-orange-100 rounded-md p-3">
                  <h3 className="text-sm font-semibold text-orange-600 mb-2">Enter 6-Digit PIN</h3>
                  <div className="flex justify-between mb-3">
                    {pinInput.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handlePinChange(index, e.target.value)}
                        ref={(el: any) => (pinInputRefs.current[index] = el)}
                        className="w-10 h-10 text-center border border-gray-300 rounded-md focus:border-orange-600 focus:outline-none"
                      />
                    ))}
                  </div>
                  <button
                    onClick={handlePinVerified}
                    disabled={pinInput.some((digit) => !digit)}
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-all text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Verify PIN
                  </button>
                </div>
              )}

              {hasArrived && deliveryStep !== 'confirm_order' && deliveryStep !== 'verify_pin' && (
                <div className="space-y-2">
                  {deliveryStep === 'going_to_restaurant' && (
                    <>
                      {(order?.items[0]?.restaurantPhone || order?.deliveryBoy?.mobile) && (
                        <button
                          onClick={handleCallRestaurant}
                          className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-all text-sm"
                        >
                          Call Restaurant
                        </button>
                      )}
                      <button
                        onClick={handleArrived}
                        className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-all text-sm"
                      >
                        Reached Restaurant
                      </button>
                    </>
                  )}
                  {deliveryStep === 'going_to_customer' && (
                    <>
                      {userDetails?.phone && (
                        <button
                          onClick={handleCallCustomer}
                          className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-all text-sm"
                        >
                          Call Customer
                        </button>
                      )}
                      <button
                        onClick={handleCompleteDelivery}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-all text-sm"
                      >
                        Complete Delivery
                      </button>
                    </>
                  )}
                </div>
              )}
              {!hasArrived && (
                <div className="space-y-2">
                  {deliveryStep === 'going_to_restaurant' && (order?.items[0]?.restaurantPhone || order?.deliveryBoy?.mobile) && (
                    <button
                      onClick={handleCallRestaurant}
                      className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-all text-sm"
                    >
                      Call Restaurant
                    </button>
                  )}
                  {deliveryStep === 'going_to_customer' && userDetails?.phone && (
                    <button
                      onClick={handleCallCustomer}
                      className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-all text-sm"
                    >
                      Call Customer
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {/* </div> */}
      <EarningsPopup
        isOpen={showEarningsPopup}
        onClose={() => {
          setShowEarningsPopup(false);
          navigate('/deliveryBoy-Home');
        }}
        earnings={earnings}
        orderDetails={{
          orderId: order?.orderId || '#FD12345',
          customerName: userDetails?.name || 'Unknown Customer',
          deliveryTime: formatDuration(totalDistance + distance),
        }}
      />
    </div >
  );
};

export default DeliveryMapPage;