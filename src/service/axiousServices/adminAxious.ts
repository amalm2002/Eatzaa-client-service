/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { adminLogout } from '../redux/slices/adminSlice';

export const createAxios = (dispatch: any) => {
  const axiosAdminInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_GATEWAY_URL}/admin`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosAdminInstance.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem('adminToken'); 
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => Promise.reject(error)
  );

  axiosAdminInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      console.error('Response error:', error.response?.data || error.message); 
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        try {
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem('adminRefreshToken');
          if (!refreshToken) {
            localStorage.removeItem('adminToken');
            dispatch(adminLogout());
            window.location.href = '/login';
            return Promise.reject(error);
          }

          const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/refresh`, { token: refreshToken });
          
          const newAccessToken = response.data.token;
          const newRefreshToken = response.data.refreshToken;

          localStorage.setItem('adminToken', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('adminRefreshToken', newRefreshToken);
          }

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          axiosAdminInstance.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosAdminInstance(originalRequest);
        } catch (refreshError) {
          console.error('Refresh token error:', refreshError);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminRefreshToken');
          dispatch(adminLogout());
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosAdminInstance;
};