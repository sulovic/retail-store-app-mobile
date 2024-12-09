import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

const ThemedText = ({ style, lightColor, darkColor, type = "default", ...rest }: ThemedTextProps) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "title" ? styles.title : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
};

export default ThemedText;

const styles = StyleSheet.create({
  default: {
    fontSize: 18,
  },
  defaultSemiBold: {
    fontSize: 18,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  link: {
    lineHeight: 24,
  },
});
