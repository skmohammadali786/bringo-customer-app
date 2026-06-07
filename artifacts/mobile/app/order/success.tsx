import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, Platform, StyleSheet, Text, View } from "react-native";
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
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

export default function OrderSuccessScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const ty = useSharedValue(30);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 32;

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }],
  }));

  useEffect(() => {
    scale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 120 }));
    opacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    ty.value = withDelay(400, withSpring(0, { damping: 20 }));
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.hero}>
        <Animated.View style={[checkStyle]}>
          <View style={[styles.successRing, { borderColor: `${colors.accentGreen}30` }]}>
            <View style={[styles.successCircle, { backgroundColor: colors.accentGreen }]}>
              <Feather name="check" size={44} color="#FFF" />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.textWrap, contentStyle]}>
          <Text style={[styles.title, { color: colors.primary }]}>Order Placed!</Text>
          <Text style={[styles.sub, { color: colors.secondary }]}>
            Your order has been received. We're finding the best products for you.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.card, { backgroundColor: colors.card }, shadows.card, contentStyle]}>
          {[
            { icon: "hash" as const, label: "Order ID", value: "ORD" + Math.random().toString(36).substr(2, 5).toUpperCase() },
            { icon: "clock" as const, label: "Estimated Time", value: "20–30 minutes" },
            { icon: "map-pin" as const, label: "Deliver To", value: "Flat 4B, Koramangala" },
          ].map((item, i) => (
            <View key={item.label}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <View style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: colors.muted }]}>
                  <Feather name={item.icon} size={15} color={colors.secondary} />
                </View>
                <View style={styles.infoText}>
                  <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
                  <Text style={[styles.infoValue, { color: colors.primary }]}>{item.value}</Text>
                </View>
              </View>
            </View>
          ))}
        </Animated.View>
      </View>

      <Animated.View style={[styles.actions, { paddingBottom: botPad }, contentStyle]}>
        <Button
          label="Track Order"
          onPress={() => router.replace("/(tabs)/orders" as any)}
          variant="primary"
        />
        <Button
          label="Back to Home"
          onPress={() => router.replace("/(tabs)" as any)}
          variant="ghost"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between" },
  hero: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.pagePadding, gap: 32 },
  successRing: { width: 140, height: 140, borderRadius: 70, borderWidth: 12, alignItems: "center", justifyContent: "center" },
  successCircle: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" },
  textWrap: { alignItems: "center", gap: 10 },
  title: { fontSize: 40, fontFamily: "Inter_700Bold", letterSpacing: -1.5 },
  sub: { ...typography.body, textAlign: "center", maxWidth: 280, lineHeight: 22 },
  card: { width: "100%", borderRadius: 24, overflow: "hidden" },
  infoRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 14 },
  infoIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  infoText: { flex: 1, gap: 2 },
  infoLabel: { ...typography.caption },
  infoValue: { ...typography.bodyMedium },
  divider: { height: 1, marginHorizontal: 16 },
  actions: { paddingHorizontal: spacing.pagePadding, gap: 12 },
});
