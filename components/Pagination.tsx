import ThemedView from "./ThemedView";
import ThemedText from "./ThemedText";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { PaginationType } from "@/types/types";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

const Pagination = ({ pagination, setPagination }: { pagination: PaginationType; setPagination: React.Dispatch<React.SetStateAction<PaginationType>> }) => {
  const iconColor = useThemeColor({}, "icon");
  
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="defaultSemiBold">Strana</ThemedText>
      <TouchableOpacity style={styles.arrow} onPress={() => setPagination({ ...pagination, page: pagination.page - 1 })} disabled={pagination.page === 1 ? true : false}>
        <MaterialIcons name="chevron-left" size={36} color={iconColor} />
      </TouchableOpacity>
      <ThemedText type="defaultSemiBold">{pagination.page}</ThemedText>
      <TouchableOpacity style={styles.arrow} onPress={() => setPagination({ ...pagination, page: pagination.page + 1 })} disabled={pagination.page === Math.ceil(pagination.count / pagination.limit) ? true : false}>
        <MaterialIcons name="chevron-right" size={36} color={iconColor} />
      </TouchableOpacity>
      <ThemedText type="defaultSemiBold">od   {Math.ceil(pagination.count / pagination.limit)}</ThemedText>
    </ThemedView>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 2,
    paddingVertical: 4,
  },
  arrow: {
    paddingHorizontal: 4,
  },
});
