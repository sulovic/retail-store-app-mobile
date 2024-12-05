import React from "react";
import { Stack } from "expo-router";
import ThemedText from "@/components/ThemedText";
import ThemedViev from "@/components/ThemedView";
import NavigationBlock from "@/components/navigation/NavigationBlock";
import useAuth from "@/hooks/useAuth";
import privilegesSchema from "@/constants/privilegesSchema";
import { StyleSheet } from "react-native";

const HomeScreen = () => {
  const { authUser } = useAuth();

  return (
    <>
      <Stack.Screen options={{ title: "Home", animation: "slide_from_right" }} />
      <ThemedViev style={styles.container}>
        <ThemedText type="title">Retail Store APP</ThemedText>

        {authUser && authUser.UserRoles.roleId > privilegesSchema["/protected/inventory/InventoriesScreen"] && (
          <NavigationBlock href={"/protected/inventory/InventoriesScreen"} icon="inventory" text="Popisi" />
        )}
        {authUser && authUser.UserRoles.roleId > privilegesSchema["/protected/procurment/ProcurementScreen"] && (
          <NavigationBlock href={"/protected/procurment/ProcurementScreen"} icon="add-shopping-cart" text="Nabavke" />
        )}
        {authUser && authUser.UserRoles.roleId > privilegesSchema["/protected/products/ProductsScreen"] && (
          <NavigationBlock href={"/protected/products/ProductsScreen"} icon="cookie" text="Proizvodi" />
        )}
        {authUser && authUser.UserRoles.roleId > privilegesSchema["/protected/users/UsersScreen"] && (
          <NavigationBlock href={"/protected/users/UsersScreen"} icon="person" text="Korisnici" />
        )}
      </ThemedViev>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 4,
  },
});
