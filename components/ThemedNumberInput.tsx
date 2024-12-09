import React, { useState, useEffect } from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";

export type ThemedNumberInputProps = TextInputProps & {
  numericValue: number; // External number state
  onChangeNumericValue: (value: number) => void; // Callback for numeric state updates
  lightColor?: string;
  darkColor?: string;
};

const ThemedNumberInput = ({
  style,
  numericValue,
  onChangeNumericValue,
  lightColor,
  darkColor,
  ...rest
}: ThemedNumberInputProps) => {
  const [textValue, setTextValue] = useState(numericValue.toString()); // Internal string state
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const placeholderTextColor = useThemeColor({ light: lightColor, dark: darkColor }, "placeholderText");

  const handleChange = (text: string) => {
    // Allow only numbers and one decimal point
    if (/^\d*\.?\d*$/.test(text)) {
      setTextValue(text); // Update displayed text
      const parsedValue = parseFloat(text); // Convert text to a number
      onChangeNumericValue(isNaN(parsedValue) ? 0 : parseFloat(parsedValue.toFixed(2))); // Update numeric value with rounding
    }
  };

  useEffect(() => {
    // Sync textValue with the numericValue prop
    setTextValue(numericValue.toString());
  }, [numericValue]);

  return (
    <TextInput
      style={[styles.input, { backgroundColor, color: textColor }, style]}
      placeholderTextColor={placeholderTextColor}
      keyboardType="decimal-pad"
      value={textValue} // Use the string value
      onChangeText={handleChange}
      {...rest}
    />
  );
};

export default ThemedNumberInput;

const styles = StyleSheet.create({
  input: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 4,
    minWidth: 80,
    fontWeight: "600",
    fontSize: 18,
    borderWidth: 2,
    borderColor: "#ccc",
    textAlign: "right",
  },
});
