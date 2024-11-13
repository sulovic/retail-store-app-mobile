import { Product } from "@/types/types";
import ThemedText from "@/components/ThemedText";
import ThemedView from "@/components/ThemedView";
import ThemedScrollView from "@/components/ThemedScrollView";
import MyButton from "@/components/MyButton";
import { Image } from "expo-image";

const ProductsView: React.FC<{ products: Product[]; handleEditProduct: (product: Product) => void; handleDeleteProduct: (product: Product) => void; loading: boolean }> = ({ products, handleEditProduct, handleDeleteProduct, loading }) => {
  return (
    <ThemedScrollView>
      {products.length > 0 ? (
        products.map((product, index) => (
          <ThemedView className="w-full" key={index}>
            <ThemedView className="flex flex-row gap-4">
              <ThemedView className="w-3/4 flex flex-col gap-4 justify-center content-center">
                <ThemedText>{product.productName}</ThemedText>
                <ThemedText>BC: {product.productBarcode}</ThemedText>
                <ThemedText>Cena: {product.productPrice} RSD</ThemedText>
              </ThemedView>
              <ThemedView className="w-1/4 flex justify-center">
                <Image source={require("@/assets/images/placeholder.png")} className="w-24 h-24" />
              </ThemedView>
            </ThemedView>

            <ThemedView className="flex flex-row gap-4 justify-end">
              <MyButton className="color-zinc-500" type="danger" title="Obrisi" onPress={() => handleDeleteProduct(product)} />
              <MyButton title="Izmeni" type="primary" onPress={() => handleEditProduct(product)} />
            </ThemedView>
            <ThemedView className="border-b border-zinc-400 my-4 " />
          </ThemedView>
        ))
      ) : loading ? (
        <ThemedText>Loading...</ThemedText>
      ) : (
        <ThemedText>Nema proizvoda</ThemedText>
      )}
    </ThemedScrollView>
  );
};

export default ProductsView;
