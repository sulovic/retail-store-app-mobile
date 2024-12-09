import ThemedView from "@/components/ThemedView";
import ThemedTextInput from "@/components/ThemedTextInput";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { PaginationType } from "@/types/types";
const ProductSearchBar = ({
  search,
  placeHolder,
  setSearch,
  pagination,
  setPagination,
  getProducts,
}: {
  search: string;
  placeHolder: string;
  pagination: PaginationType;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setPagination: React.Dispatch<React.SetStateAction<PaginationType>>;
  getProducts: () => void;
}) => {
  const iconColor = useThemeColor({}, "icon");

  const handleSearch = () => {
    if (pagination.page === 1) {
      getProducts();
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
        <MaterialIcons name="search" size={40} color={iconColor} />
      </TouchableOpacity>
    </ThemedView>
  );
};

export default ProductSearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
  },
  textInput: {
    flex: 1,
  },
  searchButton: {
    paddingLeft: 8,
  },
});
