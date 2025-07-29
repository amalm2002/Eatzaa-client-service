// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { RootState, AppDispatch } from '../../service/redux/store';
// import { hideNotification, showNotification } from '../../service/redux/slices/notificationSlice';
// import { toast } from 'sonner';
// import { useSocket } from '../../context/SocketContext';
// import createAxios from '../../service/axious-services/restaurantAxious';
// import deliveryBoyCreateAxios from '../../service/axious-services/deliveryBoyAxious';
// import MapModal from '../../pages/delivery-boy/locationMap/mapModal';

// interface NotificationState {
//   isOpen: boolean;
//   type: string;
//   message: string;
//   navigate?: string;
//   data?: {
//     orderId?: string;
//     restaurantId?: string;
//     restaurantDetails?: {
//       restaurantName: string;
//       location?: { latitude: number; longitude: number };
//       email: string;
//       mobile: string;
//     };
//     deliveryBoys?: Array<{
//       _id: string;
//       name: string;
//       mobile: string;
//       location: { latitude: number; longitude: number };
//       rating: number;
//     }>;
//   } | null;
// }

// const NotificationPopup: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();
//   const { socket, isConnected } = useSocket();
//   const { isOpen, type, message, navigate: navigateTo, data } = useSelector(
//     (state: RootState) => state.notification
//   );
//   const deliveryBoyId = useSelector((state: RootState) => state.deliveryBoyAuth.delivery_boy_id);
//   const axiosInstance = createAxios(dispatch);
//   const deliveryBoyAxious = deliveryBoyCreateAxios(dispatch);

//   const [timeLeft, setTimeLeft] = useState(30);
//   const [isMapOpen, setIsMapOpen] = useState(false);
//   const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<{ latitude: number; longitude: number } | null>(null);
//   const [isLoadingLocation, setIsLoadingLocation] = useState(false);
//   const [restaurantLocation, setRestaurantLocation] = useState<{ latitude: number; longitude: number } | null>(null);
//   const [isLoadingRestaurantLocation, setIsLoadingRestaurantLocation] = useState(false);


//   useEffect(() => {
//     const fetchLocation = async () => {
//       setIsLoadingLocation(true);
//       try {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             setDeliveryBoyLocation({
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//             });
//             setIsLoadingLocation(false);
//           },
//           async (error) => {
//             console.error('Error getting current location:', error);

//             if (deliveryBoyId) {
//               try {
//                 const response = await deliveryBoyAxious.get(`/get-live-location/${deliveryBoyId}`);
//                 if (response.data.success && response.data.location) {
//                   setDeliveryBoyLocation(response.data.location);
//                 } else {
//                   toast.error('No previous location found');
//                 }
//               } catch (redisError) {
//                 console.error('Error fetching location from Redis:', redisError);
//                 toast.error('Failed to fetch location from server');
//               }
//             }
//             setIsLoadingLocation(false);
//           },
//           { enableHighAccuracy: true, timeout: 10000 }
//         );
//       } catch (error) {
//         console.error('Error in fetchLocation:', error);
//         setIsLoadingLocation(false);
//       }
//     };

//     fetchLocation();
//   }, [deliveryBoyId]);



//   useEffect(() => {
//     const fetchRestaurantLocation = async () => {
//       if (data?.restaurantId && !data?.restaurantDetails?.location && !isLoadingRestaurantLocation) {
//         setIsLoadingRestaurantLocation(true);
//         try {
//           const response = await axiosInstance.get(`/get-location/${data.restaurantId}`);
//           if (response.data.success && response.data.restaurant?.location) {
//             setRestaurantLocation(response.data.restaurant.location);
//           } else {
//             toast.error('Failed to fetch restaurant location');
//           }
//         } catch (error) {
//           console.error('Error fetching restaurant location:', error);
//           toast.error('Failed to fetch restaurant location');
//         } finally {
//           setIsLoadingRestaurantLocation(false);
//         }
//       } else if (data?.restaurantDetails?.location) {
//         setRestaurantLocation(data.restaurantDetails.location);
//       }
//     };

