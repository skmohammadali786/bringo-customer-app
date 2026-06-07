import { router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

export default function SplashScreen() {
  const colors = useColors();
  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const dotScale = useSharedValue(0);

  const logoAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: (1 - textOpacity.value) * 12 }],
  }));

  const dotAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
  }));

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 500 });
    logoScale.value = withSpring(1, { damping: 14, stiffness: 120 });

    textOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    dotScale.value = withDelay(600, withSpring(1, { damping: 12 }));

    const timer = setTimeout(() => {
      router.replace("/(auth)/onboarding");
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[styles.logoWrap, logoAnimStyle]}>
        <View style={[styles.logoBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.logoLetter, { color: colors.primaryForeground }]}>B</Text>
        </View>
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: colors.accentOrange },
            dotAnimStyle,
          ]}
        />
      </Animated.View>

      <Animated.View style={[styles.textWrap, textAnimStyle]}>
        <Text style={[styles.brand, { color: colors.primary }]}>bringo</Text>
        <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
          anything, delivered.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  logoWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  logoBadge: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: {
    fontSize: 52,
    fontFamily: "Inter_700Bold",
    letterSpacing: -2,
  },
  dot: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  textWrap: { alignItems: "center", gap: 6 },
  brand: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    letterSpacing: -2,
  },
  tagline: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    letterSpacing: 0.2,
  },
});
