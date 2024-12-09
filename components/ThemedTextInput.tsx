import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
};

const ThemedTextInput = ({ style, lightColor, darkColor, ...rest }: ThemedTextInputProps) => {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const placeholderTextColor=useThemeColor({ light: lightColor, dark: darkColor }, "placeholderText");

  return <TextInput style={[styles.input, { backgroundColor, color: textColor }, style]} placeholderTextColor={placeholderTextColor} {...rest} />;
};

export default ThemedTextInput;

const styles = StyleSheet.create({
  input: {
padding: 6,
    borderRadius: 4,
    minWidth: 100,
    fontWeight: "600",
    fontSize: 18,
    borderWidth: 2,
    borderColor: "#ccc", // You can set a default border color here
  },
});
