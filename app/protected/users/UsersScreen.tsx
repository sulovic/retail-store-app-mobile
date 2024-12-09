import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Loader from "@/components/Loader";
import { handleApiError } from "@/services/errorHandlers";
import { AuthUser } from "@/types/types";
import UsersDataView from "./components/UsersDataView";
import MyButton from "@/components/ThemedButton";
import ModalNewUser from "./components/ModalNewUser";
import { StyleSheet } from "react-native";

const UsersScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [showNewUserModal, setShowNewUserModal] = useState<boolean>(false);

  const axiosPrivate = useAxiosPrivate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "Korisnici", animation: "slide_from_right" }} />
      <Loader loading={loading} />
      <ThemedView style={styles.container}>
        <ThemedView style={styles.headerBlock}>
          <ThemedText type="title">Pregled korisnika</ThemedText>
          <MyButton title="Nov korisnik" onPress={() => setShowNewUserModal(true)} />
        </ThemedView>

        {users && <UsersDataView users={users} getUsers={fetchUsers} />}
      </ThemedView>
      <ModalNewUser showNewUserModal={showNewUserModal} setShowNewUserModal={setShowNewUserModal} fetchUsers={fetchUsers} />
    </>
  );
};

export default UsersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    gap: 8,

  },
  headerBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
});
