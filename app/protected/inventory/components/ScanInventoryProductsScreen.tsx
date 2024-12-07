import React, { useState, useEffect } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import MyButton from "@/components/ThemedButton";
import { InventoryProduct, Product, NewInventoryProduct } from "@/types/types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { handleApiError } from "@/services/errorHandlers";
import InventoryProductsView from "./InventoryProductsView";
import { StyleSheet } from "react-native";
import { Toast } from "toastify-react-native";
import useAuth from "@/hooks/useAuth";
import Loader from "@/components/Loader";

const ScanInventoryProductsScreen = () => {
  const [scanned, setScanned] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [inventoriedProducts, setInventoriedProducts] = useState<InventoryProduct[]>([]);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const { authUser } = useAuth();

  const axiosPrivate = useAxiosPrivate();

  const { id, store, date, editPrice }: { id: string; store: string; date: string; editPrice?: string } =
    useLocalSearchParams();
  const parsedEditPrice = editPrice === "true" || false;

  const getProduct = async (barCode: string) => {
    setLoading(true);
    try {
      const products: { data: Product[] } = await axiosPrivate.get(`/api/products?productBarcode=${barCode}`);
      if (products.data.length !== 1) {
        Toast.error(`Proizvod nije pronađen`, "top");
        return;
      }
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
      const products: { data: InventoryProduct[] } = await axiosPrivate.get(
        `/api/inventory-products?inventoryId=${id}&limit=20&sortBy=inventoryProductId&sortOrder=desc`
      );
      setInventoriedProducts(products.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getInventoriedProducts();
    }
  }, [id]);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (!scanned) {
      setScanned(true);
      getProduct(result.data);
    }
  };

  const handleAddProduct = async () => {
    setLoading(true);
    try {
      if (!scannedProduct) {
        Toast.error(`Nije skeniran proizvod`, "top");
        return;
      }

      if (!quantity || !/^\d+(\.\d{1,2})?$/.test(quantity) || parseFloat(quantity) <= 0) {
        Toast.error(`Nije uneta ispravna kolicina`, "top");
        setQuantity("");
        return;
      }

      if (!id) {
        Toast.error(`Nije odabran popis`, "top");
        return;
      }

      if (!authUser) {
        Toast.error(`Niste prijavljeni`, "top");
        return;
      }
      const newInventoryProduct: NewInventoryProduct = {
        inventoryId: parseInt(id as string),
        productPrice: scannedProduct?.productPrice,
        productQuantity: parseFloat(parseFloat(quantity).toFixed(2)),
        productId: scannedProduct?.productId,
        userId: authUser?.userId,
      };
      const addedProduct: { data: InventoryProduct } = await axiosPrivate.post(
        `/api/inventory-products`,
        newInventoryProduct
      );
      Toast.success(`Proizvod je dodat`, "top");
      setScannedProduct(null);
      setQuantity("");
      setScanned(false);
      getInventoriedProducts();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: `Sken: ${store}: ${date}`, animation: "slide_from_right" }} />
      <Loader loading={loading} />
      <ThemedView style={styles.container}>
        {cameraPermission && !cameraPermission.granted ? (
          <ThemedView>
            <ThemedText>Potrebna su prava pristupa kameri</ThemedText>
            <MyButton onPress={requestCameraPermission} title="Odobri pristup kameri" />
          </ThemedView>
        ) : (
          <>
            <ThemedView style={styles.scannedProductsList}>
              <InventoryProductsView
                editPrice={parsedEditPrice}
                inventoriedProducts={inventoriedProducts}
                getInventoriedProducts={getInventoriedProducts}
              />
            </ThemedView>
            <ThemedView style={styles.scannedProduct}>
              <ThemedView style={styles.scannedProductText}>
                {scannedProduct && <ThemedText>{scannedProduct?.productName}</ThemedText>}
                {scannedProduct && <ThemedText>{scannedProduct?.productPrice} RSD</ThemedText>}
              </ThemedView>
              <ThemedView style={styles.scannedProductQtyButton}>
                <ThemedTextInput
                  value={quantity}
                  onChangeText={(value) => setQuantity(value)}
                  style={{ maxWidth: 80 }}
                  keyboardType="decimal-pad"
                  autoComplete="off"
                />

                <MyButton title={"Dodaj"} onPress={handleAddProduct} />
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.cameraArea}>
              <CameraView
                style={{ flex: 1 }}
                barcodeScannerSettings={{
                  barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr", "code39", "code128"],
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

export default ScanInventoryProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 4,
  },
  scannedProductsList: {
    height: 250,
    paddingBottom: 4,
  },
  scannedProduct: {
    height: 120,
    gap: 4,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 2,
    borderBottomColor: "#ccc",
    borderTopWidth: 2,
    borderTopColor: "#ccc",
  },
  scannedProductText: {
    flex: 1,
    wordWrap: "break-word",
    flexWrap: "wrap",
    paddingHorizontal: 4,
  },
  scannedProductQtyButton: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  cameraArea: {
    flex: 1,
  },
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
