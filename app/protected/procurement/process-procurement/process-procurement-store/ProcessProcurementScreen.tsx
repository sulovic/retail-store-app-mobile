import React, { useState, useEffect } from "react";
import ThemedText from "@/components/ThemedText";
import { Procurement } from "@/types/types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { handleApiError } from "@/services/errorHandlers";
import ThemedView from "@/components/ThemedView";
import ThemedScrollView from "@/components/ThemedScrollView";
import Loader from "@/components/Loader";
import { StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import ThemedButton from "@/components/ThemedButton";

const NewProcurementScreen = () => {
  const [loading, setLoading] = useState(false);
  const [procurementProducts, setProcurementProducts] = useState<Procurement[]>([]);
  const { storeId, storeName }: { storeId: string; storeName: string } = useLocalSearchParams();
  const axiosPrivate = useAxiosPrivate();
  const iconColor = useThemeColor({}, "icon");

  const getProcurementProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(`/api/procurements?storeId=${storeId}&sortBy=completed&sortOrder=asc`);
      setProcurementProducts(response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      getProcurementProducts();
    }
  }, [storeId]);

  const handleClick = async ({
    procurementProduct,
    completed,
  }: {
    procurementProduct: Procurement;
    completed: boolean;
  }) => {
    let newState;
    if (completed) {
      if (procurementProduct.completed === true) {
        newState = null;
      } else {
        newState = true;
      }
    } else {
      if (procurementProduct.completed === false) {
        newState = null;
      } else {
        newState = false;
      }
    }

    try {
      setLoading(true);
      await axiosPrivate.put(`/api/procurements/${procurementProduct.procurementId}`, {
        procurementId: procurementProduct.procurementId,
        completed: newState,
      });
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
      getProcurementProducts();
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: `Obrada trebovanja: ${storeName} `, animation: "slide_from_right" }} />
      <Loader loading={loading} />
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle">Lista trebovanih proizvoda</ThemedText>
          <ThemedButton
            title="Osveži"
            onPress={() => {
              getProcurementProducts();
            }}
          />
        </ThemedView>

        <ThemedScrollView style={styles.productsContainer}>
          {procurementProducts.length > 0
            ? procurementProducts.map((procurementProduct) => (
                <ThemedView style={styles.productContainer} key={procurementProduct.procurementId}>
                  <ThemedView style={styles.productTextContainer}>
                    <ThemedText
                      style={
                        procurementProduct.completed === false ? { textDecorationLine: "line-through" } : undefined
                      }
                    >
                      {procurementProduct.Products.productName}
                    </ThemedText>
                    <ThemedText
                      style={
                        procurementProduct.completed === false ? { textDecorationLine: "line-through" } : undefined
                      }
                    >
                      {procurementProduct.Products.productBarcode} - {procurementProduct.productQuantity} kom
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.iconsContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        handleClick({
                          procurementProduct,
                          completed: false,
                        });
                      }}
                    >
                      <MaterialIcons
                        name={"close"}
                        size={50}
                        color={procurementProduct.completed === false ? "red" : iconColor}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        handleClick({
                          procurementProduct,
                          completed: true,
                        });
                      }}
                    >
                      <MaterialIcons
                        name={"check"}
                        size={50}
                        color={procurementProduct.completed === true ? "green" : iconColor}
                      />
                    </TouchableOpacity>
                  </ThemedView>
                </ThemedView>
              ))
            : !loading && (
                <ThemedView style={styles.productContainer}>
                  <ThemedText type="subtitle">Nema trebovanja za ovu prodavnicu</ThemedText>
                </ThemedView>
              )}
        </ThemedScrollView>
      </ThemedView>
    </>
  );
};

export default NewProcurementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  productsContainer: {
    flex: 1,
  },
  productListTitle: {
    marginVertical: 8,
  },
  productContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignContent: "flex-start",
    gap: 4,
    padding: 4,
    borderWidth: 2,
    borderRadius: 4,
    marginVertical: 4,
  },
  productTextContainer: {
    flex: 1,
    gap: 4,
    justifyContent: "center",
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
});
