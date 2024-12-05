import React, { useEffect, useState } from "react";
import ThemedText from "@/components/ThemedText";
import { router, Stack } from "expo-router";
import ThemedView from "@/components/ThemedView";
import ThemedButton from "@/components/ThemedButton";
import ThemedTextInput from "@/components/ThemedTextInput";
import ThemedLink from "@/components/ThemedLink";
import useAuth from "@/hooks/useAuth";
import { StyleSheet, BackHandler, Platform } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { Toast } from "toastify-react-native";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, authUser } = useAuth();

  //If authUser forward to backend home
  useEffect(() => {
    if (authUser) {
      router.push("/protected/home/HomeScreen");
    }
  }, [authUser]);

  const clientId = Platform.select({
    android: Constants.expoConfig?.extra?.googleClientIdAndroid,
    web: Constants.expoConfig?.extra?.googleClientIdWeb,
  });

  const clientSecret = Constants.expoConfig?.extra?.googleClientSecret;

  const [request, response, promptAsync] = Google.useAuthRequest({
    redirectUri: makeRedirectUri(),
    clientId,
    clientSecret,
    scopes: ["openid", "profile", "email"],
    responseType: "code", // Use "code" for PKCE flow
    usePKCE: true, // Enable PKCE
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      handleLogin({ type: "google", credential: id_token });
    } else if (response?.type === "error") {
      Toast.error(`Greska pri prijavi`, "top");
    }
  }, [response]);

  const handleGoogleLogin = () => {
    promptAsync();
  };

  const handleSubmit = () => {
    handleLogin({ type: "password", email, password });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false, animation: "slide_from_right" }} />
      {!authUser && (
        <ThemedView style={styles.container}>
          <ThemedView style={styles.formContainer}>
            <ThemedText style={styles.title}>Retail Store App</ThemedText>

            <ThemedView style={styles.divider}></ThemedView>

            <ThemedText style={styles.subtitle}>Prijavite pomoću lozinke</ThemedText>
            <ThemedView style={styles.buttonContainer}>
              <ThemedTextInput
                style={styles.inputField}
                placeholder="Email"
                placeholderTextColor="#a1a1aa"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text) => setEmail(text)}
                value={email}
              />
              <ThemedTextInput
                style={styles.inputField}
                placeholder="Password"
                placeholderTextColor="#a1a1aa"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                value={password}
              />
              <ThemedButton title="Login" style={styles.buttons} onPress={handleSubmit} />
            </ThemedView>
            <ThemedLink style={styles.forgotPassword} href="/">
              Zaboravli ste lozinku?
            </ThemedLink>

            <ThemedView style={styles.divider}></ThemedView>

            <ThemedText style={styles.subtitle}>Prijavite se pomoću Google naloga</ThemedText>
            <ThemedView style={styles.buttonContainer}>
              <ThemedButton
                title="Login with Google"
                disabled={!request}
                style={styles.buttons}
                onPress={handleGoogleLogin}
              />
            </ThemedView>

            {Platform.OS === "android" && (
              <>
                <ThemedView style={styles.divider}></ThemedView>
                <ThemedView style={styles.buttonContainer}>
                  <ThemedButton
                    title="Zatvori aplikaciju"
                    style={styles.buttons}
                    type="secondary"
                    onPress={() => BackHandler.exitApp()}
                  />
                </ThemedView>
              </>
            )}
          </ThemedView>
        </ThemedView>
      )}
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#52525b",
    padding: 16,
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
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    minWidth: "100%",
  },
  inputField: {
    minWidth: "100%",
  },
  buttons: {
    minWidth: "100%",
  },
  forgotPassword: {
    color: "#4b5563",
    textAlign: "center",
    cursor: "pointer",
    fontSize: 18,
  },
});
