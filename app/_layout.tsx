import React from "react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "@/contexts/AuthContext";
import ToastManager from "toastify-react-native";
import { Slot, Stack } from "expo-router";

// Import your global CSS file
import "./global.css";
import { FlipInEasyX } from "react-native-reanimated";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({ SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf") });

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
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <ToastManager
              style={{
                elevation: 10,
                zIndex: 1000,
                position: "absolute",
                padding: 8,
                width: "auto",
                maxWidth: "90%",
                height: "auto",
              }}
              textStyle={{
                textWrap: "wrap",
                textAlign: "center",
                margin:4,
              }}
            />
            <Stack />
          </SafeAreaView>
        </GestureHandlerRootView>
      </AuthProvider>
    </ThemeProvider>
  );
}
