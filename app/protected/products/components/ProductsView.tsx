import { Product } from "@/types/types";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import ThemedScrollView from "@/components/ThemedScrollView";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useThemeColor } from "@/hooks/useThemeColor";
import useAuth from "@/hooks/useAuth";

const ProductsView: React.FC<{
  products: Product[];
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (product: Product) => void;
}> = ({ products, handleEditProduct, handleDeleteProduct }) => {
  const iconColor = useThemeColor({}, "icon");
  const { authUser } = useAuth();

  return (
    <>
      <ThemedScrollView style={styles.container}>
        {products.length > 0 ? (
          products.map((product, index) => (
            <ThemedView style={[styles.productContainer]} key={index}>
              <ThemedView style={styles.productInfoContainer}>
                <ThemedView style={styles.productDetails}>
                  <ThemedText>{product.productName}</ThemedText>
                  <ThemedText>BC: {product.productBarcode}</ThemedText>
                  <ThemedText>Cena: {product.productPrice} RSD</ThemedText>
                </ThemedView>
                <ThemedView style={styles.productImageContainer}>
                  <Image source={require("@/assets/images/placeholder.png")} style={styles.productImage} />
                </ThemedView>
              </ThemedView>

              {authUser && authUser?.UserRoles.roleId > 3000 && (
                <ThemedView style={styles.iconsContainer}>
                  <TouchableOpacity onPress={() => handleEditProduct(product)}>
                    <MaterialIcons name="edit" size={40} color={iconColor} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteProduct(product)}>
                    <MaterialIcons name="delete" size={40} color={iconColor} />
                  </TouchableOpacity>
                </ThemedView>
              )}
            </ThemedView>
          ))
        ) : (
          <ThemedText style={styles.noProductsText}>Nema proizvoda</ThemedText>
        )}
      </ThemedScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    borderWidth: 2,
    borderRadius: 4,
    padding: 4,
    gap: 8,
  },
  productInfoContainer: {
    flexDirection: "row",
    flex: 1,
    gap: 8,
    marginBottom: 8,
  },
  productDetails: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  productImageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 80,
  },
  iconsContainer: {
    justifyContent: "center",
    gap: 8,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#A1A1AA", // zinc-400 equivalent in hex
    marginVertical: 16,
  },
  loadingText: {
    textAlign: "center",
  },
  noProductsText: {
    textAlign: "center",
  },
});

export default ProductsView;
