import React from "react";
import { Stack } from "expo-router";
import ThemedText from "@/components/ThemedText";
import ThemedViev from "@/components/ThemedView";
import NavigationBlock from "@/components/navigation/NavigationBlock";

const HomeScreen = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Home" }} />
      <ThemedText type="title">Retail Store APP</ThemedText>
      <ThemedViev>
        <NavigationBlock href={"/protected/inventory/InventoriesScreen"} name="inventory" text="Popis" />
        <NavigationBlock href={"/protected/products/ProductsScreen"} name="cookie" text="Proizvodi" />
        <NavigationBlock href={"/protected/users/UsersScreen"} name="person" text="Korisnici" />

      </ThemedViev>
    </>
  );
};

export default HomeScreen;

