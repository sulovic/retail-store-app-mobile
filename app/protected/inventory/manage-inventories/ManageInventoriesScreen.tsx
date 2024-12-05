import React, { useState, useEffect } from "react";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedScrollView from "@/components/ThemedScrollView";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Inventory } from "@/types/types";
import { handleApiError } from "@/services/errorHandlers";
import { Stack } from "expo-router";
import { format } from "date-fns";
import { StyleSheet } from "react-native";
import MyButton from "@/components/ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Loader from "@/components/Loader";

const ManageInventoriesScreen = () => {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
  const iconColor = useThemeColor({}, "icon");

  const router = useRouter();

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
      <Stack.Screen options={{ title: "Lista svih popisa", animation: "slide_from_right" }} />
      <Loader loading={loading} />
      <ThemedView>
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="subtitle">Lista svih popisa</ThemedText>
          <MyButton title="Osveži" onPress={() => getInventories()} />
        </ThemedView>
        <ThemedScrollView>
          {inventories.length > 0 ? (
            inventories.map((inventory) => (
              <ThemedView style={[styles.inventoryContainer]} key={inventory.inventoryId}>
                <ThemedView style={styles.itemDataContainer}>
                  <ThemedText type="title">{inventory.Stores.storeName}</ThemedText>
                  <ThemedText>{format(inventory?.inventoryDate, "dd.MM.yyyy")}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.iconsContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/protected/inventory/active-inventories/inventory-list/InventoryListScreen",
                        params: {
                          id: inventory.inventoryId,
                          store: inventory.Stores.storeName,
                          date: format(inventory?.inventoryDate, "dd.MM.yyyy"),
                        },
                      })
                    }
                  >
                    <MaterialIcons style={styles.iconStyle} name={"list-alt"} size={60} color={iconColor} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => console.log("Archiving inventory...")}>
                    <MaterialIcons style={styles.iconStyle} name={"archive"} size={60} color={iconColor} />
                  </TouchableOpacity>
                </ThemedView>
                <ThemedView style={styles.iconsContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/protected/inventory/active-inventories/scan-products/ScanInventoryProductsScreen",
                        params: {
                          id: inventory.inventoryId,
                          store: inventory.Stores.storeName,
                          date: format(inventory?.inventoryDate, "dd.MM.yyyy"),
                        },
                      })
                    }
                  >
                    <MaterialIcons style={styles.iconStyle} name={"qr-code"} size={60} color={iconColor} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/protected/inventory/active-inventories/add-products/AddInventoryProductsScreen",
                        params: {
                          id: inventory.inventoryId,
                          store: inventory.Stores.storeName,
                          date: format(inventory?.inventoryDate, "dd.MM.yyyy"),
                        },
                      })
                    }
                  >
                    <MaterialIcons style={styles.iconStyle} name={"add"} size={60} color={iconColor} />
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
            ))
          ) : (
            <ThemedText>Nema popisa</ThemedText>
          )}
        </ThemedScrollView>
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
  },
  inventoryContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    gap: 4,
    padding: 4,
    borderWidth: 2,
    borderRadius: 4,
    margin: 4,
  },
  itemDataContainer: {
    flex: 1,
    gap: 4,
    justifyContent: "center",
  },
  iconsContainer: {
    justifyContent: "flex-start",
  },
  iconStyle: {
    textAlign: "center",
  },
});

export default ManageInventoriesScreen;
