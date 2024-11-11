import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from "react-native";

interface MyButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  type?: "primary" | "secondary" | "danger";
}

const MyButton: React.FC<MyButtonProps> = ({ title, onPress, loading = false, disabled = false, type = "primary" }) => {
  const backgroundColor = type === "primary" ? "#0284c7" : type === "secondary" ? "#38bdf8" : "red"; // danger

  const textColor = "white";

  return (
    <TouchableOpacity
    onPress={onPress}
    style={[
      styles.button,
      { backgroundColor: disabled ? "#ccc" : backgroundColor },
    ]}
      disabled={disabled || loading}
    >
      {loading ? <ActivityIndicator color={textColor} /> : <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    minWidth: 80,
  },
  pressedButton: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
});

export default MyButton;
