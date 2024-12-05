import React from "react";
import { StyleSheet, TextProps, TextStyle} from "react-native";
import { Link, type LinkProps, type Href } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedLinkProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  href: Href; // No generics needed, use the existing `Href` type
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  style?: TextStyle | TextStyle[];
};

const ThemedLink = ({
  lightColor,
  darkColor,
  href,
  type = "link",
  style,
  ...rest
}: ThemedLinkProps & Omit<LinkProps, "href">) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Link
      href={href}
      style={[
        { color },
        type === "default" && styles.default,
        type === "title" && styles.title,
        type === "defaultSemiBold" && styles.defaultSemiBold,
        type === "subtitle" && styles.subtitle,
        type === "link" && styles.link,
        style, // Allow custom styles to override defaults
      ]}
      {...rest}
    />
  );
};

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
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    fontSize: 24,
  },
});

export default ThemedLink;