//     fetchRestaurantLocation();
//   }, [data?.restaurantId, data?.restaurantDetails?.location]);


//   useEffect(() => {
//     let interval: NodeJS.Timeout | null = null;

//     if (isMapOpen && deliveryBoyId && deliveryBoyLocation) {
//       const updateLocation = async () => {
//         try {
//           navigator.geolocation.getCurrentPosition(
//             async (position) => {
//               const { latitude, longitude } = position.coords;
//               setDeliveryBoyLocation({ latitude, longitude });

//               const response = await deliveryBoyAxious.post('/update-delivery-boy-location', {
//                 deliveryBoyId,
//                 latitude,
//                 longitude,
//               });

//               if (!response.data.success) {
//                 console.error('Failed to update location in Redis:', response.data.message);
//                 // toast.error('Failed to update live location');
//               }
//             },
//             (error) => {
//               console.error('Error getting current location:', error);
//               toast.error('Failed to get current location');
//             },
//             { enableHighAccuracy: true }
//           );
//         } catch (error) {
//           console.error('Error updating location:', error);
//           toast.error('Failed to update live location');
//         }
//       };

//       updateLocation();
//       interval = setInterval(updateLocation, 30000);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [isMapOpen, deliveryBoyId, deliveryBoyLocation]);

//   useEffect(() => {
//     if (isOpen && type === 'delivery-order-notification' && !isMapOpen) {
//       setTimeLeft(30);
//       const timer = setTimeout(() => {
//         dispatch(hideNotification({ preserveData: false }));
//         if (navigateTo) {
//           navigate(navigateTo);
//         }
//       }, 30000);
//       return () => clearTimeout(timer);
//     }
//   }, [isOpen, type, navigateTo, dispatch, navigate, isMapOpen]);


//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (type === 'delivery-order-notification' && isOpen && timeLeft > 0 && !isMapOpen) {
//       interval = setInterval(() => {
//         setTimeLeft((prev) => prev - 1);
//       }, 1000);
//     }
//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [type, isOpen, timeLeft, isMapOpen]);



//   const handleAcceptOrder = async () => {
//     try {
//       if (!socket || !isConnected) {
//         toast.error('Cannot accept order: No socket connection');
//         return;
//       }
//       if (!data?.orderId || !data?.restaurantId) {
//         toast.error('Cannot accept order: Missing order details');
//         return;
//       }

//       const response = await axiosInstance.get(`/get-location/${data?.restaurantId}`);
//       if (!response.data.success || !response.data.deliveryBoys || !response.data.restaurant) {
//         toast.error('Failed to fetch delivery boys or restaurant details.');
//         return;
//       }
//       socket.emit('order-accepted', {
//         orderId: data.orderId,
//         restaurantId: data.restaurantId,
//         deliveryBoys: response.data.deliveryBoys,
//         restaurantDetails: response.data.restaurant,
//       });

//       dispatch(
//         showNotification({
//           type: 'restaurant-accept',
//           message: `Order ${data.orderId} accepted and is now being prepared.`,
//           navigate: '/order-list-page',
//         })
//       );

//       dispatch(hideNotification({ preserveData: true }));
//       toast.success('Order accepted successfully!');
//     } catch (error) {
//       console.error('Error accepting order:', error);
//       toast.error('Failed to accept order. Please try again.');
//     }
//   };

//   const handleReadyToPick = async () => {
//     if (!socket || !isConnected) {
//       toast.error('Cannot accept order: No socket connection');
//       return;
//     }
//     if (!data?.orderId || !deliveryBoyId) {
//       toast.error('Missing order details or delivery boy ID');
//       return;
//     }
//     if (!deliveryBoyLocation) {
//       toast.error('Current location not available. Please enable location services.');
//       return;
//     }
//     if (!restaurantLocation) {
//       toast.error('Restaurant location not available. Please try again.');
//       return;
//     }

