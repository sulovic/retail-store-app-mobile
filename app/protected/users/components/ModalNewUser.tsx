import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, TouchableOpacity } from "react-native";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedTextInput from "@/components/ThemedTextInput";
import MyButton from "@/components/ThemedButton";
import { AuthUser } from "@/types/types";
import { Store, UserRole } from "@/types/types";
import Loader from "@/components/Loader";
import { handleApiError } from "@/services/errorHandlers";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import ThemedScrollView from "@/components/ThemedScrollView";
import { Toast } from "toastify-react-native";
import { set } from "date-fns";

interface ModalComponentProps {
  showNewUserModal: boolean;
  setShowNewUserModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUsers: () => void;
}

const ModalNewUser: React.FC<ModalComponentProps> = ({ showNewUserModal, setShowNewUserModal, fetchUsers }) => {
  const blankUser = {
    firstName: "",
    lastName: "",
    email: "",
    UserRoles: {
      roleId: 1001,
      roleName: "Seller",
    },
    Stores: [],
  };
  const [newUser, setNewUser] = useState<Omit<AuthUser, "userId">>(blankUser);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const axiosPrivate = useAxiosPrivate();

  const fetchUserRoles = async () => {
    setLoading(true);
    try {
      const response: { data: UserRole[] } = await axiosPrivate.get("/api/user-roles");
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
      const response: { data: Store[] } = await axiosPrivate.get("/api/stores");
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

  const handleAddUser = async () => {
    setLoading(true);
    try {
      const response: { data: AuthUser } = await axiosPrivate.post("/api/users", newUser);
      Toast.success(`Korisnik ${response.data.firstName} ${response.data.lastName} je uspešno dodat`, "top");
    } catch (error) {
      handleApiError(error);
    } finally {
      setShowNewUserModal(false);
      setNewUser(blankUser);
      fetchUsers();
      setLoading(false);
    }
  };

  const handleStoreChange = (selectedStore: Store) => {
    if (newUser?.Stores.some((store) => store.storeId === selectedStore.storeId)) {
      setNewUser({
        ...newUser,
        Stores: newUser.Stores.filter((store) => store.storeId !== selectedStore.storeId),
      });
    } else {
      setNewUser({ ...newUser, Stores: [...newUser.Stores, selectedStore] });
    }
  };

  return (
    <Modal visible={showNewUserModal} animationType="fade" transparent={true}>
      <Loader loading={loading} />
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={styles.modalContainer}>
          <ThemedText type="title" style={styles.modalTitle}>
            Dodavanje korisnika
          </ThemedText>
          <ThemedView style={styles.userNameContainer}>
            <ThemedTextInput
              placeholder="Ime"
              placeholderTextColor="#a1a1aa"
              value={newUser.firstName}
              onChangeText={(text) => setNewUser({ ...newUser, firstName: text })}
            />
            <ThemedTextInput
              placeholder="Prezime"
              placeholderTextColor="#a1a1aa"
              value={newUser.lastName}
              onChangeText={(text) => setNewUser({ ...newUser, lastName: text })}
            />
            <ThemedTextInput
              placeholder="Email"
              placeholderTextColor="#a1a1aa"
              value={newUser.email}
              onChangeText={(text) => setNewUser({ ...newUser, email: text })}
            />
          </ThemedView>
          {userRoles.length > 0 && (
            <>
              <ThemedText style={styles.textRoleUser}>Role</ThemedText>
              <ThemedScrollView style={styles.rolesContainer}>
                {userRoles.map((role) => (
                  <TouchableOpacity key={role.roleId} onPress={() => setNewUser({ ...newUser, UserRoles: role })}>
                    <ThemedText style={newUser.UserRoles.roleId === role.roleId ? styles.selected : styles.unselected}>
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
                        newUser.Stores.some((s) => s.storeId === store.storeId) ? styles.selected : styles.unselected
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
            <MyButton
              type="cancel"
              title="Odustni"
              onPress={() => {
                setShowNewUserModal(false);
                setNewUser(blankUser);
              }}
            />
            <MyButton
              disabled={!newUser.firstName || !newUser.lastName || !newUser.email}
              title="OK"
              onPress={handleAddUser}
            />
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

export default ModalNewUser;
