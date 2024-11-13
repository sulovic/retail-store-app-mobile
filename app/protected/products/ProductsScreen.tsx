import React from "react";
import { Stack } from "expo-router";
import ThemedText from "@/components/ThemedText";
import ThemedViev from "@/components/ThemedView";
import NavigationBlock from "@/components/navigation/NavigationBlock";

const ProductsScreen = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Home" }} />
      <ThemedText type="title">Pregled proizvoda</ThemedText>
      <ThemedViev>
        <NavigationBlock href={"/protected/products/product-list/ProductsListScreen"} name="list" text="Pregled proizvoda" />
        <NavigationBlock href={"/protected/products/new-product/NewProductScreen"} name="add-circle-outline" text="Dodaj novi proizvod" />
        <NavigationBlock href={"/protected/products/scan-new-product/ScanNewProductScreen"} name="qr-code-scanner" text="Skeniraj novi proizvod" />
      </ThemedViev>
    </>
  );
};

export default ProductsScreen;
