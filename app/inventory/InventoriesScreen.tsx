import React, { useState, useEffect } from "react";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedScrollView from "@/components/ThemedScrollView";
import ThemedLink from "@/components/ThemedLink";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Inventory } from "@/types/types";
import { handleApiError } from "@/services/errorHandlers";
import { Stack } from "expo-router";
import { format } from "date-fns";
import { StyleSheet } from "react-native";

const InventoriesScreen = () => {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();

  const getInventories = async () => {
    setLoading(true);

    try {
      const inventories: { data: Inventory[] } = await axiosPrivate.get("/api/inventories");
      setInventories(inventories.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInventories();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "Lista popisa" }} />

      <ThemedView>
        <ThemedText>Lista popisa</ThemedText>
        <ThemedScrollView>
          {inventories.length > 0 ? (
            inventories.map((inventory) => (
              <ThemedView style={styles.productList} key={inventory.inventoryId}>
                <ThemedText style={{ flexBasis: "10%" }}>{inventory.inventoryId}</ThemedText>
                <ThemedText style={{ flexBasis: "30%" }}>{inventory.Stores.storeName}</ThemedText>
                <ThemedText style={{ flexBasis: "25%" }}>{format(inventory?.inventoryDate, "dd.MM.yyyy")}</ThemedText>
                <ThemedLink style={{ flexBasis: "10%" }} href={{ pathname: "/inventory/add-products/ScanProductsScreen", params: { id: inventory.inventoryId, store: inventory.Stores.storeName, date: format(inventory?.inventoryDate, "dd.MM.yyyy") } }}>
                  Sken
                </ThemedLink>
                <ThemedLink style={{ flexBasis: "10%" }} href={{ pathname: "/inventory/inventory-list/InventoryListScreen", params: { id: inventory.inventoryId, store: inventory.Stores.storeName, date: format(inventory?.inventoryDate, "dd.MM.yyyy") } }}>
                  List
                </ThemedLink>
              </ThemedView>
            ))
          ) : loading ? (
            <ThemedText>Loading...</ThemedText>
          ) : (
            <ThemedText>Nema popisa</ThemedText>
          )}
        </ThemedScrollView>
      </ThemedView>
    </>
  );
};

export default InventoriesScreen;

const styles = StyleSheet.create({
  productList: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    gap: 4,
    paddingVertical: 4,
  },
});
