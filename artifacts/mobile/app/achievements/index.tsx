import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const ACHIEVEMENTS = [
  { id: "a1", title: "First Order", desc: "Placed your first Bringo order", icon: "package" as const, color: "#FF9A3D", unlocked: true, points: 50 },
  { id: "a2", title: "Speed Demon", desc: "Got an order in under 15 minutes", icon: "zap" as const, color: "#4A90E2", unlocked: true, points: 100 },
  { id: "a3", title: "Loyal Customer", desc: "Placed 10 orders", icon: "heart" as const, color: "#E74C3C", unlocked: true, points: 200 },
  { id: "a4", title: "Reviewer", desc: "Left 5 product reviews", icon: "star" as const, color: "#F39C12", unlocked: false, points: 150 },
  { id: "a5", title: "Socialite", desc: "Referred 3 friends to Bringo", icon: "users" as const, color: "#9B59B6", unlocked: false, points: 300 },
  { id: "a6", title: "Prime Member", desc: "Subscribed to Bringo Prime", icon: "award" as const, color: "#1ABC9C", unlocked: false, points: 500 },
  { id: "a7", title: "Streak Master", desc: "Ordered 7 days in a row", icon: "trending-up" as const, color: "#34C759", unlocked: false, points: 400 },
  { id: "a8", title: "Big Spender", desc: "Spent ₹5,000 total", icon: "credit-card" as const, color: "#2ECC71", unlocked: false, points: 250 },
];

export default function AchievementsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const unlocked = ACHIEVEMENTS.filter((a) => a.unlocked);
  const locked = ACHIEVEMENTS.filter((a) => !a.unlocked);
  const totalPoints = unlocked.reduce((s, a) => s + a.points, 0);

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Achievements" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {/* Summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.primary }, shadows.lg]}>
          <Text style={[styles.summaryPoints, { color: colors.primaryForeground }]}>{totalPoints}</Text>
          <Text style={[styles.summaryLabel, { color: "rgba(247,245,240,0.7)" }]}>Achievement points</Text>
          <View style={styles.summaryBadges}>
            <View style={[styles.summaryBadge, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Text style={styles.summaryBadgeVal}>{unlocked.length}/{ACHIEVEMENTS.length}</Text>
              <Text style={styles.summaryBadgeLbl}>Unlocked</Text>
            </View>
            <View style={[styles.summaryBadge, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
              <Text style={styles.summaryBadgeVal}>{locked.length}</Text>
              <Text style={styles.summaryBadgeLbl}>To unlock</Text>
            </View>
          </View>
        </View>

        {/* Unlocked */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Earned ({unlocked.length})</Text>
        {unlocked.map((a) => (
          <View key={a.id} style={[styles.achievCard, { backgroundColor: colors.card }, shadows.sm]}>
            <View style={[styles.achIcon, { backgroundColor: a.color + "18" }]}>
              <Feather name={a.icon} size={24} color={a.color} />
            </View>
            <View style={styles.achInfo}>
              <Text style={[styles.achTitle, { color: colors.primary }]}>{a.title}</Text>
              <Text style={[styles.achDesc, { color: colors.mutedForeground }]}>{a.desc}</Text>
            </View>
            <View style={[styles.pointsBadge, { backgroundColor: a.color + "18" }]}>
              <Text style={[styles.pointsText, { color: a.color }]}>+{a.points}</Text>
            </View>
          </View>
        ))}

        {/* Locked */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Still to unlock</Text>
        {locked.map((a) => (
          <View key={a.id} style={[styles.achievCard, { backgroundColor: colors.card, opacity: 0.6 }, shadows.sm]}>
            <View style={[styles.achIcon, { backgroundColor: colors.muted }]}>
              <Feather name="lock" size={22} color={colors.mutedForeground} />
            </View>
            <View style={styles.achInfo}>
              <Text style={[styles.achTitle, { color: colors.secondary }]}>{a.title}</Text>
              <Text style={[styles.achDesc, { color: colors.mutedForeground }]}>{a.desc}</Text>
            </View>
            <View style={[styles.pointsBadge, { backgroundColor: colors.muted }]}>
              <Text style={[styles.pointsText, { color: colors.mutedForeground }]}>{a.points} pts</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 14 },
  summaryCard: { borderRadius: 24, padding: 24, gap: 6, alignItems: "center" },
  summaryPoints: { fontFamily: "Inter_700Bold", fontSize: 48, letterSpacing: -2 },
  summaryLabel: { fontFamily: "Inter_400Regular", fontSize: 14 },
  summaryBadges: { flexDirection: "row", gap: 10, marginTop: 8 },
  summaryBadge: { borderRadius: 12, padding: 12, alignItems: "center", minWidth: 80 },
  summaryBadgeVal: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#FFF" },
  summaryBadgeLbl: { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(247,245,240,0.7)" },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5 },
  achievCard: { borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  achIcon: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  achInfo: { flex: 1, gap: 2 },
  achTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  achDesc: { fontFamily: "Inter_400Regular", fontSize: 13 },
  pointsBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  pointsText: { fontFamily: "Inter_700Bold", fontSize: 13 },
});
