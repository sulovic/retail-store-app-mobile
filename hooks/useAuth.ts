import { useContext } from "react";
import { AuthContextType } from "../types/types";
import { AuthContext } from "@/contexts/AuthContext";
import { Toast } from "toastify-react-native";

const useAuth: () => AuthContextType = () => {
  const context = useContext(AuthContext);

  if (!context) {
    Toast.error(
      `Ups! Došlo je do greške. useAuth must be used within a AuthProvider`,
      "top",
    );
    throw new Error(" useAuth must be used within a AuthProvider");
  }

  return context;
};

export default useAuth;
