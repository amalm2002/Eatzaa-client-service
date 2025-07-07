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