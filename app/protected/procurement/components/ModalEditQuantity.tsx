import React, { useEffect, useState } from "react";
import { Modal, StyleSheet } from "react-native";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import MyButton from "@/components/ThemedButton";
import { Procurement } from "@/types/types";
import ThemedTextInput from "@/components/ThemedTextInput";
import { Toast } from "toastify-react-native";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Loader from "@/components/Loader";
import { handleApiError } from "@/services/errorHandlers";

interface ModalComponentProps {
  selectedProcurementProductEdit: Procurement;
  setSelectedProcurementProductEdit: React.Dispatch<React.SetStateAction<Procurement | null>>;
  getProcurementProducts: () => void;
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalEditQuantity: React.FC<ModalComponentProps> = ({
  selectedProcurementProductEdit,
  setSelectedProcurementProductEdit,
  showEditModal,
  setShowEditModal,
  getProcurementProducts,
}) => {
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    if (selectedProcurementProductEdit) {
      setQuantity(selectedProcurementProductEdit.productQuantity.toString());
    }
  }, [selectedProcurementProductEdit]);

  const handleSubmit = async () => {
    if (!selectedProcurementProductEdit) {
      Toast.error(`Nije odabran proizvod`, "top");
      setShowEditModal(false);
      return;
    }

    if (!quantity || !/^\d+(\.\d{1,2})?$/.test(quantity) || parseFloat(quantity) <= 0) {
      Toast.error(`Nije uneta ispravna kolicina`, "top");
      return;
    }

    try {
      setLoading(true);
      const updatedProcurementProduct: Procurement = await axiosPrivate.put(
        `/api/procurements/${selectedProcurementProductEdit.procurementId}`,
        {
          procurementId: selectedProcurementProductEdit.procurementId,
          productQuantity: parseFloat(parseFloat(quantity).toFixed(2)),
        }
      );
      Toast.success(`Kolicina je uspešno izmenjena`, "top");
    } catch (error) {
      handleApiError(error);
    } finally {
      setShowEditModal(false);
      setSelectedProcurementProductEdit(null);
      setLoading(false);
      getProcurementProducts();
    }
  };

  return (
    <Modal visible={showEditModal} animationType="fade" transparent={true}>
      <Loader loading={loading} />
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={styles.modalContainer}>
          <ThemedText type="title" style={styles.modalTitle}>
            Izmena količine
          </ThemedText>
          <ThemedView style={styles.productContainer}>
            <ThemedText>Proizvod: {selectedProcurementProductEdit.Products.productName}</ThemedText>
            <ThemedText>Barcode: {selectedProcurementProductEdit.Products.productBarcode}</ThemedText>

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
          </ThemedView>

          <ThemedView style={styles.buttonsContainer}>
            <MyButton type="cancel" title="Odustni" onPress={() => setShowEditModal(false)} />
            <MyButton title="OK" onPress={handleSubmit} />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

export default ModalEditQuantity;

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
