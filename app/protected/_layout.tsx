import React, { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import {  useRouter } from "expo-router";
import ThemedView from "@/components/ThemedView";
import ThemedLink from "@/components/ThemedLink";
import MyButton from "@/components/MyButton";
import { Drawer } from "expo-router/drawer";
import { useColorScheme } from "@/hooks/useColorScheme";

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authUser, handleLogout } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [mounted, setMounted] = useState(false);  // To ensure the component has mounted

  function CustomDrawerContent() {
    return (
      <ThemedView style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 40 }}>
        <ThemedLink type="defaultSemiBold" href="/protected/home/HomeScreen" style={{ marginLeft: 20, marginBottom: 5 }}>
          Home
        </ThemedLink>
        <ThemedLink type="defaultSemiBold" href="/protected/inventory/InventoriesScreen" style={{ marginVertical: 10, marginLeft: 20 }}>
          Popis
        </ThemedLink>
        <ThemedLink type="defaultSemiBold" href="/protected/products/ProductsScreen" style={{ marginVertical: 10, marginLeft: 20 }}>
          Proizvodi
        </ThemedLink>
        <ThemedLink type="defaultSemiBold" href="/protected/products/product-list/ProductsListScreen" style={{ marginVertical: 10, marginLeft: 40 }}>
          Pregled proizvoda
        </ThemedLink>
        <ThemedLink type="defaultSemiBold" href="/protected/products/new-product/NewProductScreen" style={{ marginVertical: 10, marginLeft: 40 }}>
          Dodaj novi proizvod
        </ThemedLink>
        <ThemedLink type="defaultSemiBold" href="/protected/products/scan-new-product/ScanNewProductScreen" style={{ marginVertical: 10, marginLeft: 40 }}>
          Skeniraj novi proizvod
        </ThemedLink>
        <ThemedLink type="defaultSemiBold" href="/protected/procurment/ProcurementScreen" style={{ marginVertical: 10, marginLeft: 20 }}>
          Nabavke
        </ThemedLink>
        <ThemedLink type="defaultSemiBold" href="/protected/users/UsersScreen" style={{ marginVertical: 10, marginLeft: 20 }}>
          Korisnici
        </ThemedLink>
        <MyButton type="secondary" title="Odjavi se" onPress={() => handleLogout()}/>
      </ThemedView>
    );
  }

  useEffect(() => {
    setMounted(true); // Mark the component as mounted
  }, []);

  // Redirect to the login page if the user is not authenticated
  useEffect(() => {
    if (!authUser && mounted) {  // Check if mounted before attempting navigation
      router.push("/");  // Redirect to login
    }
  }, [authUser, mounted, router]); // Only run when authUser or mounted changes

  if (!authUser) {
    return null; // Or you can show a loading screen if you prefer
  }

  return (
    <>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
        }}
      />
      {children}
    </>
  );
};

export default ProtectedLayout;