//     try {
//       const assignResponse = await deliveryBoyAxious.post('/assign-delivery-boy', {
//         orderId: data.orderId,
//         deliveryBoyId,
//       });

//       if (!assignResponse.data.success) {
//         toast.error(assignResponse.data.message || 'Failed to assign order');
//         return;
//       }

//       const { latitude, longitude } = deliveryBoyLocation;
//       const locationResponse = await deliveryBoyAxious.post('/update-delivery-boy-location', {
//         deliveryBoyId,
//         latitude,
//         longitude,
//       });

//       if (!locationResponse.data.success) {
//         toast.error(locationResponse.data.message || 'Failed to update location');
//         return;
//       }

//       setIsMapOpen(true);
//       socket.emit('accept-delivery-order', {
//         orderId: data.orderId,
//         deliveryBoyId,
//       });

//       toast.success('Order accepted and location updated!');
//     } catch (error) {
//       console.error('Error in handleReadyToPick:', error);
//       toast.error('Failed to accept order. Please try again.');
//     }
//   };

//   const handleCancel = () => {
//     if (!socket || !isConnected) {
//       toast.error('Cannot cancel order: No socket connection');
//       return;
//     }
//     if (!data?.orderId || !deliveryBoyId) {
//       toast.error('Missing order details or delivery boy ID');
//       return;
//     }

//     socket.emit('cancel-delivery-order', {
//       orderId: data.orderId,
//       deliveryBoyId,
//     });

//     dispatch(hideNotification({ preserveData: false }));
//     toast.info('Order notification canceled.');
//   };

//   const handleClose = () => {
//     dispatch(hideNotification({ preserveData: true }));
//   };

//   const handleMapClose = () => {
//     setIsMapOpen(false);
//   };

//   if (!isOpen) return null;

//   // console.log('==================================================================');
//   // console.log(isMapOpen, deliveryBoyLocation, restaurantLocation, data?.orderId);
//   // console.log('==================================================================');

//   if (type === 'delivery-order-notification') {
//     return (
//       <>
//         {isMapOpen && deliveryBoyLocation && restaurantLocation && data?.orderId ? (
//           <MapModal
//             isOpen={isMapOpen}
//             onClose={handleMapClose}
//             origin={deliveryBoyLocation}
//             destination={restaurantLocation}
//             orderId={data.orderId}
//             deliveryBoyId={deliveryBoyId}
//           />
//         ) : isMapOpen ? (
//           <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
//             <div className="bg-white rounded-lg p-6">
//               <p className="text-orange-600">
//                 {isLoadingLocation || isLoadingRestaurantLocation ? 'Loading location data...' : 'Location data unavailable'}
//               </p>
//             </div>
//           </div>
//         ) : null}

