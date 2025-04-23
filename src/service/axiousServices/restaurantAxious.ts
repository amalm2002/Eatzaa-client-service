// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { restaurantLogout } from "../redux/slices/restaurantSlice";
// import logoutLocalStorage from "../../utils/localStorage";

// const createAxios = () => {
//     const axiosRestaurant = axios.create({
//         baseURL: `${import.meta.env.VITE_API_GATEWAY_URL}/restaurant`,
//         headers: {
//             "Content-Type": "application/json"
//         }
//     })

//     axiosRestaurant.interceptors.request.use(
//         (config: any) => {
//             const token = localStorage.getItem('restaurantToken')
//             console.log('restaurant axious inside...................', token);

//             return {
//                 ...config,
//                 headers: {
//                     ...(token !== null && { Authorization: `Bearer ${token}` }),
//                     ...config.headers
//                 }
//             }
//         },
//         (error: any) => {
//             return Promise.reject(error)
//         }
//     )

//     axiosRestaurant.interceptors.response.use(
//         (response) => {
//             return response
//         },
//         async (error) => {
//             console.log('error on axious restaurant intercepter response :', error);

//             const originalRequest = error.config

//             if (error.response.status === 401 && !originalRequest._retry) {
//                 originalRequest._retry = true;
//                 const refreshToken = localStorage.getItem('restaurantRefreshToken');
//                 console.log("refresh token", refreshToken);
//                 if (!refreshToken) {
//                     logoutLocalStorage('Restaurant')
//                     const dispatch = useDispatch()
//                     dispatch(restaurantLogout())
//                     window.location.href = '/restaurnt/restaurant-login';
//                     return Promise.reject(error);
//                 }
//                 try {
//                     const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/refresh`, { token: refreshToken });
//                     console.log(response, "refresh responseeyyy");

//                     const newAccessToken = response.data.token;
//                     const newRefreshToken = response.data.refreshToken;

//                     localStorage.setItem('restaurantToken', newAccessToken);
//                     if (newRefreshToken) {
//                         localStorage.setItem('restaurantRefreshToken', newRefreshToken);
//                     }

//                     originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//                     axiosRestaurant.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
//                     return axiosRestaurant(originalRequest);
//                 } catch (refreshError) {
//                     console.log(refreshError)
//                     logoutLocalStorage('Restaurant')
//                     const dispatch = useDispatch()
//                     dispatch(restaurantLogout())
//                     window.location.href = '/restaurant-login';
//                     return Promise.reject(refreshError);
//                 }
//             }

//             return Promise.reject(error);
//         })

//     return axiosRestaurant
// }

// export default createAxios


import axios from 'axios';
import { restaurantLogout } from '../redux/slices/restaurantSlice';
import logoutLocalStorage from '../../utils/localStorage';

const createAxios = (dispatch: any) => {
  const axiosRestaurant = axios.create({
    baseURL: `${import.meta.env.VITE_API_GATEWAY_URL}/restaurant`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosRestaurant.interceptors.request.use(
    (config: any) => {
      const token = localStorage.getItem('restaurantToken');
      console.log('restaurant axios inside...................', token);

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

  axiosRestaurant.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      console.log('error on axios restaurant interceptor response:', error);

      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('restaurantRefreshToken');
        console.log('refresh token', refreshToken);
        if (!refreshToken) {
          logoutLocalStorage('Restaurant');
          dispatch(restaurantLogout());
          window.location.href = '/restaurant-login';
          return Promise.reject(error);
        }
        try {
          const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/refresh`, { token: refreshToken });
          console.log(response, 'refresh response');

          const newAccessToken = response.data.token;
          const newRefreshToken = response.data.refreshToken;

          localStorage.setItem('restaurantToken', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('restaurantRefreshToken', newRefreshToken);
          }

          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          axiosRestaurant.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosRestaurant(originalRequest);
        } catch (refreshError) {
          console.log(refreshError);
          logoutLocalStorage('Restaurant');
          dispatch(restaurantLogout());
          window.location.href = '/restaurant-login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosRestaurant;
};

export default createAxios;