import React, { useEffect, useState } from "react";
import { Modal, StyleSheet } from "react-native";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import MyButton from "@/components/ThemedButton";
import ThemedTextInput from "@/components/ThemedTextInput";
import { Product } from "@/types/types";
import { Toast } from "toastify-react-native";

interface ModalComponentProps {
  selectedProductEdit: Product;
  setSelectedProductEdit: React.Dispatch<React.SetStateAction<Product | null>>;
  showEditModal: boolean;
  onOk: (updatedProduct: Product) => void;
  onCancel: () => void;
}

const ModalEditProduct: React.FC<ModalComponentProps> = ({
  showEditModal,
  onOk,
  onCancel,
  selectedProductEdit,
  setSelectedProductEdit,
}) => {
  const [price, setPrice] = useState<string>("");

  useEffect(() => {
    setPrice(selectedProductEdit.productPrice.toString());
  }, [selectedProductEdit]);

  const handleSubmit = () => {
    if (!price || !/^\d+(\.\d{1,2})?$/.test(price) || parseFloat(price) <= 0) {
      Toast.error(`Nije uneta ispravna cena`, "top");
      return;
    }

    const updatedProduct = {
      ...selectedProductEdit,
      productPrice: parseFloat(parseFloat(price).toFixed(2)),
    };

    setSelectedProductEdit({
      ...selectedProductEdit,
      productPrice: parseFloat(parseFloat(price).toFixed(2)),
    });
    onOk(updatedProduct);
  };

  return (
    <Modal visible={showEditModal} animationType="fade" transparent={true}>
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={styles.modalContainer}>
          <ThemedText type="title" style={styles.modalTitle}>
            Izmena proizvoda
          </ThemedText>
          <ThemedView style={styles.productContainer}>
            <ThemedView style={styles.priceQuantityContainer}>
              <ThemedText>Naziv</ThemedText>

              <ThemedTextInput
                style={styles.priceQuantityInput}
                value={selectedProductEdit.productName}
                onChangeText={(text: string) => setSelectedProductEdit({ ...selectedProductEdit, productName: text })}
                placeholder="Naziv proizvoda"
                autoComplete="off"
              />
            </ThemedView>
            <ThemedView style={styles.priceQuantityContainer}>
              <ThemedText>Barcode</ThemedText>
              <ThemedTextInput
                style={styles.priceQuantityInput}
                value={selectedProductEdit.productBarcode}
                onChangeText={(text: string) =>
                  setSelectedProductEdit({ ...selectedProductEdit, productBarcode: text })
                }
                placeholder="Barcode"
                autoComplete="off"
              />
            </ThemedView>
            <ThemedView style={styles.priceQuantityContainer}>
              <ThemedText>Cena</ThemedText>
              <ThemedTextInput
                style={styles.priceQuantityInput}
                value={price}
                onChangeText={(text) => setPrice(text)}
                keyboardType="decimal-pad"
                autoComplete="off"
              />
              <ThemedText>RSD</ThemedText>
            </ThemedView>
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
    height: 250,
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

export default ModalEditProduct;
