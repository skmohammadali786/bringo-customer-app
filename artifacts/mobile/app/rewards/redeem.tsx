import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const REWARDS = [
  { id: "r1", title: "₹50 cashback", desc: "Added to Bringo Wallet", points: 200, color: "#34C759", icon: "credit-card" as const },
  { id: "r2", title: "Free delivery voucher", desc: "1 month of free deliveries", points: 500, color: "#4A90E2", icon: "truck" as const },
  { id: "r3", title: "₹100 cashback", desc: "Added to Bringo Wallet", points: 400, color: "#FF9A3D", icon: "credit-card" as const },
  { id: "r4", title: "Prime upgrade (1 month)", desc: "Bringo Prime membership", points: 800, color: "#9B59B6", icon: "award" as const },
  { id: "r5", title: "10% off next order", desc: "Applied automatically at checkout", points: 300, color: "#E74C3C", icon: "percent" as const },
];

export default function RedeemRewardsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;
  const myPoints = 450;

  const handleRedeem = async () => {
    if (!selected) return;
    setRedeeming(true);
    await new Promise((r) => setTimeout(r, 1200));
    router.back();
  };

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Redeem points" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad + 80 }]}>
        {/* Balance */}
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }, shadows.lg]}>
          <Text style={[styles.balanceLabel, { color: "rgba(247,245,240,0.7)" }]}>Your points</Text>
          <Text style={[styles.balancePoints, { color: colors.primaryForeground }]}>{myPoints}</Text>
          <View style={[styles.balanceBadge, { backgroundColor: colors.accentOrange }]}>
            <Text style={styles.balanceBadgeText}>Silver tier</Text>
          </View>
          <View style={styles.progressWrap}>
            <View style={[styles.progressBg, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
              <View style={[styles.progressFill, { width: `${(myPoints / 1000) * 100}%`, backgroundColor: colors.accentOrange }]} />
            </View>
            <Text style={[styles.progressText, { color: "rgba(247,245,240,0.7)" }]}>550 pts to Gold tier</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Choose a reward</Text>
        {REWARDS.map((reward) => {
          const canAfford = myPoints >= reward.points;
          const isSelected = selected === reward.id;
          return (
            <Pressable key={reward.id} onPress={() => canAfford && setSelected(isSelected ? null : reward.id)}
              style={[
                styles.rewardCard,
                {
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderColor: isSelected ? colors.primary : canAfford ? colors.card : colors.muted,
                  opacity: canAfford ? 1 : 0.5,
                },
                shadows.sm,
              ]}>
              <View style={[styles.rewardIcon, { backgroundColor: isSelected ? "rgba(255,255,255,0.15)" : reward.color + "18" }]}>
                <Feather name={reward.icon} size={22} color={isSelected ? "#FFF" : reward.color} />
              </View>
              <View style={styles.rewardInfo}>
                <Text style={[styles.rewardTitle, { color: isSelected ? colors.primaryForeground : colors.primary }]}>{reward.title}</Text>
                <Text style={[styles.rewardDesc, { color: isSelected ? "rgba(247,245,240,0.7)" : colors.mutedForeground }]}>{reward.desc}</Text>
              </View>
              <View style={styles.rewardRight}>
                <View style={[styles.pointsBadge, { backgroundColor: isSelected ? "rgba(255,255,255,0.15)" : colors.muted }]}>
                  <Text style={[styles.pointsText, { color: isSelected ? colors.primaryForeground : colors.primary }]}>{reward.points} pts</Text>
                </View>
                {!canAfford && (
                  <Text style={[styles.shortfallText, { color: colors.danger }]}>
                    Need {reward.points - myPoints} more
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <Button label={selected ? `Redeem for ${REWARDS.find((r) => r.id === selected)?.points} pts` : "Select a reward"}
          onPress={handleRedeem} loading={redeeming} disabled={!selected} variant="primary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 14 },
  balanceCard: { borderRadius: 24, padding: 22, gap: 8 },
  balanceLabel: { fontFamily: "Inter_400Regular", fontSize: 13 },
  balancePoints: { fontFamily: "Inter_700Bold", fontSize: 52, letterSpacing: -2 },
  balanceBadge: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, alignSelf: "flex-start" },
  balanceBadgeText: { fontFamily: "Inter_700Bold", fontSize: 12, color: "#FFF", letterSpacing: 0.5 },
  progressWrap: { gap: 6 },
  progressBg: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  progressText: { fontFamily: "Inter_400Regular", fontSize: 12 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5 },
  rewardCard: { borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 2 },
  rewardIcon: { width: 50, height: 50, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  rewardInfo: { flex: 1, gap: 2 },
  rewardTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  rewardDesc: { fontFamily: "Inter_400Regular", fontSize: 12 },
  rewardRight: { alignItems: "flex-end", gap: 4 },
  pointsBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  pointsText: { fontFamily: "Inter_700Bold", fontSize: 13 },
  shortfallText: { fontFamily: "Inter_400Regular", fontSize: 11 },
  footer: { paddingHorizontal: spacing.pagePadding, paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
});
