import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const WEEK_STATUS = [true, true, true, true, true, false, false];
const MILESTONES = [
  { days: 3, reward: "+25 pts", unlocked: true },
  { days: 7, reward: "+100 pts", unlocked: true },
  { days: 14, reward: "+250 pts", unlocked: false },
  { days: 30, reward: "Free Prime week", unlocked: false },
];

export default function StreakScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const currentStreak = 5;
  const bestStreak = 12;

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Daily streak" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {/* Streak hero */}
        <View style={[styles.heroCard, { backgroundColor: colors.primary }, shadows.lg]}>
          <Text style={styles.fireEmoji}>🔥</Text>
          <Text style={[styles.streakNum, { color: colors.primaryForeground }]}>{currentStreak}</Text>
          <Text style={[styles.streakLabel, { color: "rgba(247,245,240,0.8)" }]}>day streak</Text>
          <View style={styles.statsRow}>
            <View style={[styles.statItem, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
              <Text style={styles.statVal}>{bestStreak}</Text>
              <Text style={styles.statLbl}>Best streak</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
              <Text style={styles.statVal}>+25 pts</Text>
              <Text style={styles.statLbl}>Today's reward</Text>
            </View>
          </View>
        </View>

        {/* This week */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>This week</Text>
        <View style={[styles.weekCard, { backgroundColor: colors.card }, shadows.sm]}>
          <View style={styles.weekRow}>
            {WEEK_DAYS.map((day, i) => (
              <View key={i} style={styles.dayItem}>
                <Text style={[styles.dayLabel, { color: colors.mutedForeground }]}>{day}</Text>
                <View style={[styles.dayDot, {
                  backgroundColor: WEEK_STATUS[i] ? colors.accentGreen : colors.muted,
                }]}>
                  {WEEK_STATUS[i] && <Feather name="check" size={12} color="#FFF" />}
                </View>
              </View>
            ))}
          </View>
          <Text style={[styles.weekNote, { color: colors.secondary }]}>
            5/7 days completed this week
          </Text>
        </View>

        {/* Milestones */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Streak milestones</Text>
        {MILESTONES.map((m) => {
          const progress = Math.min(1, currentStreak / m.days);
          return (
            <View key={m.days} style={[styles.milestoneCard, { backgroundColor: colors.card }, shadows.sm]}>
              <View style={[styles.milestoneIcon, {
                backgroundColor: m.unlocked ? colors.accentGreen + "18" : colors.muted
              }]}>
                <Feather name={m.unlocked ? "check-circle" : "lock"} size={20}
                  color={m.unlocked ? colors.accentGreen : colors.mutedForeground} />
              </View>
              <View style={styles.milestoneInfo}>
                <Text style={[styles.milestoneDays, { color: colors.primary }]}>{m.days}-day streak</Text>
                <Text style={[styles.milestoneReward, { color: m.unlocked ? colors.accentGreen : colors.mutedForeground }]}>
                  {m.reward}
                </Text>
                <View style={[styles.progressBg, { backgroundColor: colors.muted }]}>
                  <View style={[styles.progressFill, {
                    width: `${progress * 100}%`,
                    backgroundColor: m.unlocked ? colors.accentGreen : colors.accentOrange
                  }]} />
                </View>
              </View>
              <Text style={[styles.milestoneProgress, { color: colors.mutedForeground }]}>
                {Math.min(currentStreak, m.days)}/{m.days}
              </Text>
            </View>
          );
        })}

        {/* Tips */}
        <View style={[styles.tipsCard, { backgroundColor: colors.muted }]}>
          <Feather name="info" size={16} color={colors.accentBlue} />
          <Text style={[styles.tipsText, { color: colors.secondary }]}>
            Place at least one order per day to maintain your streak. Missing a day resets it.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 16 },
  heroCard: { borderRadius: 28, padding: 28, gap: 6, alignItems: "center" },
  fireEmoji: { fontSize: 52 },
  streakNum: { fontFamily: "Inter_700Bold", fontSize: 80, letterSpacing: -4, lineHeight: 80 },
  streakLabel: { fontFamily: "Inter_400Regular", fontSize: 18 },
  statsRow: { flexDirection: "row", gap: 10, marginTop: 10 },
  statItem: { borderRadius: 14, padding: 14, alignItems: "center", minWidth: 100 },
  statVal: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#FFF" },
  statLbl: { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(247,245,240,0.7)" },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5 },
  weekCard: { borderRadius: 22, padding: 20, gap: 14 },
  weekRow: { flexDirection: "row", justifyContent: "space-between" },
  dayItem: { alignItems: "center", gap: 8 },
  dayLabel: { fontFamily: "Inter_500Medium", fontSize: 12 },
  dayDot: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  weekNote: { fontFamily: "Inter_400Regular", fontSize: 13 },
  milestoneCard: { borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  milestoneIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  milestoneInfo: { flex: 1, gap: 4 },
  milestoneDays: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  milestoneReward: { fontFamily: "Inter_700Bold", fontSize: 13 },
  progressBg: { height: 4, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2 },
  milestoneProgress: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  tipsCard: { borderRadius: 14, padding: 14, flexDirection: "row", gap: 10, alignItems: "flex-start" },
  tipsText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
});