//         <div className="fixed inset-0 bg-white/10 bg-opacity-30 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border-2 border-orange-600 animate-fadeIn">
//             <div className="bg-orange-100 border-b border-orange-600 px-6 py-4 text-orange-600 relative">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
//                     <span className="text-2xl">🚚</span>
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-bold">New Delivery Request</h2>
//                     <p className="text-sm font-medium">Order ready for pickup</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={handleClose}
//                   className="text-orange-600 hover:text-orange-800 text-xl font-semibold"
//                 >
//                   ×
//                 </button>
//               </div>
//               <div className="mt-4">
//                 <div className="flex items-center justify-between text-sm mb-2">
//                   <span>Auto-decline in:</span>
//                   <span className="font-bold animate-pulseTimer">{timeLeft}s</span>
//                 </div>
//                 <div className="w-full bg-orange-200 rounded-full h-2">
//                   <div
//                     className="bg-orange-600 h-2 rounded-full transition-all duration-1000 ease-linear"
//                     style={{ width: `${(timeLeft / 30) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>
//             </div>
//             <div className="p-6">
//               {data?.restaurantDetails && (
//                 <>
//                   <div className="bg-orange-100 rounded-xl p-4 mb-4">
//                     <div className="flex items-center space-x-3 mb-3">
//                       <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
//                         <span className="text-2xl">🏪</span>
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="font-bold text-orange-600 text-lg">
//                           {data.restaurantDetails.restaurantName}
//                         </h3>
//                         <p className="text-gray-600 text-sm">Restaurant Partner</p>
//                       </div>
//                     </div>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex items-center space-x-2">
//                         <span className="text-orange-600">📍</span>
//                         <span className="text-gray-700">
//                           Lat: {data.restaurantDetails.location.latitude.toFixed(4)},
//                           Lng: {data.restaurantDetails.location.longitude.toFixed(4)}
//                         </span>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <span className="text-orange-600">📞</span>
//                         <span className="text-gray-700">{data.restaurantDetails.mobile}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="bg-white rounded-xl p-4 mb-6 border border-orange-600">
//                     <div className="flex items-center space-x-2 mb-2">
//                       <span className="text-orange-600">🆔</span>
//                       <span className="font-semibold text-orange-600">Order ID</span>
//                     </div>
//                     <p className="text-orange-600 font-mono text-lg">{data.orderId}</p>
//                   </div>
//                 </>
//               )}
//               <div className="flex space-x-3">
//                 <button
//                   onClick={handleCancel}
//                   className="flex-1 bg-white border border-orange-600 hover:bg-orange-50 text-orange-600 font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
//                 >
//                   <span>❌</span>
//                   <span>Decline</span>
//                 </button>
//                 <button
//                   onClick={handleReadyToPick}
//                   className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg"
//                 >
//                   <span>✅</span>
//                   <span>Accept</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   if (type === 'order-created') {
//     return (
//       <>
//         <div className="fixed inset-0 bg-white/10 bg-opacity-30 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border-2 border-[#6589f6] animate-fadeIn">
//             <div className="bg-white border-b border-[#6589f6] px-6 py-4 text-[#6589f6]">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
//                     <span className="text-2xl">🛒</span>
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-extrabold">New Order Alert!</h2>
//                     <p className="text-sm font-medium">Customer order received</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={handleClose}
//                   className="text-[#6589f6] hover:text-[#4b6ed5] text-xl font-semibold"
//                 >
//                   ×
//                 </button>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="bg-gray-50 rounded-xl p-4 mb-6">
//                 <div className="flex items-center space-x-2 mb-2">
//                   <span className="text-[#6589f6]">🆔</span>
//                   <span className="font-semibold text-[#6589f6]">Order Details</span>
//                 </div>
//                 <p className="text-[#6589f6] font-mono text-lg">{data?.orderId}</p>
//                 <p className="text-gray-600 text-sm mt-2 font-medium">{message}</p>
//               </div>
//               <button
//                 onClick={handleAcceptOrder}
//                 className="w-full bg-[#6589f6] hover:bg-[#4b6ed5] text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg"
//               >
//                 <span>✅</span>
//                 <span>Accept & Start Preparing</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   const typeStyles = {
//     info: 'bg-blue-500 border-blue-600',
//     error: 'bg-red-500 border-red-600',
//     'user-block': 'bg-yellow-500 border-yellow-600',
//     'admin-blocked': 'bg-red-600 border-red-700',
//     'restaurant-accept': 'bg-[#6589f6] border-[#6589f6]',
//     'delivery-boy-accept': 'bg-orange-600 border-orange-600',
//   };

