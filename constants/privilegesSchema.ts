import { type Href } from "expo-router";

const privilegesSchema = {
  "/protected/home/HomeScreen": 1000,
  "/protected/inventory/InventoriesScreen": 1000,
  "/protected/inventory/active-inventories/ActiveInventoriesScreen": 1000,
  "/protected/inventory/components/InventoryListScreen": 1000,
  "/protected/inventory/components/ScanInventoryProductsScreen": 1000,
  "/protected/inventory/components/AddInventoryProductsScreen": 1000,
  "/protected/inventory/manage-inventories/ManageInventoriesScreen": 3000,
  "/protected/inventory/new-inventory/NewInventoryScreen": 3000,
  "/protected/procurment/ProcurementScreen": 1000,
  "/protected/products/ProductsScreen": 1000,
  "/protected/products/product-list/ProductsListScreen": 1000,
  "/protected/products/new-product/NewProductScreen": 3000,
  "/protected/products/scan-new-product/ScanNewProductScreen": 3000,
  "/protected/products/upload-products/UploadProductsScreen": 3000,
  "/protected/users/UsersScreen": 3000,
} as Record<Extract<Href, string>, number>;

export default privilegesSchema;
