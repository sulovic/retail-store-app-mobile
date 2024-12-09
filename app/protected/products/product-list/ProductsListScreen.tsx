import React, { useState, useEffect } from "react";
import { Product } from "@/types/types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { handleApiError } from "@/services/errorHandlers";
import { ScrollView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import ProductsView from "../components/ProductsView";
import { PaginationType } from "@/types/types";
import generateApiParams from "@/services/generateApiParams";
import Pagination from "@/components/Pagination";
import ProductSearchBar from "../components/ProductSearchBar";
import ThemedModal from "@/components/ThemedModal";
import Loader from "@/components/Loader";
import Toast from "toastify-react-native";
import ModalEditProduct from "../components/ModalEditProduct";

const ProductsListScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    limit: 25,
    count: 0,
  });
  const [selectedProductDelete, setSelectedProductDelete] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedProductEdit, setSelectedProductEdit] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  const getProducts = async () => {
    try {
      setLoading(true);
      const apiParams: string = generateApiParams({ search, pagination });
      const products: { data: Product[] } = await axiosPrivate.get(`/api/products${apiParams}`);
      setProducts(products.data);
      const productsCount: { data: { count: number } } = await axiosPrivate.get(`/api/products/count${apiParams}`);
      setPagination({ ...pagination, count: productsCount.data.count });
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [pagination.page, pagination.limit]);

  const handleEditProduct = (product: Product) => {
    setSelectedProductEdit(product);
    setShowEditModal(true);
  };

  const handleEditProductOK = async (updatedProduct: Product) => {
    if (!updatedProduct?.productPrice || updatedProduct?.productPrice <= 0 || isNaN(updatedProduct?.productPrice)) {
      Toast.error(`Nije uneta ispravna cena`, "top");
      return;
    }

    try {
      setLoading(true);
      await axiosPrivate.put(`/api/products/${updatedProduct?.productId}`, updatedProduct);
      Toast.success(`Proizvod je uspešno izmenjen`, "top");
    } catch (error) {
      handleApiError(error);
    } finally {
      setShowEditModal(false);
      setSelectedProductEdit(null);
      setLoading(false);
      getProducts();
    }
  };
  const handleDeleteProduct = (product: Product) => {
    setSelectedProductDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteProductOK = async () => {
    try {
      setLoading(true);
      await axiosPrivate.delete(`/api/products/${selectedProductDelete?.productId}`);
      Toast.success(`Proizvod je uspešno obrisan`, "top");
    } catch (error) {
      handleApiError(error);
    } finally {
      setShowDeleteModal(false);
      setSelectedProductDelete(null);
      setLoading(false);
      getProducts();
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Pregled proizvoda", animation: "slide_from_right" }} />
      <Loader loading={loading} />
      <ProductSearchBar
        search={search}
        setSearch={setSearch}
        placeHolder="Naziv / Barcode"
        getProducts={getProducts}
        pagination={pagination}
        setPagination={setPagination}
      />
      <ScrollView style={styles.scrollContainer}>
        <ProductsView
          products={products}
          handleEditProduct={handleEditProduct}
          handleDeleteProduct={handleDeleteProduct}
        />
      </ScrollView>
      <Pagination pagination={pagination} setPagination={setPagination} />
      <ThemedModal
        danger={true}
        showModal={showDeleteModal}
        onOk={handleDeleteProductOK}
        onCancel={() => setShowDeleteModal(false)}
        title="Potvrda brisanja"
        message={`Da li ste sigurni da zelite da obrisete proizvod ${selectedProductDelete?.productName}`}
      />
      {selectedProductEdit && (
        <ModalEditProduct
          selectedProductEdit={selectedProductEdit}
          setSelectedProductEdit={setSelectedProductEdit}
          showEditModal={showEditModal}
          onOk={handleEditProductOK}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedProductEdit(null);
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    borderTopWidth: 2,
    padding: 4,
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ProductsListScreen;
