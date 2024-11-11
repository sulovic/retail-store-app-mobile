  import React, { useState, useEffect } from "react";
  import { Stack, useLocalSearchParams } from "expo-router";
  import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
  import ThemedView from "@/components/ThemedView";
  import ThemedText from "@/components/ThemedText";
  import MyButton from "@/components/MyButton";
  import ThemedScrollView from "@/components/ThemedScrollView";
  import ThemedTextInput from "@/components/ThemedTextInput";
  import { InventoryProduct, Product } from "@/types/types";
  import useAxiosPrivate from "@/hooks/useAxiosPrivate";
  import { handleApiError } from "@/services/errorHandlers";
  import { StyleSheet } from "react-native";

  const ScanProductsScreen = () => {
    const [scanned, setScanned] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
    const [inventoriedProducts, setInventoriedProducts] = useState<InventoryProduct[]>([]);
    const [cameraPermission, requestCameraPermission] = useCameraPermissions();
    const { id, store, date } = useLocalSearchParams();

    const axiosPrivate = useAxiosPrivate();

    console.log(id, store, date);


    const getProduct = async (barCode: string) => {
      setLoading(true);
      try {
        const products: { data: Product[] } = await axiosPrivate.get(`/api/products/?productBarcode=${barCode}`);
        setScannedProduct(products.data[0]);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    const getInventoriedProducts = async () => {
      setLoading(true);
      try {
        const products: { data: InventoryProduct[] } = await axiosPrivate.get(`/api/inventory-products?inventoryId=${id}&limit=20`);
        setInventoriedProducts(products.data);
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      getInventoriedProducts();
    }, []);

    const handleBarCodeScanned = (result: BarcodeScanningResult) => {
      if (!scanned) {
        setScanned(true);
        getProduct(result.data);
      }
    };

    const handleAddProduct = () => {
      console.log("Adding", scannedProduct, quantity);
    };

    return (
      <>
        <Stack.Screen options={{ title: "Skeniranje proizvoda" }} />
        <ThemedView style={styles.container}>
          {cameraPermission && !cameraPermission.granted ? (
            <ThemedView>
              <ThemedText>We need your permission to show the camera</ThemedText>
              <MyButton onPress={requestCameraPermission} title="Odobri pristup kameri" />
            </ThemedView>
          ) : (
            <>
              <ThemedView style={styles.scannedProductList}>
                <ThemedText>{`Popis: ${store} - ${date}`}</ThemedText>
                <ThemedScrollView showsVerticalScrollIndicator={true} indicatorStyle={"white"}> 
                  {inventoriedProducts.length > 0 &&
                    inventoriedProducts.map((inventoriedProduct) => (
                      <ThemedView key={inventoriedProduct.inventoryProductId}>
                        <ThemedText>{inventoriedProduct.Products.productName}</ThemedText>
                        <ThemedText>{inventoriedProduct.productPrice}</ThemedText>
                        <ThemedText>{inventoriedProduct.productQuantity}</ThemedText>
                      </ThemedView>
                    ))}
                </ThemedScrollView>
              </ThemedView>
  
              <ThemedView style={styles.scannedProduct}>
                <ThemedText>{scannedProduct && scannedProduct?.productName}</ThemedText>
                <ThemedTextInput
                  value={quantity}
                  style={{ width: 80 }}
                  onChangeText={(text: string) => setQuantity(text)}
                  keyboardType="numeric"
                  placeholder="kom"
                  autoComplete="off"
                />
                <MyButton style={{ flexGrow: 1 }} title={"Dodaj"} disabled={!scannedProduct || !quantity} onPress={handleAddProduct} />
              </ThemedView>
  
              <ThemedView style={styles.cameraArea}>
                <CameraView
                  style={{ flex: 1 }}
                  barcodeScannerSettings={{
                    barcodeTypes: ["ean13"],
                  }}
                  onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                >
                  <ThemedView style={styles.cameraButton}>
                    <MyButton
                      title={scannedProduct ? "Ponovo skeniraj" : "Skeniraj"}
                      onPress={() => {
                        setScanned(false);
                        setScannedProduct(null);
                        setQuantity("");
                      }}
                    />
                  </ThemedView>
                </CameraView>
              </ThemedView>
            </>
          )}
        </ThemedView>
      </>
    );
  };

  export default ScanProductsScreen;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
    },
    scannedProductList: {
      flex: 1,
      flexBasis: "60%",
      paddingBottom: 4,
    },
    scannedProduct: {
      flex: 1,
      flexBasis: "15%",
      gap: 4,
      flexDirection: "row",
      justifyContent: "flex-end",
      alignContent: "center",
      alignItems: "center",
      paddingVertical: 4,
      borderBottomWidth: 2,
      borderBottomColor: "#ccc",
      borderTopWidth: 2,
      borderTopColor: "#ccc",
    },

    cameraArea: {
      flex: 1,
      flexBasis: "25%",
    },

    // className="absolute bottom-4 left-0 right-0 flex flex-row justify-center items-center" style={{ backgroundColor: "transparent" }}
    cameraButton: {
      position: "absolute",
      bottom: 10,
      left: 0,
      right: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
  });
