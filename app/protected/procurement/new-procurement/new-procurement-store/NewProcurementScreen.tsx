import React, { useState, useEffect } from "react";
import ThemedText from "@/components/ThemedText";
import { Procurement, Product } from "@/types/types";
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
import ThemedModal from "@/components/ThemedModal";
import Toast from "toastify-react-native";
import ThemedTextInput from "@/components/ThemedTextInput";
import generateApiParams from "@/services/generateApiParams";
import ModalScanBarcode from "../../components/ModalScanBarcode";
import ThemedButton from "@/components/ThemedButton";
import ModalEditQuantity from "../../components/ModalEditQuantity";

const NewProcurementScreen = () => {
  const [loading, setLoading] = useState(false);
  const [procurementProducts, setProcurementProducts] = useState<Procurement[]>([]);
  const { storeId, storeName }: { storeId: string; storeName: string } = useLocalSearchParams();
  const [selectedProcurementProductDelete, setSelectedProcurementProductDelete] = useState<Procurement | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedProcurementProductEdit, setSelectedProcurementProductEdit] = useState<Procurement | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showScanModal, setShowScanModal] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedNewProduct, setSelectedNewProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [textInputValue, setTextInputValue] = useState<string>("");
  const axiosPrivate = useAxiosPrivate();
  const iconColor = useThemeColor({}, "icon");

  const getProcurementProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosPrivate.get(
        `/api/procurements?storeId=${storeId}&sortBy=procurementId&sortOrder=desc`
      );
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
      setProducts([]);
      setTextInputValue("");
      setQuantity("");
    }
  }, [storeId]);

  const getProducts = async (searchText: string) => {
    try {
      setLoading(true);
      const apiParams: string = generateApiParams({ search: searchText, pagination: { page: 1, limit: 25 } });
      const products: { data: Product[] } = await axiosPrivate.get(`/api/products${apiParams}`);

      //filter to remove products that are already in the procurement
      const filteredProducts = products.data.filter(
        (product) => !procurementProducts.some((procurement) => procurement.Products.productId === product.productId)
      );
      setProducts(filteredProducts);

      console.log(filteredProducts.length);

      if (filteredProducts.length === 1) {
        setSelectedNewProduct(filteredProducts[0]);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axiosPrivate.delete(`/api/procurements/${selectedProcurementProductDelete?.procurementId}`);
      await getProcurementProducts();
      Toast.success(`Proizvod uspešno obrisan`, "top");
    } catch (error) {
      handleApiError(error);
    } finally {
      setSelectedProcurementProductDelete(null);
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleAddProcuct = async () => {
    if (!selectedNewProduct) {
      Toast.error(`Morate izabrati proizvod`, "top");
      return;
    }

    if (!quantity || !/^\d+(\.\d{1,2})?$/.test(quantity) || parseFloat(quantity) <= 0) {
      Toast.error(`Nije uneta ispravna kolicina`, "top");
      return;
    }

    try {
      setLoading(true);
      await axiosPrivate.post(`/api/procurements`, {
        storeId: parseInt(storeId),
        productId: selectedNewProduct?.productId,
        productQuantity: parseFloat(parseFloat(quantity).toFixed(2)),
      });
      await getProcurementProducts();
      Toast.success(`Proizvod uspešno dodat`, "top");
    } catch (error) {
      handleApiError(error);
    } finally {
      setSelectedNewProduct(null);
      setTextInputValue("");
      setProducts([]);
      setQuantity("");
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: `Unos trebovanja: ${storeName} `, animation: "slide_from_right" }} />
      <Loader loading={loading} />
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">Pronađi i izaberi proizvod</ThemedText>
        <ThemedView style={styles.searchContainer}>
          <ThemedTextInput
            style={styles.textInput}
            value={textInputValue}
            onChangeText={(text: string) => setTextInputValue(text)}
            placeholder={"Naziv/Barcode"}
            autoComplete="off"
          />
          <TouchableOpacity
            onPress={() => {
              setShowScanModal(true);
            }}
          >
            <MaterialIcons name={"qr-code-scanner"} size={40} color={iconColor} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              getProducts(textInputValue);
            }}
          >
            <MaterialIcons name={"search"} size={40} color={iconColor} />
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.searchProductsConainer}>
          <ThemedText style={styles.productListTitle} type="subtitle">
            Lista proizvoda
          </ThemedText>
          <ThemedScrollView>
            {products.length > 0
              ? products.map((product) => (
                  <TouchableOpacity
                    onPress={() => setSelectedNewProduct(product)}
                    style={styles.productContainer}
                    key={product.productId}
                  >
                    <ThemedView style={styles.productTextContainer}>
                      <ThemedText
                        style={[
                          product.productId === selectedNewProduct?.productId ? styles.selectedProduct : undefined,
                        ]}
                      >
                        {product.productName}
                      </ThemedText>
                      <ThemedText
                        style={[
                          product.productId === selectedNewProduct?.productId ? styles.selectedProduct : undefined,
                        ]}
                      >
                        {product.productBarcode}
                      </ThemedText>
                    </ThemedView>
                  </TouchableOpacity>
                ))
              : !loading && <ThemedText>Pretražite proizvode...</ThemedText>}
          </ThemedScrollView>
        </ThemedView>

        <ThemedView style={styles.quantityContainer}>
          <ThemedTextInput
            style={styles.textInput}
            value={quantity}
            onChangeText={(text: string) => setQuantity(text)}
            keyboardType="decimal-pad"
            placeholder={"kom"}
            autoComplete="off"
          />
          <ThemedButton title={"Dodaj"} onPress={() => handleAddProcuct()} />
        </ThemedView>

        <ThemedScrollView style={styles.procurmentProductsContainer}>
          <ThemedView style={styles.procurementProuctsHeader}>
            <ThemedText type="subtitle">Lista trebovanih proizvoda</ThemedText>
            <ThemedButton title={"Osveži"} onPress={() => getProcurementProducts()} />
          </ThemedView>

          {procurementProducts.length > 0
            ? procurementProducts.map((procurementProduct) => (
                <ThemedView style={styles.productContainer} key={procurementProduct.procurementId}>
                  <ThemedView style={styles.productTextContainer}>
                    <ThemedText>{procurementProduct.Products.productName}</ThemedText>
                    <ThemedText>
                      {procurementProduct.Products.productBarcode} - {procurementProduct.productQuantity} kom
                    </ThemedText>
                  </ThemedView>

                  <ThemedView style={styles.iconsContainer}>
                    {procurementProduct.completed !== null && (
                      <MaterialIcons
                        name={procurementProduct.completed ? "check" : "close"}
                        size={40}
                        color={procurementProduct.completed ? "green" : "red"}
                      />
                    )}
                    {procurementProduct.completed === null && (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedProcurementProductDelete(procurementProduct);
                            setShowDeleteModal(true);
                          }}
                        >
                          <MaterialIcons name={"delete"} size={40} color={iconColor} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedProcurementProductEdit(procurementProduct);
                            setShowEditModal(true);
                          }}
                        >
                          <MaterialIcons name={"edit"} size={40} color={iconColor} />
                        </TouchableOpacity>
                      </>
                    )}
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
      <ModalScanBarcode showScanModal={showScanModal} setShowScanModal={setShowScanModal} getProducts={getProducts} />
      {selectedProcurementProductEdit && (
        <ModalEditQuantity
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          selectedProcurementProductEdit={selectedProcurementProductEdit}
          setSelectedProcurementProductEdit={setSelectedProcurementProductEdit}
          getProcurementProducts={getProcurementProducts}
        />
      )}
      <ThemedModal
        danger={true}
        showModal={showDeleteModal}
        onOk={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        title="Brisanje proizvoda"
        message={`Da li ste sigurni da zelite da obrisete proizvod ${selectedProcurementProductDelete?.Products.productName} - ${selectedProcurementProductDelete?.productQuantity} kom?`}
      />
    </>
  );
};

export default NewProcurementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
  },
  searchProductsConainer: {
    borderTopWidth: 2,
    minHeight: 250,
    maxHeight: 250,
    marginVertical: 8,
    borderBottomWidth: 2,
    paddingBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 4,
  },
  procurmentProductsContainer: {
    flex: 1,
    borderTopWidth: 2,
    marginTop: 4,
  },
  procurementProuctsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
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
  selectedProduct: {
    fontSize: 22,
    fontWeight: "bold",
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
});
