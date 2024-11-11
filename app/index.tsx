import React from "react";
import ThemedText from "@/components/ThemedText";
import { Stack } from "expo-router";
import ThemedView from "@/components/ThemedView";
import ThemedLink from "@/components/ThemedLink";

const login = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Login" }} />
      <ThemedView>
        <ThemedText>Login</ThemedText>
        <ThemedLink href={{ pathname: "/inventory/InventoriesScreen", params: { id: "1" } }}>Lista popisa</ThemedLink>
      </ThemedView>
    </>
  );
};

export default login;
