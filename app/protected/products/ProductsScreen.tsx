import React from "react";
import { Stack } from "expo-router";
import ThemedText from "@/components/ThemedText";
import ThemedViev from "@/components/ThemedView";
import NavigationBlock from "@/components/navigation/NavigationBlock";
import privilegesSchema from "@/constants/privilegesSchema";
import useAuth from "@/hooks/useAuth";
import { StyleSheet } from "react-native";

const ProductsScreen = () => {
  const { authUser } = useAuth();

  return (
    <>
      <Stack.Screen options={{ title: "Proizvodi", animation: "slide_from_right" }} />
      <ThemedViev style={styles.container}>
        <ThemedText type="title">Pregled proizvoda</ThemedText>

        {authUser &&
          authUser.UserRoles.roleId > privilegesSchema["/protected/products/product-list/ProductsListScreen"] && (
            <NavigationBlock
              href={"/protected/products/product-list/ProductsListScreen"}
              icon="list"
              text="Pregled proizvoda"
            />
          )}
        {authUser &&
          authUser.UserRoles.roleId > privilegesSchema["/protected/products/new-product/NewProductScreen"] && (
            <NavigationBlock
              href={"/protected/products/new-product/NewProductScreen"}
              icon="add-circle-outline"
              text="Dodaj novi proizvod"
            />
          )}
          {authUser &&
          authUser.UserRoles.roleId > privilegesSchema["/protected/products/upload-products/UploadProductsScreen"] && (
            <NavigationBlock
              href={"/protected/products/upload-products/UploadProductsScreen"}
              icon="upload"
              text="Učitaj listu proizvoda"
            />
          )}
      </ThemedViev>
    </>
  );
};

export default ProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    gap: 8,
  },
});
