import React, { useState } from "react";
import ThemedText from "@/components/ThemedText";
import { StyleSheet } from "react-native";
import { Stack } from "expo-router";
import Loader from "@/components/Loader";
import ThemedView from "@/components/ThemedView";
import { Toast } from "toastify-react-native";
import ThemedButton from "@/components/ThemedButton";
import { importCSV, prepareProductData } from "@/services/csvFunctions";
import ThemedScrollView from "@/components/ThemedScrollView";
import { Product } from "@/types/types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const UploadProductsScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [preparedProductData, setPreparedProductData] = useState<Omit<Product, "productId">[]>([]);

  const axiosPrivate = useAxiosPrivate();

  const handleFileUpload = async () => {
    try {
      setLoading(true);
      const parsedData = await importCSV();
      setCsvData(parsedData);
      console.log(parsedData);
    } catch (error) {
      Toast.error("Greška prilikom obrade podataka.", "top");
    } finally {
      setLoading(false);
    }
  };

  const handlePrepareData = () => {
    const prepared = prepareProductData(csvData);
    setPreparedProductData(prepared);
    console.log(prepared);
  };

  const handleUploadData = async () => {
    try {
      setLoading(true);
      const uploadedProducts: Product[] = await axiosPrivate.post("/api/products/bulk-upload", preparedProductData);
      console.log("Uploaded products", uploadedProducts);
      Toast.success("Proizvodi uspešno učitani", "top");
    } catch (error) {
      Toast.error("Greška prilikom obrade podataka.", "top");
    } finally {
      setCsvData([]);
      setPreparedProductData([]);
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Učitavanje liste proizvoda", animation: "slide_from_right" }} />
      <Loader loading={loading} />
      <ThemedView style={styles.container}>
        <ThemedView style={styles.headerContainer}>
          <ThemedText type="subtitle">Učitavanje proizvoda</ThemedText>

          <ThemedButton title="Učitaj" onPress={handleFileUpload} />
        </ThemedView>
        {csvData.length > 0 && (
          <>
            <ThemedText>Pregled CSV podataka:</ThemedText>

            <ThemedScrollView style={styles.csvDataContainer}>
              {csvData.slice(0, 20).map((item, index) => (
                <ThemedView key={index} style={styles.csvData}>
                  <ThemedText>{JSON.stringify(item)}</ThemedText>
                </ThemedView>
              ))}
            </ThemedScrollView>
            <ThemedView style={styles.buttonContainer}>
              <ThemedButton title="Pripremi podatke" onPress={handlePrepareData} />
            </ThemedView>
            {preparedProductData.length > 0 && (
              <>
                <ThemedText>Pregled pripremljenih podataka:</ThemedText>

                <ThemedScrollView style={styles.csvDataContainer}>
                  {preparedProductData.slice(0, 20).map((item, index) => (
                    <ThemedView key={index} style={styles.csvData}>
                      <ThemedText>{item.productName}</ThemedText>
                      <ThemedText>
                        BC: {item.productBarcode} - {item.productPrice} RSD
                      </ThemedText>
                    </ThemedView>
                  ))}
                </ThemedScrollView>
                <ThemedView style={styles.buttonContainer}>
                  <ThemedButton title="Otpremi podatke" onPress={handleUploadData} />
                </ThemedView>
              </>
            )}
          </>
        )}
      </ThemedView>
    </>
  );
};

export default UploadProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 4,
    gap: 4,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  csvDataContainer: {
    maxHeight: 160,
    padding: 4,
    borderWidth: 2,
    borderRadius: 4,
  },
  csvData: {
    padding: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 8,
  },
});
