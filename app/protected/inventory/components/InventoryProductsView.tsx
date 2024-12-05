import { InventoryProduct } from "@/types/types";
import React, { useState } from "react";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import ThemedScrollView from "@/components/ThemedScrollView";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import ThemedModal from "@/components/ThemedModal";
import ModalEditItemQuantity from "./ModalEditItemQuantity";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Toast } from "toastify-react-native";
import { handleApiError } from "@/services/errorHandlers";
import Loader from "@/components/Loader";
import formatNumber from "@/services/formatNumber";

const InventoryProductsView: React.FC<{
  editPrice: boolean;
  inventoriedProducts: InventoryProduct[];
  getInventoriedProducts: () => Promise<void>;
}> = ({ inventoriedProducts, getInventoriedProducts, editPrice }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedInventoryProduct, setSelectedInventoryProduct] = useState<InventoryProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const iconColor = useThemeColor({}, "icon");
  const axiosPrivate = useAxiosPrivate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosPrivate.delete(`/api/inventory-products/${selectedInventoryProduct?.inventoryProductId}`);
      Toast.success(`Proizvod uspešno obrisan`, "top");
      await getInventoriedProducts();
    } catch (error) {
      handleApiError(error);
    } finally {
      setSelectedInventoryProduct(null);
      setLoading(false);
      setShowModal(false);
    }
  };

  const handleEditQuantityPrice = async (updatedInventoryProduct: InventoryProduct) => {
    if (
      !updatedInventoryProduct?.productQuantity ||
      updatedInventoryProduct?.productQuantity <= 0 ||
      isNaN(updatedInventoryProduct?.productQuantity)
    ) {
      Toast.error(`Nije uneta ispravna kolicina`, "top");
      return;
    }

    if (
      !updatedInventoryProduct?.productPrice ||
      updatedInventoryProduct?.productPrice <= 0 ||
      isNaN(updatedInventoryProduct?.productPrice)
    ) {
      Toast.error(`Nije uneta ispravna cena`, "top");
      return;
    }
    try {
      setLoading(true);
      await axiosPrivate.put(`/api/inventory-products/${updatedInventoryProduct?.inventoryProductId}`, {
        inventoryProductId: updatedInventoryProduct?.inventoryProductId,
        productQuantity: updatedInventoryProduct?.productQuantity,
        productPrice: updatedInventoryProduct?.productPrice,
      });
      Toast.success(`Kolicina/Cena je uspešno promenjena`, "top");
      getInventoriedProducts();
    } catch (error) {
      handleApiError(error);
    } finally {
      setSelectedInventoryProduct(null);
      setLoading(false);
      setShowEditModal(false);
    }
  };

  return (
    <>
      <Loader loading={loading} />
      <ThemedScrollView>
        {inventoriedProducts.length > 0 ? (
          inventoriedProducts.map((inventoriedProduct) => (
            <ThemedView style={styles.container} key={inventoriedProduct.inventoryProductId}>
              <ThemedView style={styles.nameIconsContainer}>
                <ThemedView style={styles.itemData}>
                  <ThemedText>{inventoriedProduct.Products.productName}</ThemedText>
                  <ThemedText>BC: {inventoriedProduct.Products.productBarcode}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.iconsContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedInventoryProduct(inventoriedProduct);
                      setShowModal(true);
                    }}
                  >
                    <MaterialIcons style={styles.iconStyle} name={"delete"} size={50} color={iconColor} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedInventoryProduct(inventoriedProduct);
                      setShowEditModal(true);
                    }}
                  >
                    <MaterialIcons style={styles.iconStyle} name={"edit"} size={50} color={iconColor} />
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>
              <ThemedView style={styles.priceQuantity}>
                <ThemedText>
                  {`${formatNumber(inventoriedProduct.productPrice, 2)} RSD - ${formatNumber(
                    inventoriedProduct.productQuantity
                  )} kom`}
                </ThemedText>
                <ThemedText>
                  {`SUM: ${formatNumber(inventoriedProduct.productPrice * inventoriedProduct.productQuantity, 2)}`}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          ))
        ) : (
          <ThemedText>Nema proizvoda</ThemedText>
        )}

       
      </ThemedScrollView>
      {selectedInventoryProduct && (
          <ModalEditItemQuantity
            editPrice={editPrice}
            showEditModal={showEditModal}
            selectedInventoryProduct={selectedInventoryProduct}
            setSelectedInventoryProduct={setSelectedInventoryProduct}
            onCancel={() => setShowEditModal(false)}
            onOk={handleEditQuantityPrice}
          />
        )}
      {selectedInventoryProduct && (
        <ThemedModal
          showModal={showModal}
          onOk={handleDelete}
          onCancel={() => {
            setShowModal(false);
          }}
          title="Brisanje proizvoda"
          message={`Da li zelite da obrisete proizvod ${selectedInventoryProduct?.Products?.productName} - ${selectedInventoryProduct?.productQuantity} kom?`}
        />
      )}
    </>
  );
};

export default InventoryProductsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 4,
    padding: 4,
    margin: 4,
  },
  nameIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemData: {
    flexBasis: "70%",
    gap: 4,
    paddingVertical: 4,
  },
  priceQuantity: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  iconsContainer: {
    flexBasis: "30%",
    flexDirection: "row",
    gap: 4,
    justifyContent: "flex-end",
  },
  iconStyle: {
    textAlign: "center",
    padding: 4,
  },
});
