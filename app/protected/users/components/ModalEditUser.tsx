import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, TouchableOpacity } from "react-native";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import MyButton from "@/components/ThemedButton";
import { AuthUser } from "@/types/types";
import { Store, UserRole } from "@/types/types";
import Loader from "@/components/Loader";
import { handleApiError } from "@/services/errorHandlers";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import ThemedScrollView from "@/components/ThemedScrollView";

interface ModalComponentProps {
  selectedUser: AuthUser;
  setSelectedUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  showEditModal: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const ModalEditUser: React.FC<ModalComponentProps> = ({
  showEditModal,
  onOk,
  onCancel,
  selectedUser,
  setSelectedUser,
}) => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const axiosPrivate = useAxiosPrivate();

  const fetchUserRoles = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/api/user-roles");
      console.log(response.data);
      setUserRoles(response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/api/stores");
      setStores(response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRoles();
    fetchStores();
  }, []);

  const handleStoreChange = (selectedStore: Store) => {
    if (selectedUser?.Stores.some((store) => store.storeId === selectedStore.storeId)) {
      setSelectedUser({
        ...selectedUser,
        Stores: selectedUser.Stores.filter((store) => store.storeId !== selectedStore.storeId),
      });
    } else {
      setSelectedUser({ ...selectedUser, Stores: [...selectedUser.Stores, selectedStore] });
    }
  };

  return (
    <Modal visible={showEditModal} animationType="fade" transparent={true}>
      <Loader loading={loading} />
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={styles.modalContainer}>
          <ThemedText type="title" style={styles.modalTitle}>
            Izmena korisnika
          </ThemedText>
          <ThemedView style={styles.userNameContainer}>
            <ThemedText>Korisnik:</ThemedText>
            <ThemedText>
              {selectedUser.firstName} {selectedUser.lastName}
            </ThemedText>
            <ThemedText>{selectedUser.email} </ThemedText>
          </ThemedView>
          {userRoles.length > 0 && (
            <>
              <ThemedText style={styles.textRoleUser}>Role</ThemedText>
              <ThemedScrollView style={styles.rolesContainer}>
                {userRoles.map((role) => (
                  <TouchableOpacity
                    key={role.roleId}
                    onPress={() => setSelectedUser({ ...selectedUser, UserRoles: role })}
                  >
                    <ThemedText
                      style={selectedUser.UserRoles.roleId === role.roleId ? styles.selected : styles.unselected}
                    >
                      {role.roleName}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedScrollView>
            </>
          )}

          {stores.length > 0 && (
            <>
              <ThemedText style={styles.textRoleUser}>Prodavnice</ThemedText>
              <ThemedScrollView style={styles.storesContainer}>
                {stores.map((store) => (
                  <TouchableOpacity key={store.storeId} onPress={() => handleStoreChange(store)}>
                    <ThemedText
                      style={
                        selectedUser.Stores.some((s) => s.storeId === store.storeId)
                          ? styles.selected
                          : styles.unselected
                      }
                    >
                      {store.storeName}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ThemedScrollView>
            </>
          )}

          <ThemedView style={styles.buttonsContainer}>
            <MyButton type="cancel" title="Odustni" onPress={onCancel} />
            <MyButton title="OK" onPress={onOk} />
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
    backgroundColor: "rgba(0, 0, 0, 0.8)",
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
  userNameContainer: {
    gap: 8,
    marginBottom: 20,
    textAlign: "center",
  },
  rolesContainer: {
    minHeight: 100,
    maxHeight: 300,
    gap: 8,
    marginBottom: 20,
  },
  selected: {
    fontWeight: "bold",
    fontSize: 24,
  },
  unselected: {
    color: "rgb(161 161 170)",
  },
  storesContainer: {
    minHeight: 100,
    maxHeight: 300,
    gap: 8,
    marginBottom: 20,
  },

  textRoleUser: {
    fontWeight: "bold",
    paddingBottom: 4,
    borderBottomWidth: 2,
    marginBottom: 4,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default ModalEditUser;
