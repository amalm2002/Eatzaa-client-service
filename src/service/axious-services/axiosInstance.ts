import axios from "axios";
import { toast } from "sonner"; 
import logoutLocalStorage from "../../utils/localStorage";
import { roleConfig } from "./config/axiosConfig";

export const createAxiosInstance = (
  role: keyof typeof roleConfig,
  dispatch: any
) => {
  const config = roleConfig[role];

  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_GATEWAY_URL}/${config.basePath}`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (req: any) => {
      const token = localStorage.getItem(config.tokenKey);
      if (token) {
        req.headers.Authorization = `Bearer ${token}`;
      }
      return req;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor (handle errors and refresh)
  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      console.error(`${role} API error:`, error.response?.data || error.message);

      // Handle 401 → refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem(config.refreshTokenKey);

        if (!refreshToken) {
          logoutLocalStorage(role);
          dispatch(config.logoutAction());
          window.location.href = config.loginPath;
          return Promise.reject(error);
        }

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_GATEWAY_URL}/auth/refresh`,
            { token: refreshToken }
          );

          const newAccessToken = response.data.token;
          const newRefreshToken = response.data.refreshToken;

          localStorage.setItem(config.tokenKey, newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem(config.refreshTokenKey, newRefreshToken);
          }

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          instance.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return instance(originalRequest);
        } catch (refreshError) {
          console.error("Refresh error:", refreshError);
          logoutLocalStorage(role);
          dispatch(config.logoutAction());
          window.location.href = config.loginPath;
          return Promise.reject(refreshError);
        }
      }

      if (error.response?.status === 429) {
        toast.error(error.response?.data?.message || "Too many requests. Try again later.");
      } else {
        const msg = error.response?.data?.message || error.message || "Something went wrong";
        toast.error(msg);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};
