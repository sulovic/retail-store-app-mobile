import React, { useState, useEffect } from "react";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import MyButton from "@/components/MyButton";
import { Product } from "@/types/types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { handleApiError } from "@/services/errorHandlers";
import { ScrollView } from "react-native-gesture-handler";
import { Stack } from 'expo-router'
import ProductsView from "./components/ProductsView";

const ProductsScreen = () => {
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


  const handleEditProduct = ( product: Product) => {
    console.log(product)
  };
  const handleDeleteProduct = ( product: Product) => {
    console.log(product)
  };



  const tableHeaders = ["Naziv", "Barkod", "Cena", "Opis", "Slika", "Akcija"];

  return (
    <>
      <ScrollView className="p-2">
        <Stack.Screen options={{ title: "Proizvodi" }} />
        <ThemedView className="flex flex-row flex-grow justify-between content-center">
          <ThemedText className="text-2xl font-bold content-center">Products</ThemedText>
          <MyButton title="Osveži" onPress={() => getProducts()} />
        </ThemedView>
        <ThemedView className="border-b border-zinc-400 my-4 " />
        <ProductsView products={products} tableHeaders={tableHeaders} handleEditProduct ={handleEditProduct} handleDeleteProduct={ handleDeleteProduct} />
      </ScrollView>
    </>
  );
};

export default ProductsScreen;
