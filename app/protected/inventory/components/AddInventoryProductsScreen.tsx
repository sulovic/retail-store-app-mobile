import React, { useState, useEffect } from "react";
import ThemedText from "@/components/ThemedText";
import { Stack, useLocalSearchParams } from "expo-router";
import ThemedView from "@/components/ThemedView";
import { StyleSheet } from "react-native";
import { Product, NewInventoryProduct, InventoryProduct, PaginationType } from "@/types/types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Loader from "@/components/Loader";
import { handleApiError } from "@/services/errorHandlers";
import generateApiParams from "@/services/generateApiParams";
import InventoryProductsSearchBar from "./InventoryProductsSearchBar";
import { TouchableOpacity } from "react-native";
import ThemedScrollView from "@/components/ThemedScrollView";
import ThemedTextInput from "@/components/ThemedTextInput";
import MyButton from "@/components/ThemedButton";
import { Toast } from "toastify-react-native";
import { useRouter } from "expo-router";
import useAuth from "@/hooks/useAuth";
import InventoryProductsView from "./InventoryProductsView";

const AddInventoryProductsScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [inventoriedProducts, setInventoriedProducts] = useState<InventoryProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [pagination, setPagination] = useState<PaginationType>({ page: 1, limit: 25, count: 0 });
  const router = useRouter();
  const { authUser } = useAuth();

  const { id, store, date, editPrice }: { id: string; store: string; date: string; editPrice?: string } =
    useLocalSearchParams();
  const parsedEditPrice = editPrice === "true" || false;

  const axiosPrivate = useAxiosPrivate();

  const getProducts = async () => {
    try {
      setLoading(true);
      const apiParams: string = generateApiParams({ search, pagination });
      const products: { data: Product[] } = await axiosPrivate.get(`/api/products${apiParams}`);
      setProducts(products.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setSelectedProduct(null);
      setQuantity("");
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
      setProducts([]);
      setSearch("");
      setSelectedProduct(null);
      getInventoriedProducts();
    }
  }, [id]);

  const handleAddProduct = async () => {
    if (!selectedProduct) {
      Toast.error(`Nije odabran proizvod`, "top");
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
      productPrice: selectedProduct?.productPrice,
      productQuantity: parseFloat(parseFloat(quantity).toFixed(2)),
      productId: selectedProduct?.productId,
      userId: authUser?.userId,
    };
    try {
      setLoading(true);
      const addedProduct: { data: InventoryProduct } = await axiosPrivate.post(
        `/api/inventory-products`,
        newInventoryProduct
      );
      Toast.success(`Proizvod je uspešno dodat`, "top");
      setQuantity("");
      setSelectedProduct(null);
      setSearch("");
      setProducts([]);
      getInventoriedProducts();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: `Dodaj: ${store}: ${date}`, animation: "slide_from_right" }} />
      <Loader loading={loading} />
      <ThemedView style={styles.container}>
        <ThemedText>Pronađi i izaberi proizvod</ThemedText>
        <InventoryProductsSearchBar
          placeHolder="Naziv / Barcode"
          search={search}
          pagination={pagination}
          setPagination={setPagination}
          setSearch={setSearch}
          getInventoriedProducts={getProducts}
        />

        <ThemedText>Proizvodi:</ThemedText>
        <ThemedScrollView style={styles.productsContainer}>
          {products && products.length > 0 ? (
            products.map((product) => (
              <ThemedView key={product.productId} style={styles.productDataContainer}>
                <TouchableOpacity onPress={() => setSelectedProduct(product)}>
                  <ThemedText
                    style={selectedProduct?.productId === product.productId ? styles.selectedProductText : undefined}
                  >
                    {product.productName}
                  </ThemedText>
                  <ThemedText
                    style={selectedProduct?.productId === product.productId ? styles.selectedProductText : undefined}
                  >
                    {product.productBarcode} - {product.productPrice} RSD
                  </ThemedText>
                </TouchableOpacity>
              </ThemedView>
            ))
          ) : (
            <ThemedText>Pretražite proizvode...</ThemedText>
          )}
        </ThemedScrollView>
        <ThemedView style={styles.productQuantutyButtons}>
          <ThemedView style={styles.productQuantity}>
            <ThemedText>Količina:</ThemedText>
            <ThemedTextInput
              value={quantity}
              onChangeText={(value) => setQuantity(value)}
              style={{ maxWidth: 80 }}
              keyboardType="decimal-pad"
              autoComplete="off"
            />
            <ThemedText>kom</ThemedText>
          </ThemedView>
          <ThemedView style={styles.buttons}>
            <MyButton title="Odustani" onPress={() => router.back()} type="cancel" />
            <MyButton title="Dodaj proizvod" onPress={handleAddProduct} />
          </ThemedView>
        </ThemedView>
        <ThemedScrollView style={styles.inventoriedProductsList}>
          <InventoryProductsView
            editPrice={parsedEditPrice}
            inventoriedProducts={inventoriedProducts}
            getInventoriedProducts={getInventoriedProducts}
          />
        </ThemedScrollView>
      </ThemedView>
    </>
  );
};

export default AddInventoryProductsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 4,
    gap: 8,
  },
  productsContainer: {
    gap: 4,
    minHeight: 200,
    maxHeight: 200,
  },
  productDataContainer: {
    padding: 4,
    borderWidth: 2,
    borderRadius: 4,
    margin: 4,
  },
  selectedProductText: {
    fontWeight: "bold",
    fontSize: 22,
  },
  productQuantutyButtons: {
    marginTop: 16,
    gap: 16,
  },
  productQuantity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "space-between",
  },
  inventoriedProductsList: {
    flex: 1,
    marginTop: 16,
  },
});
