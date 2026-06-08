import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

// 0 = block (blue), 1 = road (white), 2 = park (green)
const MAP_ROWS = [
  [0, 0, 1, 0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 0, 2, 0, 1, 0],
  [0, 0, 1, 0, 0, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 0, 1, 0, 0, 0, 1],
];

const STEPS = ["Order received", "Agent assigned", "Items sourced", "Out for delivery", "Delivered"];

export default function AgentTrackScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;
  const [currentStep] = useState(3);
  const dotAnim = useRef(new Animated.Value(0)).current;
  const [eta, setEta] = useState(12);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(dotAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
    const timer = setInterval(() => setEta((e) => Math.max(0, e - 1)), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      {/* Header — floats over the map */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.headerBtn, { backgroundColor: "#FFFFFF" }, shadows.sm]}
        >
          <Feather name="arrow-left" size={20} color="#111111" />
        </Pressable>
        <Pressable style={[styles.headerBtn, { backgroundColor: "#FFFFFF" }, shadows.sm]}>
          <Feather name="more-vertical" size={20} color="#111111" />
        </Pressable>
      </View>

      {/* Map — always light, like a real map */}
      <View style={styles.mapArea}>
        {/* Light map background */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "#E8EFF7" }]} />

        {/* Road grid */}
        <View style={styles.grid}>
          {MAP_ROWS.map((row, ri) => (
            <View key={ri} style={styles.gridRow}>
              {row.map((cell, ci) => {
                if (cell === 1) return <View key={ci} style={[styles.road]} />;
                if (cell === 2) return <View key={ci} style={[styles.park]} />;
                return <View key={ci} style={[styles.block]} />;
              })}
            </View>
          ))}
        </View>

        {/* Agent marker */}
        <Animated.View
          style={[
            styles.agentMarker,
            { opacity: dotAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
          ]}
        >
          <View style={[styles.markerBubble, { backgroundColor: colors.accentOrange }, shadows.lg]}>
            <Feather name="navigation" size={18} color="#FFF" />
          </View>
          <View style={[styles.markerStem, { backgroundColor: colors.accentOrange }]} />
          <View style={[styles.markerLabel, shadows.sm]}>
            <Text style={styles.markerLabelText}>Rahul</Text>
          </View>
        </Animated.View>

        {/* Destination marker */}
        <View style={[styles.destMarker, { right: "18%", bottom: "22%" }]}>
          <View style={[styles.markerBubble, { backgroundColor: colors.accentGreen }, shadows.md]}>
            <Feather name="home" size={16} color="#FFF" />
          </View>
        </View>

        {/* ETA chip — always white on map */}
        <View style={[styles.etaChip, { backgroundColor: "#FFFFFF" }, shadows.lg]}>
          <Text style={styles.etaNum}>{eta}</Text>
          <Text style={styles.etaUnit}>min</Text>
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        {/* Agent info */}
        <View style={[styles.agentRow, { borderBottomColor: colors.border }]}>
          <View style={[styles.agentAvatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.agentInitial, { color: colors.primaryForeground }]}>R</Text>
          </View>
          <View style={styles.agentInfo}>
            <Text style={[styles.agentName, { color: colors.primary }]}>Rahul Kumar</Text>
            <View style={styles.ratingRow}>
              <Feather name="star" size={12} color={colors.accentOrange} />
              <Text style={[styles.rating, { color: colors.secondary }]}>4.9 · 1,248 deliveries</Text>
            </View>
          </View>
          <View style={styles.agentActions}>
            <Pressable
              style={[styles.actionBtn, { backgroundColor: colors.accentGreen + "18" }]}
              onPress={() =>
                router.push({
                  pathname: "/chat/[id]" as any,
                  params: { id: "agent-001", name: "Rahul K.", subtitle: "Online · Your delivery agent" },
                })
              }
            >
              <Feather name="message-circle" size={18} color={colors.accentGreen} />
            </Pressable>
            <Pressable
              style={[styles.actionBtn, { backgroundColor: colors.accentBlue + "18" }]}
              onPress={() => Linking.openURL("tel:+911234567890")}
            >
              <Feather name="phone" size={18} color={colors.accentBlue} />
            </Pressable>
          </View>
        </View>

        {/* Progress steps */}
        <View style={styles.progressWrap}>
          {STEPS.map((step, i) => {
            const done = i <= currentStep;
            const active = i === currentStep;
            return (
              <View key={step} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View
                    style={[
                      styles.stepDot,
                      {
                        backgroundColor: done
                          ? active
                            ? colors.accentOrange
                            : colors.primary
                          : colors.muted,
                        width: active ? 20 : 14,
                        height: active ? 20 : 14,
                        borderRadius: active ? 10 : 7,
                      },
                    ]}
                  />
                  {i < STEPS.length - 1 && (
                    <View
                      style={[
                        styles.stepLine,
                        { backgroundColor: i < currentStep ? colors.primary : colors.muted },
                      ]}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    {
                      color: active ? colors.accentOrange : done ? colors.primary : colors.mutedForeground,
                      fontFamily: active ? "Inter_600SemiBold" : "Inter_400Regular",
                    },
                  ]}
                >
                  {step}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={{ paddingHorizontal: spacing.pagePadding, paddingBottom: botPad }}>
          <Pressable
            style={[styles.issueBtn, { backgroundColor: colors.muted }]}
            onPress={() => router.push("/order/issue" as any)}
          >
            <Text style={[styles.issueBtnText, { color: colors.secondary }]}>Report an issue</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.pagePadding,
    paddingBottom: 12,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  mapArea: { height: "52%", position: "relative", overflow: "hidden" },
  grid: { position: "absolute", inset: 0 },
  gridRow: { flex: 1, flexDirection: "row" },
  road: { flex: 1 },
  block: { flex: 1, margin: 2, borderRadius: 4, backgroundColor: "#D6E4F0" },
  park: { flex: 1, margin: 2, borderRadius: 4, backgroundColor: "#C8E6C9" },
  agentMarker: { position: "absolute", left: "38%", top: "38%", alignItems: "center" },
  markerBubble: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  markerStem: { width: 3, height: 10 },
  markerLabel: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 2,
  },
  markerLabelText: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: "#111111" },
  destMarker: { position: "absolute", alignItems: "center" },
  etaChip: {
    position: "absolute",
    top: 80,
    right: 20,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
  },
  etaNum: { fontFamily: "Inter_700Bold", fontSize: 28, color: "#111111", letterSpacing: -1 },
  etaUnit: { fontFamily: "Inter_400Regular", fontSize: 12, color: "#5B5B5B" },
  sheet: { flex: 1, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -20 },
  agentRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 12,
    borderBottomWidth: 1,
  },
  agentAvatar: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  agentInitial: { fontFamily: "Inter_700Bold", fontSize: 24 },
  agentInfo: { flex: 1, gap: 4 },
  agentName: { fontFamily: "Inter_700Bold", fontSize: 16 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  rating: { fontFamily: "Inter_400Regular", fontSize: 12 },
  agentActions: { flexDirection: "row", gap: 8 },
  actionBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  progressWrap: { padding: 20, gap: 0 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  stepLeft: { alignItems: "center", width: 20 },
  stepDot: { borderRadius: 10 },
  stepLine: { width: 2, flex: 1, minHeight: 20, marginVertical: 3 },
  stepLabel: { fontSize: 14, paddingBottom: 14, marginTop: -2 },
  issueBtn: { borderRadius: 14, padding: 14, alignItems: "center" },
  issueBtnText: { fontFamily: "Inter_500Medium", fontSize: 14 },
});
