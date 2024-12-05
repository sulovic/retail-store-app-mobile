import { Toast } from "toastify-react-native";

export const handleApiError: (error: any) => void = (error) => {
  if (error.response?.status === 400) {
    Toast.warn("Nisu poslati neophodni podaci.", "top");
  } else if (error.response?.status === 401) {
    Toast.warn("Niste autorizovani da posetite ovu stranu.", "top");
  } else if (error.response?.status === 403) {
    Toast.error("Nemate ovlašćenja da izvršite ovu akciju.", "top");
  } else if (error.response?.status === 404) {
    Toast.error("Traženi podatak nije pronađen.", "top");
  } else if (error.response?.status === 500) {
    Toast.error("Greška na API serveru.", "top");
  } else if (error.response?.status === 409) {
    Toast.error("Podatak nije dodat! Ovaj podatak već postoji.", "top");
  } else if (error.response) {
    Toast.error(`API Error: ${error?.response?.status}`, "top");
  } else if (error.request) {
    Toast.error("Error: No response received from server. Please check your server or internet connection.", "top");
  } else {
    Toast.error(`Unexpected Error: Please try again later.`, "top");
  }
};
