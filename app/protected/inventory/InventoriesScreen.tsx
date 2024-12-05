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
      <Stack.Screen options={{ title: "Popisi", animation: "slide_from_right" }} />
      <ThemedViev style={styles.container}>
      <ThemedText type="title">Popisi</ThemedText>

        {authUser &&
          authUser.UserRoles.roleId >
            privilegesSchema["/protected/inventory/active-inventories/ActiveInventoriesScreen"] && (
            <NavigationBlock
              href={"/protected/inventory/active-inventories/ActiveInventoriesScreen"}
              icon="list"
              text="Aktivni popisi"
            />
          )}
        {authUser &&
          authUser.UserRoles.roleId >
            privilegesSchema["/protected/inventory/manage-inventories/ManageInventoriesScreen"] && (
            <NavigationBlock
              href={"/protected/inventory/manage-inventories/ManageInventoriesScreen"}
              icon="edit"
              text="Uredi popise"
            />
          )}
        {authUser &&
          authUser.UserRoles.roleId > privilegesSchema["/protected/inventory/new-inventory/NewInventoryScreen"] && (
            <NavigationBlock
              href={"/protected/inventory/new-inventory/NewInventoryScreen"}
              icon="add"
              text="Novi popis"
            />
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
