import ThemedView from "@/components/ThemedView";
import ThemedTextInput from "@/components/ThemedTextInput";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { PaginationType } from "@/types/types";

const InventoryProductsSearchBar = ({
  search,
  placeHolder,
  setSearch,
  pagination,
  setPagination,
  getInventoriedProducts,
}: {
  search: string;
  placeHolder: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  pagination: PaginationType;
  setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
  getInventoriedProducts: () => void;
}) => {
  const iconColor = useThemeColor({}, "icon");

  const handleSearch = () => {
    if (pagination.page === 1) {
      getInventoriedProducts();
    } else {
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedTextInput
        style={styles.textInput}
        value={search}
        onChangeText={(text: string) => setSearch(text)}
        placeholder={placeHolder}
        autoComplete="off"
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <MaterialIcons name="search" size={36} color={iconColor} />
      </TouchableOpacity>
    </ThemedView>
  );
};

export default InventoryProductsSearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 4,
  },
  textInput: {
    flex: 1,
  },
  searchButton: {
    paddingLeft: 8,
  },
});
