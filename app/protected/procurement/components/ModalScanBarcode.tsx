import React, { useState } from "react";
import { Modal, StyleSheet } from "react-native";
import ThemedView from "@/components/ThemedView";
import { CameraView, useCameraPermissions, BarcodeScanningResult } from "expo-camera";
import ThemedText from "@/components/ThemedText";
import MyButton from "@/components/ThemedButton";

interface ModalComponentProps {
  showScanModal: boolean;
  getProducts: (searchText: string) => void;
  setShowScanModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalScanBarcode: React.FC<ModalComponentProps> = ({ showScanModal, setShowScanModal, getProducts }) => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState<boolean>(false);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (!scanned) {
      setScanned(true);
      setShowScanModal(false);
      getProducts(result.data);
    }
  };

  return (
    <Modal visible={showScanModal} animationType="fade" transparent={true}>
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={styles.modalContainer}>
          {cameraPermission && !cameraPermission.granted ? (
            <ThemedView>
              <ThemedText>Potrebna su prava pristupa kameri</ThemedText>
              <MyButton onPress={requestCameraPermission} title="Odobri pristup kameri" />
            </ThemedView>
          ) : (
            <ThemedView style={styles.cameraArea}>
              <CameraView
                style={styles.camera}
                barcodeScannerSettings={{
                  barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "qr", "code39", "code128"],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              >
                <ThemedView style={styles.cameraButton}>
                  <MyButton
                    title={"Zatvori"}
                    onPress={() => {
                      setScanned(false);
                      setShowScanModal(false);
                    }}
                  />
                </ThemedView>
              </CameraView>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

export default ModalScanBarcode;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    borderWidth: 2,
    padding: 20,
    borderRadius: 10,
    maxHeight: 300,
    minHeight: 300,
    width: "80%",
  },
  cameraArea: {
    flex: 1,
  },
  camera: {
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
