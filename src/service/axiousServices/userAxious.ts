import axios from "axios";
import { userLogout } from "../redux/slices/userAuthSlice";
import logoutLocalStorage from "../../utils/localStorage";

const createAxios = (dispatch: any) => {
    const axiosUser = axios.create({
        baseURL: `${import.meta.env.VITE_API_GATEWAY_URL}/user`,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        }
    });

    // axiosUser.interceptors.request.use(
    //     (config: any) => {
    //         const token = localStorage.getItem('userToken');
    //         console.log('user axios inside ------------- ', token);
    //         console.log('user axios inside refreshToken ', localStorage.getItem('refreshToken'));

    //         return {
    //             ...config,
    //             headers: {
    //                 ...(token !== null && { Authorization: `Bearer ${token}` }),
    //                 ...config.headers,
    //             },
    //         };
    //     },
    //     (error: any) => {
    //         return Promise.reject(error);
    //     }
    // );

    // axiosUser.interceptors.response.use(
    //     (response) => {
    //         return response;
    //     },
    //     async (error) => {
    //         console.log(error);

    //         const originalRequest = error.config;

    //         if (error.response.status === 401 && !originalRequest._retry) {
    //             originalRequest._retry = true;
    //             const refresh_token = localStorage.getItem('refreshToken');
    //             console.log("refresh token", refresh_token);
    //             if (!refresh_token) {
    //                 logoutLocalStorage('User');
    //                 dispatch(userLogout());
    //                 window.location.href = '/login';
    //                 return Promise.reject(error);
    //             }

    //             try {
    //                 const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/refresh`, { token: refresh_token });
    //                 console.log('responseeeeeeeeeeeeee :', response);

    //                 const { accessToken, refreshToken, role } = response.data;
    //                 if (role !== 'User') {
    //                     throw new Error('Invalid role received');
    //                 }
    //                 localStorage.setItem('userToken', accessToken);
    //                 localStorage.setItem('refreshToken', refreshToken);

    //                 originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
    //                 return axiosUser(originalRequest);

    //             } catch (refreshError) {
    //                 console.error("Refresh token failed", refreshError);
    //                 logoutLocalStorage('User');
    //                 dispatch(userLogout());
    //                 window.location.href = '/login';
    //                 return Promise.reject(refreshError);
    //             }
    //         }

    //         return Promise.reject(error);
    //     }
    // );


    axiosUser.interceptors.request.use(
        (config: any) => {
            const token = localStorage.getItem('userToken');
            console.log('user axios inside ------------- ', token);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error: any) => Promise.reject(error)
    );

    axiosUser.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            console.error('Response error:', error.response?.data || error.message);
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                try {
                    originalRequest._retry = true;
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (!refreshToken) {
                        logoutLocalStorage('User')
                        dispatch(userLogout());
                        window.location.href = '/login';
                        return Promise.reject(error);
                    }

                    const response = await axios.post(`${import.meta.env.VITE_API_GATEWAY_URL}/auth/refresh`, { token: refreshToken });

                    const newAccessToken = response.data.token;
                    const newRefreshToken = response.data.refreshToken;

                    localStorage.setItem('userToken', newAccessToken);
                    if (newRefreshToken) {
                        localStorage.setItem('refreshToken', newRefreshToken);
                    }

                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    axiosUser.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosUser(originalRequest);
                } catch (refreshError) {
                    console.error('Refresh token error:', refreshError);
                    // localStorage.removeItem('adminToken');
                    // localStorage.removeItem('adminRefreshToken');
                    logoutLocalStorage('User')
                    dispatch(userLogout());
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );

    return axiosUser;
};

export default createAxios;