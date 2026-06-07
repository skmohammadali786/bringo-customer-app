import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const STEPS = [
  { key: "received", label: "Order received", icon: "check-circle" as const },
  { key: "assigned", label: "Agent assigned", icon: "user-check" as const },
  { key: "sourcing", label: "Sourcing items", icon: "shopping-bag" as const },
  { key: "picked", label: "Picked up", icon: "package" as const },
  { key: "delivery", label: "Out for delivery", icon: "navigation" as const },
];

export default function LiveOrderScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;
  const [step, setStep] = useState(4);
  const [eta, setEta] = useState(8);
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.15, { duration: 800 }), -1, true);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <View style={[{ flex: 1, backgroundColor: colors.primary }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Pressable onPress={() => router.back()} style={[styles.headerBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
          <Feather name="arrow-left" size={20} color="#FFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Live order</Text>
        <Pressable style={[styles.headerBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}
          onPress={() => router.push("/order/issue" as any)}>
          <Feather name="alert-circle" size={20} color="#FFF" />
        </Pressable>
      </View>

      {/* ETA */}
      <View style={styles.etaSection}>
        <Animated.View style={[styles.etaRing, { borderColor: "rgba(255,154,61,0.3)" }, pulseStyle]}>
          <View style={[styles.etaInner, { backgroundColor: colors.accentOrange }]}>
            <Text style={styles.etaNum}>{eta}</Text>
            <Text style={styles.etaUnit}>min</Text>
          </View>
        </Animated.View>
        <Text style={[styles.etaLabel, { color: "rgba(247,245,240,0.9)" }]}>Arriving at your door</Text>
      </View>

      {/* Bottom sheet */}
      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        {/* Progress steps */}
        <View style={styles.stepsWrap}>
          {STEPS.map((s, i) => {
            const done = i <= step;
            const active = i === step;
            return (
              <View key={s.key} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View style={[styles.stepDot, {
                    backgroundColor: active ? colors.accentOrange : done ? colors.primary : colors.muted,
                    width: active ? 22 : 16,
                    height: active ? 22 : 16,
                    borderRadius: active ? 11 : 8,
                  }]}>
                    {done && !active && <Feather name="check" size={10} color={colors.primaryForeground} />}
                  </View>
                  {i < STEPS.length - 1 && <View style={[styles.stepLine, { backgroundColor: i < step ? colors.primary : colors.muted }]} />}
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepLabel, {
                    color: active ? colors.accentOrange : done ? colors.primary : colors.mutedForeground,
                    fontFamily: active ? "Inter_700Bold" : done ? "Inter_500Medium" : "Inter_400Regular",
                  }]}>
                    {s.label}
                  </Text>
                  {active && <Text style={[styles.stepSub, { color: colors.mutedForeground }]}>In progress</Text>}
                </View>
                <View style={[styles.stepIcon, { backgroundColor: done ? colors.primary + "18" : colors.muted }]}>
                  <Feather name={s.icon} size={14} color={done ? colors.primary : colors.mutedForeground} />
                </View>
              </View>
            );
          })}
        </View>

        {/* Agent */}
        <View style={[styles.agentRow, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <View style={[styles.agentAvatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.agentInitial, { color: colors.primaryForeground }]}>R</Text>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[styles.agentName, { color: colors.primary }]}>Rahul Kumar</Text>
            <View style={styles.ratingRow}>
              <Feather name="star" size={11} color={colors.accentOrange} />
              <Text style={[styles.ratingText, { color: colors.mutedForeground }]}>4.9</Text>
            </View>
          </View>
          <Pressable style={[styles.agentBtn, { backgroundColor: colors.accentGreen + "18" }]}
            onPress={() => router.push("/support/chat" as any)}>
            <Feather name="message-circle" size={18} color={colors.accentGreen} />
          </Pressable>
          <Pressable style={[styles.agentBtn, { backgroundColor: colors.accentBlue + "18" }]}>
            <Feather name="phone" size={18} color={colors.accentBlue} />
          </Pressable>
        </View>

        <View style={[styles.actions, { paddingBottom: botPad }]}>
          <Button label="Track on map" onPress={() => router.push("/agent/track" as any)} variant="primary" style={{ flex: 1 }} />
          <Button label="Cancel" onPress={() => router.push("/order/cancel" as any)} variant="outline" style={{ flex: 1 }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: spacing.pagePadding, paddingBottom: 20 },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#FFF" },
  headerBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  etaSection: { alignItems: "center", paddingVertical: 20, gap: 12 },
  etaRing: { width: 140, height: 140, borderRadius: 70, borderWidth: 3, alignItems: "center", justifyContent: "center" },
  etaInner: { width: 110, height: 110, borderRadius: 55, alignItems: "center", justifyContent: "center" },
  etaNum: { fontFamily: "Inter_700Bold", fontSize: 44, color: "#FFF", letterSpacing: -2, lineHeight: 48 },
  etaUnit: { fontFamily: "Inter_400Regular", fontSize: 14, color: "rgba(255,255,255,0.8)" },
  etaLabel: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  sheet: { flex: 1, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 20 },
  stepsWrap: { paddingHorizontal: spacing.pagePadding, gap: 0 },
  stepRow: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  stepLeft: { alignItems: "center", width: 22 },
  stepDot: { alignItems: "center", justifyContent: "center" },
  stepLine: { width: 2, flex: 1, minHeight: 18, marginVertical: 3 },
  stepContent: { flex: 1, paddingBottom: 14, marginTop: -1 },
  stepLabel: { fontSize: 14 },
  stepSub: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 2 },
  stepIcon: { width: 32, height: 32, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  agentRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12, borderTopWidth: 1, marginTop: 8 },
  agentAvatar: { width: 46, height: 46, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  agentInitial: { fontFamily: "Inter_700Bold", fontSize: 22 },
  agentName: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontFamily: "Inter_400Regular", fontSize: 12 },
  agentBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  actions: { flexDirection: "row", gap: 10, paddingHorizontal: spacing.pagePadding, paddingTop: 14 },
});
