import React from "react";
import { StyleSheet, TextProps } from "react-native";
import { Link, type LinkProps, type Href } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedLinkProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  href: Href<string | object>;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

const ThemedLink = <T extends string | object>({ lightColor, darkColor, href, type = "link", style, ...rest }: ThemedLinkProps & Omit<LinkProps<T>, "href">) => {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Link<T> href={href} style={[{ color }, type === "default" ? styles.default : undefined, type === "title" ? styles.title : undefined, type === "defaultSemiBold" ? styles.defaultSemiBold : undefined, type === "subtitle" ? styles.subtitle : undefined, type === "link" ? styles.link : undefined, style]} {...rest} />
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
