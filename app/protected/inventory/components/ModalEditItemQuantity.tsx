import React, { useState, useEffect } from "react";
import { Modal, StyleSheet } from "react-native";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import MyButton from "@/components/ThemedButton";
import { InventoryProduct } from "@/types/types";
import ThemedTextInput from "@/components/ThemedTextInput";
import { Toast } from "toastify-react-native";

interface ModalComponentProps {
  editPrice: boolean;
  selectedInventoryProduct: InventoryProduct;
  setSelectedInventoryProduct: React.Dispatch<React.SetStateAction<InventoryProduct | null>>;
  showEditModal: boolean;
  onOk: (updatedInventoryProduct: InventoryProduct) => void;
  onCancel: () => void;
}

const ModalEditItemQuantity: React.FC<ModalComponentProps> = ({
  editPrice,
  showEditModal,
  onOk,
  onCancel,
  selectedInventoryProduct,
  setSelectedInventoryProduct,
}) => {
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  useEffect(() => {
    setQuantity(selectedInventoryProduct.productQuantity.toString());
    setPrice(selectedInventoryProduct.productPrice.toString());
  }, [selectedInventoryProduct]);

  const handleSubmit = () => {
    if (!quantity || !/^\d+(\.\d{1,2})?$/.test(quantity) || parseFloat(quantity) <= 0) {
      Toast.error(`Nije uneta ispravna kolicina`, "top");
      return;
    }
    if (!price || !/^\d+(\.\d{1,2})?$/.test(price) || parseFloat(price) <= 0) {
      Toast.error(`Nije uneta ispravna cena`, "top");
      return;
    }

    const updatedInventoryProduct = {
      ...selectedInventoryProduct,
      productQuantity: parseFloat(parseFloat(quantity).toFixed(2)),
      productPrice: parseFloat(parseFloat(price).toFixed(2)),
    };

    setSelectedInventoryProduct({
      ...selectedInventoryProduct,
      productQuantity: parseFloat(parseFloat(quantity).toFixed(2)),
      productPrice: parseFloat(parseFloat(price).toFixed(2)),
    });
    onOk(updatedInventoryProduct);
  };

  return (
    <Modal visible={showEditModal} animationType="fade" transparent={true}>
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={styles.modalContainer}>
          <ThemedText type="title" style={styles.modalTitle}>
            Izmena količine
          </ThemedText>
          <ThemedView style={styles.productContainer}>
            <ThemedText>Proizvod: {selectedInventoryProduct.Products.productName}</ThemedText>
            <ThemedView style={styles.priceQuantityContainer}>
              <ThemedTextInput
                value={quantity}
                style={styles.priceQuantityInput}

                onChangeText={(text) => setQuantity(text)}
                keyboardType="decimal-pad"
                autoComplete="off"
              />
              <ThemedText>kom</ThemedText>
            </ThemedView>
           {editPrice && <ThemedView style={styles.priceQuantityContainer}>
              <ThemedTextInput
                style={styles.priceQuantityInput}
                value={price}
                onChangeText={(text) => setPrice(text)}
                keyboardType="decimal-pad"
                autoComplete="off"
              />
              <ThemedText>RSD</ThemedText>
            </ThemedView>}
          </ThemedView>

          <ThemedView style={styles.buttonsContainer}>
            <MyButton type="cancel" title="Odustni" onPress={onCancel} />
            <MyButton title="OK" onPress={handleSubmit} />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    borderWidth: 2,
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    marginBottom: 10,
    paddingBottom: 10,
    textAlign: "center",
    borderBottomWidth: 2,
  },
  productContainer: { 
    height: 150,
    gap: 8,
    marginBottom: 20,
    textAlign: "center",
  },
  priceQuantityContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priceQuantityInput: {
    flex: 1,
    textAlign: "right",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ModalEditItemQuantity;
