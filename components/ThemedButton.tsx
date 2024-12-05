import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps, StyleProp, ViewStyle } from "react-native";

interface ThemedButtonProps extends TouchableOpacityProps {
  style?: StyleProp<ViewStyle>; // Correct type for the style prop
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  type?: "primary" | "secondary" | "danger" | "cancel";
}

const ThemedButton: React.FC<ThemedButtonProps> = ({ title, onPress, loading = false, disabled = false, type = "primary", style }) => {
  const backgroundColor = type === "primary" ? "#0284c7" : type === "secondary" ? "#38bdf8" : type === "cancel" ? "#717177" : "red";

  const textColor = "white";

  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: disabled ? "#ccc" : backgroundColor }, style]} disabled={disabled || loading}>
      {loading ? <ActivityIndicator color={textColor} /> : <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    minWidth: 100,
  },
  pressedButton: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
  },
});

export default ThemedButton;
