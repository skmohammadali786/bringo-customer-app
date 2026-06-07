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
import { ThemeProvider } from "@/context/ThemeContext";
import { useColors } from "@/hooks/useColors";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const colors = useColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "default",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
      <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
      <Stack.Screen name="search/index" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="categories/index" options={{ animation: "default" }} />
      <Stack.Screen name="categories/[slug]" options={{ animation: "default" }} />
      <Stack.Screen name="request/index" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="request/success" options={{ animation: "fade" }} />
      <Stack.Screen name="order/[id]" options={{ animation: "default" }} />
      <Stack.Screen name="order/summary" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="order/payment" options={{ animation: "default" }} />
      <Stack.Screen name="order/success" options={{ animation: "fade" }} />
      <Stack.Screen name="order/live" options={{ animation: "default" }} />
      <Stack.Screen name="order/cancel" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="order/issue" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="order/receipt" options={{ animation: "default" }} />
      <Stack.Screen name="order/rate" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="chat/[id]" options={{ animation: "default" }} />
      <Stack.Screen name="product/[id]" options={{ animation: "default" }} />
      <Stack.Screen name="product/reviews" options={{ animation: "default" }} />
      <Stack.Screen name="product/write-review" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="profile/personal" options={{ animation: "default" }} />
      <Stack.Screen name="profile/addresses" options={{ animation: "default" }} />
      <Stack.Screen name="profile/appearance" options={{ animation: "default" }} />
      <Stack.Screen name="profile/help" options={{ animation: "default" }} />
      <Stack.Screen name="profile/rewards" options={{ animation: "default" }} />
      <Stack.Screen name="profile/referral" options={{ animation: "default" }} />
      <Stack.Screen name="profile/wallet-history" options={{ animation: "default" }} />
      <Stack.Screen name="profile/settings" options={{ animation: "default" }} />
      <Stack.Screen name="profile/terms" options={{ animation: "default" }} />
      <Stack.Screen name="profile/privacy" options={{ animation: "default" }} />
      <Stack.Screen name="profile/about" options={{ animation: "default" }} />
      <Stack.Screen name="profile/delete" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="profile/payment-methods" options={{ animation: "default" }} />
      <Stack.Screen name="profile/manage" options={{ animation: "default" }} />
      <Stack.Screen name="notifications/settings" options={{ animation: "default" }} />
      <Stack.Screen name="notifications/[id]" options={{ animation: "default" }} />
      <Stack.Screen name="address/add" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="address/edit" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="wallet/add" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="wallet/transfer" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="invite/index" options={{ animation: "default" }} />
      <Stack.Screen name="search/filters" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="search/results" options={{ animation: "default" }} />
      <Stack.Screen name="support/index" options={{ animation: "default" }} />
      <Stack.Screen name="support/chat" options={{ animation: "default" }} />
      <Stack.Screen name="support/ticket" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="map/index" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="agent/[id]" options={{ animation: "default" }} />
      <Stack.Screen name="agent/track" options={{ animation: "default" }} />
      <Stack.Screen name="store/[id]" options={{ animation: "default" }} />
      <Stack.Screen name="brand/[id]" options={{ animation: "default" }} />
      <Stack.Screen name="cart/index" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="checkout/index" options={{ animation: "default" }} />
      <Stack.Screen name="checkout/address" options={{ animation: "default" }} />
      <Stack.Screen name="checkout/time" options={{ animation: "default" }} />
      <Stack.Screen name="prime/index" options={{ animation: "default" }} />
      <Stack.Screen name="prime/plans" options={{ animation: "default" }} />
      <Stack.Screen name="prime/success" options={{ animation: "fade" }} />
      <Stack.Screen name="achievements/index" options={{ animation: "default" }} />
      <Stack.Screen name="leaderboard/index" options={{ animation: "default" }} />
      <Stack.Screen name="streak/index" options={{ animation: "default" }} />
      <Stack.Screen name="rewards/history" options={{ animation: "default" }} />
      <Stack.Screen name="rewards/redeem" options={{ animation: "default" }} />
      <Stack.Screen name="promo/index" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="offers/index" options={{ animation: "default" }} />
      <Stack.Screen name="flash/index" options={{ animation: "default" }} />
      <Stack.Screen name="new-arrivals/index" options={{ animation: "default" }} />
      <Stack.Screen name="recently-viewed/index" options={{ animation: "default" }} />
      <Stack.Screen name="explore/index" options={{ animation: "default" }} />
      <Stack.Screen name="feedback/index" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="rate-app/index" options={{ animation: "slide_from_bottom" }} />
    </Stack>
  );
}

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CartProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <KeyboardProvider>{children}</KeyboardProvider>
              </GestureHandlerRootView>
            </CartProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
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
    <AppProviders>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </AppProviders>
  );
}
