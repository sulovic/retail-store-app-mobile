import { handleApiError } from "./errorHandlers";
const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1]; // Extract payload
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Decode URL-safe base64
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      handleApiError(error);
      return null;
    }
  }

  export default decodeJWT