import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import createAxios from '../service/axious-services/restaurantAxious';
import Swal from 'sweetalert2';

const useRestaurantStatus = () => {
  const [isOnline, setIsOnline] = useState(false);
  const dispatch = useDispatch();
  const restaurant_id = useSelector(
    (store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id
  );
  const axiosInstance = createAxios(dispatch);

  useEffect(() => {
    const fetchOnlineStatus = async () => {
      try {
        const response = await axiosInstance.get(`/get-online-status/${restaurant_id}`);
        setIsOnline(response.data.isOnline);

        const token = localStorage.getItem('restaurantToken');
        if (token && !response.data.isOnline) {
          Swal.fire({
            title: 'Welcome Back!',
            text: 'Please turn on your online status to start receiving orders.',
            icon: 'info',
            confirmButtonText: 'OK',
            confirmButtonColor: '#6589f6',
          });
        }
      } catch (error: any) {
        console.error('Error fetching online status:', error.message);
      }
    };

    fetchOnlineStatus();
  }, [restaurant_id]);

  const handleToggleOnline = async () => {
    try {
      const response = await axiosInstance.patch('/update-online-status', {
        restaurant_id,
        isOnline: !isOnline,
      });

      if (response.data.message === 'Online status updated successfully') {
        setIsOnline(!isOnline);
        Swal.fire({
          title: `Status Updated`,
          text: `Your restaurant is now ${!isOnline ? 'Online' : 'Offline'}.`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#6589f6',
        });
      }
    } catch (error: any) {
      console.error('Error updating online status:', error.message);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while updating online status.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
      });
    }
  };

  const handleBeforeLogout = async () => {
    if (isOnline) {
      await Swal.fire({
        title: 'Reminder!',
        text: 'Please turn off your online status before logging out.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
      });
    }
  };

  return { isOnline, handleToggleOnline, handleBeforeLogout };
};

export default useRestaurantStatus;
