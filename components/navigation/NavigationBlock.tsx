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

const NavigationBlock = ({ href, text, icon }: { href: Href; text: string; icon: ComponentProps<typeof MaterialIcons>["name"] }) => {
  const themeColor = useThemeColor({}, "text");

  return (
    <TouchableOpacity onPress={() => router.push(href)}>
      <ThemedView style={[styles.linkStyle, { borderColor: themeColor }]}>
        <ThemedText type="title" style={styles.textStyle}>
          {text}
        </ThemedText>
        <MaterialIcons style={styles.iconStyle} name={icon} size={80} color={themeColor} />
      </ThemedView>
    </TouchableOpacity>
  );
};

export default NavigationBlock;

const styles = StyleSheet.create({
  linkStyle: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 8,
    marginVertical: 4,
  },

  textStyle: {
    flex: 1,
    padding: 8,
    textAlign: "left",
  },
  iconStyle: {
    textAlign: "right",
    padding: 8,
  },
});
