import { AuthUser, InventoryProduct } from "@/types/types";
import React, { useState } from "react";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import ThemedScrollView from "@/components/ThemedScrollView";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import ThemedModal from "@/components/ThemedModal";
import ModalEditUser from "./ModalEditUser";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Toast } from "toastify-react-native";
import { handleApiError } from "@/services/errorHandlers";
import Loader from "@/components/Loader";

const UsersDataView: React.FC<{ users: AuthUser[]; getUsers: () => Promise<void> }> = ({ users, getUsers }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const iconColor = useThemeColor({}, "icon");
  const axiosPrivate = useAxiosPrivate();

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosPrivate.delete(`/api/users/${selectedUser?.userId}`);
      Toast.success(`Korisnik je uspešno obrisan`, "top");
    } catch (error) {
      handleApiError(error);
    } finally {
      setSelectedUser(null);
      setLoading(false);
      getUsers();
      setShowModal(false);
    }
  };

  const handleEditUser = async () => {
    setLoading(true);
    try {
      console.log(selectedUser)
      await axiosPrivate.put(`/api/users/${selectedUser?.userId}`, selectedUser)
      Toast.success(`Korisnik je uspešno izmenjen`, "top");
    } catch (error) {
      handleApiError(error);
    } finally {
      setSelectedUser(null);
      setLoading(false);
      getUsers();
      setShowEditModal(false);
    }
  };

  return (
    <>
      <Loader loading={loading} />
      <ThemedScrollView>
        {users.length > 0 ? (
          users.map((user) => (
            <ThemedView style={styles.container} key={user.userId}>
              <ThemedView style={styles.itemData}>
                <ThemedText>
                  {user.firstName} {user.lastName}
                </ThemedText>
                <ThemedView style={styles.userData}>
                  <ThemedText>{`Rola: ${user.UserRoles.roleName}`} </ThemedText>
                </ThemedView>
              </ThemedView>
              <ThemedView style={styles.iconsContainer}>
                {user.UserRoles.roleName !== "Admin" && (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedUser(user);
                      setShowModal(true);
                    }}
                  >
                    <MaterialIcons style={styles.iconStyle} disabled={user.UserRoles.roleName === "Admin"} name={"delete"} size={50} color={iconColor} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setSelectedUser(user);
                    setShowEditModal(true);
                  }}
                >
                  <MaterialIcons style={styles.iconStyle} name={"edit"} size={50} color={iconColor} />
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          ))
        ) : (
          <ThemedText>Nema proizvoda</ThemedText>
        )}
        {selectedUser && (
          <ThemedModal
            danger = {true}
            showModal={showModal}
            onOk={handleDelete}
            onCancel={() => {
              setShowModal(false);
            }}
            title="Brisanje korisnika!"
            message={`Da li zelite da obrisete korisnika ${selectedUser?.firstName} - ${selectedUser?.lastName} - ${selectedUser?.UserRoles?.roleName}?`}
          />
        )}
        {selectedUser && <ModalEditUser showEditModal={showEditModal} selectedUser={selectedUser} setSelectedUser={setSelectedUser} onCancel={() => setShowEditModal(false)} onOk={handleEditUser} />}
      </ThemedScrollView>
    </>
  );
};

export default UsersDataView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 4,
    padding: 4,
    marginVertical: 4,
    flexDirection: "row",
  },
  itemData: {
    flexBasis: "70%",
    gap: 4,
    paddingVertical: 4,
  },
  userData: {
    flexDirection: "row",
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
