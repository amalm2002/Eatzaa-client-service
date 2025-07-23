
import axios from 'axios';
import { restaurantLogout } from '../redux/slices/restaurantSlice';
import logoutLocalStorage from '../../utils/localStorage';
import { toast } from 'sonner';

const createAxios = (dispatch: any) => {
  const axiosDeliveryBoy = axios.create({
    baseURL: `${import.meta.env.VITE_API_GATEWAY_URL}/deliveryBoy`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosDeliveryBoy.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem('deliveryBoyToken');
      console.log('delivery-boy axios inside...................', token);

      return {
        ...config,
        headers: {
          ...(token !== null && { Authorization: `Bearer ${token}` }),
          ...config.headers,
        },
      };
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  axiosDeliveryBoy.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      console.log('error on axios delivery-boy interceptor response:', error);

      const originalRequest = error.config;

      // Handle 401 - Token Refresh
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('deliveryBoyRefreshToken');
        console.log('refresh token', refreshToken);
        if (!refreshToken) {
          logoutLocalStorage('DeliveryBoy');
          dispatch(restaurantLogout());
          window.location.href = '/deliveryBoy-login';
          return Promise.reject(error);
        }
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/refresh`, { token: refreshToken });
          console.log(response, 'refresh response');

          const newAccessToken = response.data.token;
          const newRefreshToken = response.data.refreshToken;

          localStorage.setItem('deliveryBoyToken', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('deliveryBoyRefreshToken', newRefreshToken);
          }

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          axiosDeliveryBoy.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosDeliveryBoy(originalRequest);
        } catch (refreshError) {
          console.log(refreshError);
          logoutLocalStorage('DeliveryBoy');
          dispatch(restaurantLogout());
          window.location.href = '/deliveryBoy-login';
          return Promise.reject(refreshError);
        }
      }

      if (error.response?.status === 429) {
        toast.error(error.response.data?.message || "Too many requests, please slow down.");
      } else {
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        toast.error(message);
      }

      // return Promise.reject(error);
    }
  );

  return axiosDeliveryBoy;
};

export default createAxios;