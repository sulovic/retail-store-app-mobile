import React, { createContext, useState, ReactNode } from "react";
import { apiLoginConnector, apiLogoutConnector, apiRefreshConnector } from "@/services/apiAuthConnectors";
import { Toast } from "toastify-react-native";
import decodeJWT from "@/services/decodeJWT";
import type { AuthUser, AuthContextType, AxiosLoginResponse } from "@/types/types";
import { handleApiError } from "@/services/errorHandlers";
import { useRouter } from "expo-router";

export const AuthContext: React.Context<AuthContextType | null> = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin: AuthContextType["handleLogin"] = async ({ type, email, password, credential }) => {
    // User / password login
    if (type === "password") {
      try {
        const loginResponse: AxiosLoginResponse | undefined = await apiLoginConnector({ type, email, password });
        if (loginResponse) {
          const accessToken: string = loginResponse?.data?.accessToken;
          const decodedAccessToken: AuthUser = decodeJWT(accessToken);
          Toast.success(`Uspešno ste se prijavili`, "top");
          setAuthUser(decodedAccessToken);
          setAccessToken(accessToken);
          router.push("/protected/home/HomeScreen");
        }
      } catch (error) {
        handleApiError(error);
      }

      // Google login
    } else if (type === "google") {
      try {
        const loginResponse: AxiosLoginResponse | undefined = await apiLoginConnector({ type, credential });
        if (loginResponse) {
          const accessToken: string = loginResponse?.data?.accessToken;
          const decodedAccessToken: AuthUser = decodeJWT(accessToken);
          Toast.success(`Uspešno ste se prijavili`, "top");
          setAuthUser(decodedAccessToken);
          setAccessToken(accessToken);
          router.push("/protected/home/HomeScreen");
        }
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  const handleLogout: AuthContextType["handleLogout"] = async () => {
    try {
      await apiLogoutConnector();
      setAuthUser(null);
      setAccessToken(null);
      router.push("/");
      Toast.success(`Uspešno ste se odjavili`, "top");
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleRefreshToken: AuthContextType["handleRefreshToken"] = async () => {
    try {
      const refreshTokenResponse: AxiosLoginResponse | undefined = await apiRefreshConnector();

      if (refreshTokenResponse) {
        const newAccessToken: string = refreshTokenResponse?.data?.accessToken;
        const decodedAccessToken: AuthUser = decodeJWT(newAccessToken);
        setAuthUser(decodedAccessToken);
        setAccessToken(newAccessToken);
        return newAccessToken;
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        accessToken,
        setAccessToken,
        handleLogin,
        handleLogout,
        handleRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
