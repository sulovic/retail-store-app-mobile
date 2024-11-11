import React, { useState, useEffect } from "react";
import { Pressable } from "react-native";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import { Product } from "@/types/types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { handleApiError } from "@/services/errorHandlers";

const InventoryListScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const axiosPrivate = useAxiosPrivate();

  const getProducts = async () => {
    try {
      const products: { data: Product[] } = await axiosPrivate.get("/api/products");
      setProducts(products.data);
    } catch (error) {
      handleApiError(error);
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <ThemedText style={{ fontSize: 20 }}>Products</ThemedText>
      <Pressable onPress={() => getProducts()} style={{ backgroundColor: "blue", padding: 10 }}>
        <ThemedText style={{ fontSize: 20 }}>Osveži</ThemedText>
      </Pressable>
      {products.length > 0 ? (
        products.map((product) => (
          <ThemedView key={product.productId}>
            <ThemedText style={{ fontSize: 20 }}>{product.productName}</ThemedText>
            <ThemedText style={{ fontSize: 20 }}>{product.productBarcode}</ThemedText>
          </ThemedView>
        ))
      ) : (
        <ThemedText style={{ fontSize: 20 }}>Nema unetih proizvoda</ThemedText>
      )}
    </>
  );
};

export default InventoryListScreen;
