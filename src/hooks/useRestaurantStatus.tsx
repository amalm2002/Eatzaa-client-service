import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import createAxios from '../service/axiousServices/restaurantAxious';
import Swal from 'sweetalert2';

const useRestaurantStatus = () => {
  const [isOnline, setIsOnline] = useState(false);
  const dispatch = useDispatch();
  const restaurant_id = useSelector((store: { restaurantAuth: { restaurant_id: string } }) => store.restaurantAuth.restaurant_id);
  const axiousInstance = createAxios();

  useEffect(() => {
    const token = localStorage.getItem('restaurantToken');
    if (token) {
      Swal.fire({
        title: 'Welcome Back!',
        text: 'Please turn on your online status to start receiving orders.',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#6589f6',
      });
      setIsOnline(false); 
    }
  }, []);

  const handleToggleOnline = async () => {
    const token = localStorage.getItem('restaurantToken');
    try {
      const response = await axiousInstance.patch('/update-online-status', {
        restaurant_id,
        isOnline: !isOnline
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

  return { isOnline, handleToggleOnline };
};

export default useRestaurantStatus;