//   return (
//     <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-slideIn">
//       <div
//         className={`relative p-4 rounded-lg shadow-lg border-l-4 text-white ${typeStyles[type as keyof typeof typeStyles] || typeStyles.info}`}
//       >
//         <button
//           className="absolute top-2 right-2 text-white hover:text-gray-200"
//           onClick={handleClose}
//         >
//           ✕
//         </button>
//         <div className="flex items-start">
//           <div className="mr-3">
//             {type === 'info' && <span className="text-2xl">ℹ️</span>}
//             {type === 'error' && <span className="text-2xl">❌</span>}
//             {type === 'user-block' && <span className="text-2xl">🚫</span>}
//             {type === 'admin-blocked' && <span className="text-2xl">🔒</span>}
//             {type === 'restaurant-accept' && <span className="text-2xl">✅</span>}
//             {type === 'delivery-boy-accept' && <span className="text-2xl">🚚</span>}
//           </div>
//           <div>
//             <h3 className="font-semibold capitalize">{type.replace('-', ' ')}</h3>
//             <p className="text-sm">{message}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotificationPopup;



import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../service/redux/store';
import { hideNotification, showNotification } from '../../service/redux/slices/notificationSlice';
import { toast } from 'sonner';
import { useSocket } from '../../context/SocketContext';
import createAxios from '../../service/axious-services/restaurantAxious';
import deliveryBoyCreateAxios from '../../service/axious-services/deliveryBoyAxious';

interface NotificationState {
  isOpen: boolean;
  type: string;
  message: string;
  navigate?: string;
  data?: {
    orderId?: string;
    restaurantId?: string;
    restaurantDetails?: {
      restaurantName: string;
      location?: { latitude: number; longitude: number };
      email: string;
      mobile: string;
    };
    deliveryBoys?: Array<{
      _id: string;
      name: string;
      mobile: string;
      location: { latitude: number; longitude: number };
      rating: number;
    }>;
  } | null;
}

