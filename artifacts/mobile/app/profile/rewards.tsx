import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const BENEFITS = [
  { icon: "truck" as const, label: "Free Delivery", desc: "On all orders above ₹199", tier: "Silver" },
  { icon: "tag" as const, label: "Exclusive Discounts", desc: "Up to 20% off on select products", tier: "Silver" },
  { icon: "star" as const, label: "Priority Support", desc: "24/7 dedicated support line", tier: "Gold" },
  { icon: "gift" as const, label: "Birthday Bonus", desc: "₹200 bonus every year", tier: "Gold" },
];

export default function RewardsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: botPad }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.primary }]}>Rewards</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Points Card */}
        <View style={[styles.pointsCard, { backgroundColor: colors.primary }, shadows.lg]}>
          <View style={styles.tierRow}>
            <View style={[styles.tierBadge, { backgroundColor: colors.accentOrange }]}>
              <Feather name="award" size={14} color="#FFF" />
              <Text style={styles.tierText}>Silver Member</Text>
            </View>
          </View>
          <Text style={[styles.pointsLabel, { color: "rgba(247,245,240,0.6)" }]}>Your Points</Text>
          <Text style={[styles.pointsValue, { color: colors.primaryForeground }]}>450</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { backgroundColor: colors.accentOrange, width: "45%" }]} />
          </View>
          <Text style={[styles.nextTier, { color: "rgba(247,245,240,0.6)" }]}>
            550 more points to reach Gold
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Your Benefits</Text>

        {BENEFITS.map((b) => (
          <View key={b.label} style={[styles.benefitCard, { backgroundColor: colors.card }, shadows.sm]}>
            <View style={[styles.benefitIcon, { backgroundColor: colors.muted }]}>
              <Feather name={b.icon} size={20} color={colors.accentOrange} />
            </View>
            <View style={styles.benefitText}>
              <Text style={[styles.benefitLabel, { color: colors.primary }]}>{b.label}</Text>
              <Text style={[styles.benefitDesc, { color: colors.secondary }]}>{b.desc}</Text>
            </View>
            <View style={[styles.tierIndicator, { backgroundColor: b.tier === "Silver" ? colors.muted : colors.accentOrange + "20" }]}>
              <Text style={[styles.tierIndicatorText, { color: b.tier === "Silver" ? colors.secondary : colors.accentOrange }]}>{b.tier}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.pagePadding,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { ...typography.h3 },
  content: { paddingHorizontal: spacing.pagePadding, gap: 16 },
  pointsCard: { borderRadius: 28, padding: 24, gap: 8 },
  tierRow: { marginBottom: 8 },
  tierBadge: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, alignSelf: "flex-start" },
  tierText: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: "#FFF" },
  pointsLabel: { fontFamily: "Inter_400Regular", fontSize: 13 },
  pointsValue: { fontFamily: "Inter_700Bold", fontSize: 56, letterSpacing: -2 },
  progressBar: { height: 6, backgroundColor: "rgba(247,245,240,0.2)", borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  nextTier: { fontFamily: "Inter_400Regular", fontSize: 12 },
  sectionTitle: { ...typography.sectionTitle },
  benefitCard: { flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 18, padding: 16 },
  benefitIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  benefitText: { flex: 1, gap: 2 },
  benefitLabel: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  benefitDesc: { fontFamily: "Inter_400Regular", fontSize: 12 },
  tierIndicator: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  tierIndicatorText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
});
