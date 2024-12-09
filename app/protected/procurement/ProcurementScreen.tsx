import React from "react";
import { Stack } from "expo-router";
import ThemedText from "@/components/ThemedText";
import ThemedViev from "@/components/ThemedView";
import NavigationBlock from "@/components/navigation/NavigationBlock";
import useAuth from "@/hooks/useAuth";
import privilegesSchema from "@/constants/privilegesSchema";
import { StyleSheet } from "react-native";

const Procurement = () => {
  const { authUser } = useAuth();

  return (
    <>
      <Stack.Screen options={{ title: "Nabavke", animation: "slide_from_right" }} />
      <ThemedViev style={styles.container}>
        <ThemedText type="title">Popisi</ThemedText>

        {authUser &&
          authUser.UserRoles.roleId >
            privilegesSchema["/protected/procurement/new-procurement/NewProcurementsScreen"] && (
            <NavigationBlock
              href={"/protected/procurement/new-procurement/NewProcurementsScreen"}
              icon="add-shopping-cart"
              text="Unos trebovanja"
            />
          )}
        {authUser &&
          authUser.UserRoles.roleId >
            privilegesSchema["/protected/procurement/process-procurement/ProcessProcurementsScreen"] && (
            <NavigationBlock
              href={"/protected/procurement/process-procurement/ProcessProcurementsScreen"}
              icon="shopping-cart-checkout"
              text="Obrada trebovanja"
            />
          )}
      </ThemedViev>
    </>
  );
};

export default Procurement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    gap: 8,
  },
});
