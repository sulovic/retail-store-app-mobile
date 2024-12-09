import React, { useState, useEffect } from "react";
import ThemedText from "@/components/ThemedText";
import { Store } from "@/types/types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { handleApiError } from "@/services/errorHandlers";
import ThemedView from "@/components/ThemedView";
import ThemedScrollView from "@/components/ThemedScrollView";
import Loader from "@/components/Loader";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import ThemedModal from "@/components/ThemedModal";
import { Toast } from "toastify-react-native";

const ProcessProcurementsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const router = useRouter();
  const iconColor = useThemeColor({}, "icon");

  const axiosPrivate = useAxiosPrivate();

  const getStores = async () => {
    try {
      setLoading(true);
      const stores: { data: Store[] } = await axiosPrivate.get("/api/stores");
      setStores(stores.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStores();
  }, []);

  const handleResetProcurement = async () => {
    try {
      setLoading(true);
      await axiosPrivate.delete(`/api/procurements/reset/${selectedStore?.storeId}`);
      Toast.success(`Trebovanje je uspešno resetovano`, "top");
    } catch (error) {
      handleApiError(error);
    } finally {
      setShowResetModal(false);
      getStores();
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Obrada trebovanja za prodavnicu", animation: "slide_from_right" }} />
      <Loader loading={loading} />
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
                      onPress={() => {
                        setSelectedStore(store);
                        setShowResetModal(true);
                      }}
                    >
                      <MaterialIcons
                        style={styles.iconStyle}
                        name={"settings-backup-restore"}
                        size={60}
                        color={iconColor}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname:
                            "/protected/procurement/process-procurement/process-procurement-store/ProcessProcurementScreen",
                          params: {
                            storeId: store.storeId,
                            storeName: store.storeName,
                          },
                        })
                      }
                    >
                      <MaterialIcons style={styles.iconStyle} name={"arrow-forward"} size={60} color={iconColor} />
                    </TouchableOpacity>
                  </ThemedView>
                </ThemedView>
              ))
            : loading && <ThemedText>Nemate pristup prodavnicama</ThemedText>}
        </ThemedScrollView>
      </ThemedView>
      <ThemedModal
        danger={true}
        showModal={showResetModal}
        onOk={handleResetProcurement}
        onCancel={() => setShowResetModal(false)}
        title="Reset trebovanja"
        message={`Da li ste sigurni da zelite da resetujete trebovanje za prodavnicu ${selectedStore?.storeName} ?`}
      />
    </>
  );
};

export default ProcessProcurementsScreen;

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
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  iconStyle: {
    textAlign: "center",
  },
});
