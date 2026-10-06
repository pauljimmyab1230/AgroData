import React, { useState, useEffect, useCallback } from "react";
import { Platform, View, StyleSheet, StatusBar as RNStatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import AppNavigator from "./src/navigation/AppNavigator";
import LoginScreen from "./src/screens/LoginScreen";
import { getStoredAuth } from "./src/services/auth";
import { onLogout } from "./src/events";
import { ThemeProvider } from "./src/contexts/ThemeContext";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

const isWeb = Platform.OS === "web";

function AppWrapper({ children }: { children: React.ReactNode }) {
  if (isWeb) {
    return (
      <View style={webStyles.container}>
        <View style={webStyles.phoneFrame}>{children}</View>
      </View>
    );
  }
  return <>{children}</>;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const auth = await getStoredAuth();
      setIsLoggedIn(!!auth?.token);
      await SplashScreen.hideAsync();
    })();
  }, []);

  useEffect(() => {
    const unsub = onLogout(() => setIsLoggedIn(false));
    return unsub;
  }, []);

  const handleLoginSuccess = useCallback(() => setIsLoggedIn(true), []);

  if (isLoggedIn === null) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SafeAreaProvider>
          <RNStatusBar barStyle="dark-content" backgroundColor="#F9FAFB" translucent={false} />
          <AppWrapper>
            <NavigationContainer>
              <StatusBar style="dark" />
              {isLoggedIn ? (
                <AppNavigator />
              ) : (
                <LoginScreen onLoginSuccess={handleLoginSuccess} />
              )}
            </NavigationContainer>
          </AppWrapper>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const webStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1F2937", alignItems: "center", justifyContent: "center" },
  phoneFrame: { width: 420, height: "90%", backgroundColor: "#F9FAFB", borderRadius: 24, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
});
