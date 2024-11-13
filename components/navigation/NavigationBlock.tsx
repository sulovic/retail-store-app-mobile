import React from "react";
import ThemedText from "@/components/ThemedText";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import ThemedView from "../ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import { type ComponentProps } from "react";
import { StyleSheet } from "react-native";
import { Href } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

const NavigationBlock = ({ href, text, name }: { href: Href<string | object>; text: string; name: ComponentProps<typeof MaterialIcons>["name"] }) => {
  const themeColor = useThemeColor({}, "text");

  return (
    <TouchableOpacity onPress={() => router.push(href)}>
      <ThemedView style={[styles.linkStyle, { borderColor: themeColor }]}>
        <ThemedText type="title" style={styles.textStyle}>
          {text}
        </ThemedText>
        <MaterialIcons style={styles.iconStyle} name={name} size={80} color={themeColor} />
      </ThemedView>
    </TouchableOpacity>
  );
};

export default NavigationBlock;

const styles = StyleSheet.create({
  linkStyle: {
    display: "flex",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 8,
    marginVertical: 4,
  },

  textStyle: {
    flexBasis: "65%",
    padding: 4,
    textAlign: "left",
  },
  iconStyle: {
    flexBasis: "30%",
    textAlign: "center",
    padding: 4,
  },
});
