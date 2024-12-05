import { useEffect } from "react";
import Constants from "expo-constants";
import axios from "axios";
import useAuth from "@/hooks/useAuth";

// const baseURL: string = Constants.expoConfig?.extra?.apiUrl;
const baseURL: string = Constants.expoConfig?.extra?.apiBaseUrl;

const axiosPrivate = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
  baseURL,
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
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && error?.response?.data?.error === "Unauthorized - Access Token Expired" && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            const newAccessToken = await handleRefreshToken();
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
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
