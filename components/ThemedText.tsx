import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

const ThemedText = ({ style, lightColor, darkColor, type = "default", ...rest }: ThemedTextProps) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <Text style={[{ color }, type === "default" ? styles.default : undefined, type === "title" ? styles.title : undefined, type === "defaultSemiBold" ? styles.defaultSemiBold : undefined, type === "subtitle" ? styles.subtitle : undefined, type === "link" ? styles.link : undefined, style]} {...rest} />;
};

export default ThemedText;

const styles = StyleSheet.create({
  default: {
    fontSize: 24,
  },
  defaultSemiBold: {
    fontSize: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 32,
  },
});
