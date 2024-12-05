import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { InventoryProduct } from "@/types/types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { handleApiError } from "@/services/errorHandlers";
import { StyleSheet } from "react-native";
import ThemedView from "@/components/ThemedView";
import InventoryProductsView from "../../components/InventoryProductsView";
import Loader from "@/components/Loader";
import InventoryProductsSearchBar from "../../components/InventoryProductsSearchBar";
import generateApiParams from "@/services/generateApiParams";
import { PaginationType } from "@/types/types";
import Pagination from "@/components/Pagination";

const InventoryListScreen = () => {
  const [inventoriedProducts, setInventoriedProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 25,
    count: 0,
  });
  const axiosPrivate = useAxiosPrivate();
  const { id, store, date, editPrice }: { id: string; store: string; date: string; editPrice?: string } =
    useLocalSearchParams();
  const parsedEditPrice = editPrice === "true" || false;

  const getInventoriedProducts = async () => {
    try {
      setLoading(true);
      const apiParams: string = generateApiParams({ search, pagination }).slice(1);
      const products: { data: InventoryProduct[] } = await axiosPrivate.get(
        `/api/inventory-products?inventoryId=${id}&sortBy=inventoryProductId&sortOrder=desc${
          apiParams.length > 0 ? `&${apiParams}` : ""
        }`
      );
      setInventoriedProducts(products.data);
      const productsCount: { data: { count: number } } = await axiosPrivate.get(
        `/api/inventory-products/count?inventoryId=${id}&sortBy=inventoryProductId&sortOrder=desc${
          apiParams.length > 0 ? `&${apiParams}` : ""
        }`
      );
      setPagination({ ...pagination, count: productsCount.data.count });
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInventoriedProducts();
  }, []);

  useEffect(() => {
    if (id) {
      getInventoriedProducts();
    }
  }, [id, pagination.page, pagination.limit]);

  return (
    <>
      <Stack.Screen options={{ title: `Lista: ${store}: ${date}`, animation: "slide_from_right" }} />
      <Loader loading={loading} />
      <ThemedView style={styles.container}>
        <InventoryProductsSearchBar
          search={search}
          setSearch={setSearch}
          placeHolder="Naziv / Barcode"
          getInventoriedProducts={getInventoriedProducts}
          pagination={pagination}
          setPagination={setPagination}
        />

        <ThemedView style={styles.scannedProductsList}>
          <InventoryProductsView
            editPrice={parsedEditPrice}
            inventoriedProducts={inventoriedProducts}
            getInventoriedProducts={getInventoriedProducts}
          />
        </ThemedView>
        <Pagination pagination={pagination} setPagination={setPagination} />
      </ThemedView>
    </>
  );
};

export default InventoryListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scannedProductsList: {
    flex: 1,
  },
});
