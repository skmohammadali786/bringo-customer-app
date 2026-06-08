import { router } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { spacing } from "@/constants/spacing";

const { width } = Dimensions.get("window");
const CIRCLE = Math.min(width * 0.68, 280);

export default function WelcomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const opacity3 = useSharedValue(0);
  const ty1 = useSharedValue(24);
  const ty2 = useSharedValue(24);
  const ty3 = useSharedValue(24);

  const a1 = useAnimatedStyle(() => ({ opacity: opacity1.value, transform: [{ translateY: ty1.value }] }));
  const a2 = useAnimatedStyle(() => ({ opacity: opacity2.value, transform: [{ translateY: ty2.value }] }));
  const a3 = useAnimatedStyle(() => ({ opacity: opacity3.value, transform: [{ translateY: ty3.value }] }));

  useEffect(() => {
    const anim = (opacityVal: typeof opacity1, tyVal: typeof ty1, delay: number) => {
      opacityVal.value = withDelay(delay, withTiming(1, { duration: 600 }));
      tyVal.value = withDelay(delay, withSpring(0, { damping: 20 }));
    };
    anim(opacity1, ty1, 100);
    anim(opacity2, ty2, 250);
    anim(opacity3, ty3, 400);
  }, []);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 24 }]}>
        <View style={[styles.logoBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.logoLetter, { color: colors.primaryForeground }]}>B</Text>
        </View>
      </View>

      <View style={styles.hero}>
        <Animated.View style={[a1, styles.imageWrap]}>
          <View
            style={[
              styles.imgCircle,
              { backgroundColor: colors.muted, borderColor: colors.border },
            ]}
          >
            <Text style={styles.heroEmoji}>🛵</Text>
            <Text style={styles.floatEmoji1}>🛒</Text>
            <Text style={styles.floatEmoji2}>📦</Text>
            <Text style={styles.floatEmoji3}>⚡</Text>
          </View>
        </Animated.View>

        <Animated.Text style={[styles.headline, { color: colors.primary }, a2]}>
          {"Your city's\nbest stores,\ndelivered."}
        </Animated.Text>

        <Animated.Text style={[styles.body, { color: colors.secondary }, a3]}>
          Request any product and we'll source and deliver it from nearby local stores — fast.
        </Animated.Text>
      </View>

      <Animated.View style={[styles.actions, { paddingBottom: botPad + 32 }, a3]}>
        <Button
          label="Get Started"
          onPress={() => router.push("/(auth)/onboarding")}
          variant="primary"
        />
        <Button
          label="I already have an account"
          onPress={() => router.push("/(auth)/login")}
          variant="ghost"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.pagePadding, paddingBottom: 8 },
  logoBadge: {
    width: 40, height: 40, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  logoLetter: { fontSize: 22, fontFamily: "Inter_700Bold" },
  hero: {
    flex: 1,
    paddingHorizontal: spacing.pagePadding,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  imageWrap: { alignItems: "center" },
  imgCircle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  heroEmoji: { fontSize: 80 },
  floatEmoji1: {
    position: "absolute", top: 20, right: 24, fontSize: 28,
  },
  floatEmoji2: {
    position: "absolute", bottom: 24, left: 20, fontSize: 28,
  },
  floatEmoji3: {
    position: "absolute", top: 28, left: 28, fontSize: 22,
  },
  headline: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    letterSpacing: -2,
    lineHeight: 46,
    textAlign: "center",
  },
  body: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 300,
  },
  actions: {
    paddingHorizontal: spacing.pagePadding,
    gap: 12,
  },
});
