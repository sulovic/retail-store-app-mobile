import axios from "axios";
import Constants from "expo-constants";
import { LoginData, AxiosLoginResponse } from "@/types/types";
import { handleApiError } from "@/services/errorHandlers";

// const baseURL: string = Constants.expoConfig?.extra?.apiUrl;
const baseURL: string = Constants.expoConfig?.extra?.apiBaseUrl;

const apiTokenExchangeConnector: ({ code, code_verifier }: { code: string, code_verifier: string }) => Promise<string | undefined> = async ({ code, code_verifier }) => {
  const apiURL: string = `${baseURL}/auth/callback`;
  try {
    const id_token: string = await axios.post(apiURL, {
      code,
      code_verifier,
    });
    if (id_token) {
      return id_token;
    }
  } catch (error: any) {
    handleApiError(error);
    return undefined;
  }
};

const apiLoginConnector: (data: LoginData) => Promise<AxiosLoginResponse | undefined> = async (data) => {
  const apiURL: string = `${baseURL}/login`;
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
  const apiURL: string = `${baseURL}/logout`;

  try {
    await axios.post(apiURL, null, {
      withCredentials: true,
    });
  } catch (error: any) {
    handleApiError(error);
  }
};

const apiRefreshConnector: () => Promise<AxiosLoginResponse | undefined> = async () => {
  const apiURL: string = `${baseURL}/refresh`;

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

export { apiLoginConnector, apiRefreshConnector, apiLogoutConnector, apiTokenExchangeConnector };
