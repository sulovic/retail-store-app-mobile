import React, { useState } from "react";
import ThemedText from "@/components/ThemedText";
import { Stack } from "expo-router";
import ThemedView from "@/components/ThemedView";
import * as AuthSession from "expo-auth-session";
import MyButton from "@/components/MyButton";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedLink from "@/components/ThemedLink";
import useAuth from "@/hooks/useAuth";
import { StyleSheet } from "react-native";
import { Toast } from "toastify-react-native";

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, authUser } = useAuth();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      redirectUri: AuthSession.makeRedirectUri({ path: "oauth2callback" }),
      scopes: ["openid", "profile", "email"],
    },
    discovery
  );

  const handleGoogleLogin = async () => {
    const result = await promptAsync();
    if (result.type === "success" && result.authentication) {
      const { accessToken } = result.authentication;
      // Do something with the access token
      console.log("Access Token:", accessToken);
    } else {
      Toast.error("Prijava nije uspešna!", "top");
    }
  };

  const handleSubmit = () => {
    handleLogin({ type: "password", email, password });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {!authUser && (
        <ThemedView style={styles.container}>
          <ThemedView style={styles.formContainer}>
            <ThemedText style={styles.title}>Retail Store App</ThemedText>

            <ThemedView style={styles.divider}></ThemedView>

            <ThemedText style={styles.subtitle}>Prijavite se pomoću Google naloga</ThemedText>
            <ThemedView style={styles.buttonContainer}>
              <MyButton title="Login with Google" disabled={!request} onPress={handleGoogleLogin} />
            </ThemedView>
            <ThemedView style={styles.divider}></ThemedView>
            <ThemedText style={styles.subtitle}>Ili se prijavite pomoću lozinke</ThemedText>
            <ThemedView style={styles.inputContainer}>
              <ThemedTextInput style={styles.inputField} placeholder="Email" placeholderTextColor="#a1a1aa" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} onChangeText={(text) => setEmail(text)} value={email} />
              <ThemedTextInput style={styles.inputField} placeholder="Password" placeholderTextColor="#a1a1aa" secureTextEntry onChangeText={(text) => setPassword(text)} value={password} />
              <MyButton title="Login" type="primary" onPress={handleSubmit} />
            </ThemedView>
            <ThemedLink style={styles.forgotPassword} href="/">
              Zaboravli ste lozinku ?
            </ThemedLink>
          </ThemedView>
        </ThemedView>
      )}
    </>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#52525b",
  },
  formContainer: {
    flexDirection: "column",
    gap: 16,
    minWidth: 384,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    textAlign: "center",
  },
  divider: {
    marginVertical: 8,
    width: 300,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "column",
    gap: 16, // gap-4
    width: "100%",
  },
  inputField: {
    minWidth: 260,
  },
  forgotPassword: {
    color: "#4b5563", // hover:text-gray-600
    textAlign: "center",
    cursor: "pointer",
    fontSize: 18,
  },
});
