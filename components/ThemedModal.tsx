import React from "react";
import { Modal, StyleSheet } from "react-native";
import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText";
import MyButton from "./ThemedButton";

interface ModalComponentProps {
  showModal: boolean;
  onOk: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

const ThemedModal: React.FC<ModalComponentProps> = ({ showModal, onOk, onCancel, title, message }) => {
  return (
    <Modal visible={showModal} animationType="fade" transparent={true}>
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={styles.modalContainer}>
          <ThemedText type="title" style={styles.modalTitle}>{title}</ThemedText>
          <ThemedText style={styles.modalMessage}>{message}</ThemedText>
          <ThemedView style={styles.buttonsContainer}>
            <MyButton type="cancel" title="Odustni" onPress={onCancel} />
            <MyButton title="OK"  onPress={onOk} />
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
  modalMessage: {
    marginBottom: 20,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ThemedModal;
