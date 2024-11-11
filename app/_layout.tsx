import React from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import ThemedView from "@/components/ThemedView";
import ThemedText from "@/components/ThemedText";
import ThemedLink from "@/components/ThemedLink";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { AuthProvider } from "@/contexts/AuthContext";
import ToastManager from "toastify-react-native";

// Import your global CSS file
import "./global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function CustomDrawerContent() {
  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ThemedLink href="/home/HomeScreen" style={{ fontSize: 16, marginLeft: 20, marginBottom: 5 }}>
        Početna stranica
      </ThemedLink>
      <ThemedText style={{ fontSize: 20, marginVertical: 10 }}>Popis</ThemedText>
      <ThemedLink href="/inventory/InventoriesScreen" style={{ fontSize: 16, marginLeft: 20, marginBottom: 5 }}>
        Lista popisa
      </ThemedLink>
      <ThemedLink href="/inventory/add-products/ScanProductsScreen" style={{ fontSize: 16, marginLeft: 20, marginBottom: 5 }}>
        Skeniraj proizvode
      </ThemedLink>
      <ThemedLink href="/inventory/inventory-list/InventoryListScreen" style={{ fontSize: 16, marginLeft: 20, marginBottom: 5 }}>
        Kontrolna tabla
      </ThemedLink>
      <ThemedText style={{ fontSize: 20, marginVertical: 10 }}>Proizvodi</ThemedText>
      <ThemedLink href="/products/ProductsScreen" style={{ fontSize: 16, marginLeft: 20, marginBottom: 5 }}>
        Pregled proizvoda
      </ThemedLink>
      <ThemedText style={{ fontSize: 20, marginVertical: 10 }}>Korisnici</ThemedText>
      <ThemedLink href="/users/UsersScreen" style={{ fontSize: 16, marginLeft: 20, marginBottom: 5 }}>
        Administracija korisnika
      </ThemedLink>
    </ThemedView>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <GestureHandlerRootView className="flex-1">
          <SafeAreaView style={{ flex: 1 }}>
            <ToastManager />
            <Drawer
              drawerContent={CustomDrawerContent}
              screenOptions={{
                headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
              }}
            />
          </SafeAreaView>
        </GestureHandlerRootView>
      </AuthProvider>
    </ThemeProvider>
  );
}
