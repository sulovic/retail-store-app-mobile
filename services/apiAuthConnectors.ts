import axios from "axios";
import { LoginData, AxiosLoginResponse } from "@/types/types";
import { handleApiError } from "@/services/errorHandlers";

const apiLoginConnector: (data: LoginData) => Promise<AxiosLoginResponse | undefined> = async (data) => {
  const apiURL: string = `${process.env.EXPO_PUBLIC_API_BASE_URL}/login`;
  try {
    const response: AxiosLoginResponse = await axios.post(apiURL, data, {
      withCredentials: true,
    });
    if (response) {
      return response;
    } else {
      throw new Error("No response from server");
    }
  } catch (error: any) {
    handleApiError(error);
  }
};

const apiLogoutConnector: () => Promise<void> = async () => {
  const apiURL: string = `${process.env.EXPO_PUBLIC_API_BASE_URL}/logout`;

  try {
    await axios.post(apiURL, null, {
      withCredentials: true,
    });
  } catch (error: any) {
    handleApiError(error);
  }
};

const apiRefreshConnector: () => Promise<AxiosLoginResponse | undefined> = async () => {
  const apiURL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/refresh`;

  try {
    const response: AxiosLoginResponse = await axios.post(apiURL, null, {
      withCredentials: true,
    });
    if (response) {
      return response;
    } else {
      throw new Error("No response from server");
    }
  } catch (error: any) {
    // Comment to avoid toast on login Page
    // handleApiError(error);
  }
};

export { apiLoginConnector, apiRefreshConnector, apiLogoutConnector };
