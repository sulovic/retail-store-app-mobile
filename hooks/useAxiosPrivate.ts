import { useEffect } from "react";
import axios from "axios";
import  useAuth  from "@/hooks/useAuth";

const axiosPrivate = axios.create({
  headers: {
    "Content-Type": "application/json",
    'Cache-Control': 'no-cache',
  },
  withCredentials: true,
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
});

const useAxiosPrivate = () => {
  const { accessToken, handleRefreshToken } = useAuth();

  useEffect(() => {
    // Request interceptor to add Authorization header
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor to handle token refresh
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await handleRefreshToken();
            console.log("Refreshing token");  
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );

    // Cleanup interceptors on unmount
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };

  }, [handleRefreshToken, accessToken]);

  return axiosPrivate;
};

export default useAxiosPrivate;