const NotificationPopup: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const { isOpen, type, message, navigate: navigateTo, data } = useSelector(
    (state: RootState) => state.notification
  );
  const deliveryBoyId = useSelector((state: RootState) => state.deliveryBoyAuth.delivery_boy_id);
  const axiosInstance = createAxios(dispatch);
  const deliveryBoyAxious = deliveryBoyCreateAxios(dispatch);

  const [timeLeft, setTimeLeft] = useState(30);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [restaurantLocation, setRestaurantLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoadingRestaurantLocation, setIsLoadingRestaurantLocation] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoadingLocation(true);
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setDeliveryBoyLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            setIsLoadingLocation(false);
          },
          async (error) => {
            console.error('Error getting current location:', error);

            // if (deliveryBoyId) {
            //   try {
            //     const response = await deliveryBoyAxious.get(`/get-live-location/${deliveryBoyId}`);
            //     if (response.data.success && response.data.location) {
            //       setDeliveryBoyLocation(response.data.location);
            //     } else {
            //       toast.error('No previous location found');
            //     }
            //   } catch (redisError) {
            //     console.error('Error fetching location from Redis:', redisError);
            //     // toast.error('Failed to fetch location from server');
            //   }
            // }
            setIsLoadingLocation(false);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } catch (error) {
        console.error('Error in fetchLocation:', error);
        setIsLoadingLocation(false);
      }
    };

    fetchLocation();
  }, [deliveryBoyId]);

  useEffect(() => {
    const fetchRestaurantLocation = async () => {
      if (data?.restaurantId && !data?.restaurantDetails?.location && !isLoadingRestaurantLocation) {
        setIsLoadingRestaurantLocation(true);
        try {
          const response = await axiosInstance.get(`/get-location/${data.restaurantId}`);
          if (response.data.success && response.data.restaurant?.location) {
            setRestaurantLocation(response.data.restaurant.location);
          } else {
            toast.error('Failed to fetch restaurant location');
          }
        } catch (error) {
          console.error('Error fetching restaurant location:', error);
          toast.error('Failed to fetch restaurant location');
        } finally {
          setIsLoadingRestaurantLocation(false);
        }
      } else if (data?.restaurantDetails?.location) {
        setRestaurantLocation(data.restaurantDetails.location);
      }
    };

    fetchRestaurantLocation();
  }, [data?.restaurantId, data?.restaurantDetails?.location]);

  useEffect(() => {
    if (isOpen && type === 'delivery-order-notification') {
      setTimeLeft(30);
      const timer = setTimeout(() => {
        dispatch(hideNotification({ preserveData: false }));
        if (navigateTo) {
          navigate(navigateTo);
        }
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, type, navigateTo, dispatch, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (type === 'delivery-order-notification' && isOpen && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [type, isOpen, timeLeft]);

  const handleAcceptOrder = async () => {
    try {
      if (!socket || !isConnected) {
        toast.error('Cannot accept order: No socket connection');
        return;
      }
      if (!data?.orderId || !data?.restaurantId) {
        toast.error('Cannot accept order: Missing order details');
        return;
      }

      const response = await axiosInstance.get(`/get-location/${data?.restaurantId}`);
      if (!response.data.success || !response.data.deliveryBoys || !response.data.restaurant) {
        toast.error('Failed to fetch delivery boys or restaurant details.');
        return;
      }
      socket.emit('order-accepted', {
        orderId: data.orderId,
        restaurantId: data.restaurantId,
        deliveryBoys: response.data.deliveryBoys,
        restaurantDetails: response.data.restaurant,
      });

      dispatch(
        showNotification({
          type: 'restaurant-accept',
          message: `Order ${data.orderId} accepted and is now being prepared.`,
          navigate: '/order-list-page',
        })
      );

      dispatch(hideNotification({ preserveData: true }));
      toast.success('Order accepted successfully!');
    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error('Failed to accept order. Please try again.');
    }
  };

  const handleReadyToPick = async () => {
    if (!socket || !isConnected) {
      toast.error('Cannot accept order: No socket connection');
      return;
    }
    if (!data?.orderId || !deliveryBoyId) {
      toast.error('Missing order details or delivery boy ID');
      return;
    }
    if (!deliveryBoyLocation) {
      toast.error('Current location not available. Please enable location services.');
      return;
    }
    if (!restaurantLocation) {
      toast.error('Restaurant location not available. Please try again.');
      return;
    }

    try {
      const assignResponse = await deliveryBoyAxious.post('/assign-delivery-boy', {
        orderId: data.orderId,
        deliveryBoyId,
      });

      if (!assignResponse.data.success) {
        toast.error(assignResponse.data.message || 'Failed to assign order');
        return;
      }

      const { latitude, longitude } = deliveryBoyLocation;
      const locationResponse = await deliveryBoyAxious.post('/update-delivery-boy-location', {
        deliveryBoyId,
        latitude,
        longitude,
      });

      if (!locationResponse.data.success) {
        toast.error(locationResponse.data.message || 'Failed to update location');
        return;
      }

      socket.emit('accept-delivery-order', {
        orderId: data.orderId,
        deliveryBoyId,
      });

      toast.success('Order accepted and location updated!');
      navigate('/location-map', {
        state: {
          origin: deliveryBoyLocation,
          destination: restaurantLocation,
          orderId: data.orderId,
          deliveryBoyId,
        },
      });
      dispatch(hideNotification({ preserveData: false }));
    } catch (error) {
      console.error('Error in handleReadyToPick:', error);
      toast.error('Failed to accept order. Please try again.');
    }
  };

  const handleCancel = () => {
    if (!socket || !isConnected) {
      toast.error('Cannot cancel order: No socket connection');
      return;
    }
    if (!data?.orderId || !deliveryBoyId) {
      toast.error('Missing order details or delivery boy ID');
      return;
    }

    socket.emit('cancel-delivery-order', {
      orderId: data.orderId,
      deliveryBoyId,
    });

    dispatch(hideNotification({ preserveData: false }));
    toast.info('Order notification canceled.');
  };

  const handleClose = () => {
    dispatch(hideNotification({ preserveData: true }));
  };

  if (!isOpen) return null;

  if (type === 'delivery-order-notification') {
    return (
      <div className="fixed inset-0 bg-white/10 bg-opacity-30 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border-2 border-orange-600 animate-fadeIn">
          <div className="bg-orange-100 border-b border-orange-600 px-6 py-4 text-orange-600 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚚</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold">New Delivery Request</h2>
                  <p className="text-sm font-medium">Order ready for pickup</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-orange-600 hover:text-orange-800 text-xl font-semibold"
              >
                ×
              </button>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Auto-decline in:</span>
                <span className="font-bold animate-pulseTimer">{timeLeft}s</span>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="p-6">
            {data?.restaurantDetails && (
              <>
                <div className="bg-orange-100 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl">🏪</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-orange-600 text-lg">
                        {data.restaurantDetails.restaurantName}
                      </h3>
                      <p className="text-gray-600 text-sm">Restaurant Partner</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-600">📍</span>
                      <span className="text-gray-700">
                        Lat: {data.restaurantDetails.location.latitude.toFixed(4)},
                        Lng: {data.restaurantDetails.location.longitude.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-600">📞</span>
                      <span className="text-gray-700">{data.restaurantDetails.mobile}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 mb-6 border border-orange-600">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-orange-600">🆔</span>
                    <span className="font-semibold text-orange-600">Order ID</span>
                  </div>
                  <p className="text-orange-600 font-mono text-lg">{data.orderId}</p>
                </div>
              </>
            )}
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 bg-white border border-orange-600 hover:bg-orange-50 text-orange-600 font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>❌</span>
                <span>Decline</span>
              </button>
              <button
                onClick={handleReadyToPick}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>✅</span>
                <span>Accept</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'order-created') {
    return (
      <div className="fixed inset-0 bg-white/10 bg-opacity-30 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border-2 border-[#6589f6] animate-fadeIn">
          <div className="bg-white border-b border-[#6589f6] px-6 py-4 text-[#6589f6]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🛒</span>
                </div>
                <div>
                  <h2 className="text-lg font-extrabold">New Order Alert!</h2>
                  <p className="text-sm font-medium">Customer order received</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-[#6589f6] hover:text-[#4b6ed5] text-xl font-semibold"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-[#6589f6]">🆔</span>
                <span className="font-semibold text-[#6589f6]">Order Details</span>
              </div>
              <p className="text-[#6589f6] font-mono text-lg">{data?.orderId}</p>
              <p className="text-gray-600 text-sm mt-2 font-medium">{message}</p>
            </div>
            <button
              onClick={handleAcceptOrder}
              className="w-full bg-[#6589f6] hover:bg-[#4b6ed5] text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>✅</span>
              <span>Accept & Start Preparing</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const typeStyles = {
    info: 'bg-blue-500 border-blue-600',
    error: 'bg-red-500 border-red-600',
    'user-block': 'bg-yellow-500 border-yellow-600',
    'admin-blocked': 'bg-red-600 border-red-700',
    'restaurant-accept': 'bg-[#6589f6] border-[#6589f6]',
    'delivery-boy-accept': 'bg-orange-600 border-orange-600',
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-slideIn">
      <div
        className={`relative p-4 rounded-lg shadow-lg border-l-4 text-white ${typeStyles[type as keyof typeof typeStyles] || typeStyles.info}`}
      >
        <button
          className="absolute top-2 right-2 text-white hover:text-gray-200"
          onClick={handleClose}
        >
          ✕
        </button>
        <div className="flex items-start">
          <div className="mr-3">
            {type === 'info' && <span className="text-2xl">ℹ️</span>}
            {type === 'error' && <span className="text-2xl">❌</span>}
            {type === 'user-block' && <span className="text-2xl">🚫</span>}
            {type === 'admin-blocked' && <span className="text-2xl">🔒</span>}
            {type === 'restaurant-accept' && <span className="text-2xl">✅</span>}
            {type === 'delivery-boy-accept' && <span className="text-2xl">🚚</span>}
          </div>
          <div>
            <h3 className="font-semibold capitalize">{type.replace('-', ' ')}</h3>
            <p className="text-sm">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;