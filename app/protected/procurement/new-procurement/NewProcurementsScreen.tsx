import React, { useState, useEffect } from "react";
import ThemedText from "@/components/ThemedText";
import { Store } from "@/types/types";
import ThemedView from "@/components/ThemedView";
import ThemedScrollView from "@/components/ThemedScrollView";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import useAuth from "@/hooks/useAuth";

const NewProcurementsScreen = () => {
  const [stores, setStores] = useState<Omit<Store, "Users">[]>([]);
  const router = useRouter();
  const iconColor = useThemeColor({}, "icon");
  const { authUser } = useAuth();

  useEffect(() => {
    if (authUser) {
      setStores(authUser.Stores);
    }
  }, [authUser]);

  return (
    <>
      <Stack.Screen options={{ title: "Unos trebovanja za prodavnicu", animation: "slide_from_right" }} />
      <ThemedView style={styles.container}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="subtitle">Lista prodavnica</ThemedText>
        </ThemedView>
        <ThemedScrollView style={styles.storesContainer}>
          {stores.length > 0
            ? stores.map((store) => (
                <ThemedView style={styles.storeContainer} key={store.storeId}>
                  <ThemedView style={styles.itemDataContainer}>
                    <ThemedText type="title">{store.storeName}</ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.iconsContainer}>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/protected/procurement/new-procurement/new-procurement-store/NewProcurementScreen",
                          params: {
                            storeId: store.storeId,
                            storeName: store.storeName,
                          },
                        })
                      }
                    >
                      <MaterialIcons style={styles.iconStyle} name={"add"} size={80} color={iconColor} />
                    </TouchableOpacity>
                  </ThemedView>
                </ThemedView>
              ))
            : <ThemedText>Nemate pristup prodavnicama</ThemedText>}
        </ThemedScrollView>
      </ThemedView>
    </>
  );
};

export default NewProcurementsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  storesContainer: {
    flex: 1,
  },
  storeContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    gap: 4,
    padding: 4,
    borderWidth: 2,
    borderRadius: 4,
    marginVertical: 4,
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
