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

  return <TextInput style={[styles.input, { backgroundColor, color: textColor }, style]} placeholderTextColor={textColor} {...rest} />;
};

export default ThemedTextInput;

const styles = StyleSheet.create({
  input: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    minWidth: 80,
    fontWeight: "600",
    fontSize: 20,
    borderWidth: 2,
    borderColor: "#ccc", // You can set a default border color here
  },
});
