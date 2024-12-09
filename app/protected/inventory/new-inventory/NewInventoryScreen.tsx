import React, { useEffect, useState } from "react";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedScrollView from "@/components/ThemedScrollView";
import MyButton from "@/components/ThemedButton";
import { NewInventory, Store } from "@/types/types";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import Loader from "@/components/Loader";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { handleApiError } from "@/services/errorHandlers";
import { Pressable } from "react-native";
import { format } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import ThemedModal from "@/components/ThemedModal";
import useAuth from "@/hooks/useAuth";
import { Toast } from "toastify-react-native";
import { useRouter } from "expo-router";

const NewInventoryScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { authUser } = useAuth();
  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();

  const getStores = async () => {
    setLoading(true);
    try {
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

  const handleDateChange = (event: any, date: Date | undefined) => {
    if (date) {
      setShowDateTimePicker(false);
      setSelectedDate(date);
    }
  };

  const handleCreateInventory = () => {
    setLoading(true);
    try {
      if (!selectedStore || !selectedDate || !authUser) {
        throw new Error("Missing data");
      }
      const newInventory: NewInventory = {
        storeId: selectedStore?.storeId,
        creatorId: authUser?.userId,
        inventoryDate: selectedDate,
        archived: false,
      };
      axiosPrivate.post("/api/inventories", newInventory);
    } catch (error) {
      handleApiError(error);
    } finally {
      Toast.success(`Popis uspešno kreiran`, "top");
      setShowModal(false);
      setLoading(false);
      setSelectedDate(null);
      setSelectedStore(null);
      router.push("/protected/inventory/manage-inventories/ManageInventoriesScreen");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Nov popis", animation: "slide_from_right" }} />
      <Loader loading={loading} />
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">Kreiranje novog popisa</ThemedText>
        <ThemedView style={styles.storesContainer}>
          <ThemedText>Odaberite prodavnicu</ThemedText>
          <ThemedScrollView style={styles.storesList}>
            {stores.map((store) => {
              return (
                <Pressable key={store.storeName} onPress={() => setSelectedStore(store)}>
                  <ThemedText style={store.storeName === selectedStore?.storeName ? styles.selectedStore : undefined}>
                    {store.storeName}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ThemedScrollView>
        </ThemedView>

        <ThemedView style={styles.dateContainer}>
          <Pressable onPress={() => setShowDateTimePicker(true)}>
            <ThemedText>{selectedDate ? "Datum popisa" : "Odaberite datum popisa"}</ThemedText>
            <ThemedText>{selectedDate && format(selectedDate, "dd-MM-yyyy")}</ThemedText>
            {showDateTimePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedDate || new Date()}
                is24Hour={true}
                onChange={handleDateChange}
              />
            )}
          </Pressable>
        </ThemedView>

        {selectedStore && selectedDate && (
          <ThemedView style={styles.selectedDataContainer}>
            <ThemedText>Odabrani podaci za popis</ThemedText>
            <ThemedView style={styles.selectedData}>
              <ThemedText>{`Prodavnica: ${selectedStore?.storeName}`}</ThemedText>
              <ThemedText>{`Datum popisa: ${format(selectedDate, "dd-MM-yyyy")}`}</ThemedText>
              <ThemedView style={styles.buttons}>
                <MyButton
                  onPress={() => {
                    setSelectedStore(null);
                    setSelectedDate(null);
                  }}
                  type="cancel"
                  title="Odustani"
                />
                <MyButton onPress={() => setShowModal(true)} type="primary" title="Kreiraj popis" />
              </ThemedView>
            </ThemedView>
          </ThemedView>
        )}
        <ThemedModal
          showModal={showModal}
          onOk={handleCreateInventory}
          onCancel={() => {
            setShowModal(false);
          }}
          title="Kreiranje popisa"
          message={`Da li zelite da kreirate nov popis ${selectedStore?.storeName}, datum ${format(
            selectedDate!,
            "dd-MM-yyyy"
          )}?`}
        />
      </ThemedView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    gap: 12,
  },
  storesContainer: {
    borderWidth: 2,
    borderRadius: 4,
    padding: 4,
  },
  dateContainer: {
    borderWidth: 2,
    borderRadius: 4,
    padding: 4,
  },
  storesList: {
    borderTopWidth: 2,
    marginVertical: 4,
    minHeight: 100,
    maxHeight: 300,
  },
  selectedStore: {
    fontWeight: "bold",
    fontSize: 24,
  },
  selectedDataContainer: {
    borderWidth: 2,
    borderRadius: 4,
    padding: 4,
    marginTop: 8,
  },
  selectedData: {
    borderTopWidth: 2,
    marginVertical: 4,
  },
  buttons: {
    marginTop: 8,
    marginHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default NewInventoryScreen;
