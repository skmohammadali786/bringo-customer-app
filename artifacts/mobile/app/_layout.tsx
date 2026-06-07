import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="search/index" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="categories/index" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="categories/[slug]" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="request/index" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="order/[id]" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="order/summary" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="order/payment" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="order/success" options={{ animation: "fade" }} />
      <Stack.Screen name="chat/[id]" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile/personal" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile/addresses" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile/help" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile/rewards" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile/referral" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile/wallet-history" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile/settings" options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CartProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <KeyboardProvider>
                  <RootLayoutNav />
                </KeyboardProvider>
              </GestureHandlerRootView>
            </CartProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
