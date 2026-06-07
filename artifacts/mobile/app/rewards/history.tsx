import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const HISTORY = [
  { id: "h1", type: "earned", title: "Order placed", desc: "2× cashback for Prime", points: +50, date: "Today", time: "6:14 PM" },
  { id: "h2", type: "redeemed", title: "Redeemed for ₹50 cashback", desc: "Bringo Wallet credit", points: -200, date: "Yesterday", time: "10:22 AM" },
  { id: "h3", type: "earned", title: "Referral bonus", desc: "Priya M. completed first order", points: +200, date: "Dec 20", time: "3:10 PM" },
  { id: "h4", type: "earned", title: "Review reward", desc: "Left a product review", points: +25, date: "Dec 18", time: "2:00 PM" },
  { id: "h5", type: "earned", title: "Order placed", desc: "Standard cashback", points: +30, date: "Dec 15", time: "7:45 PM" },
  { id: "h6", type: "earned", title: "Daily streak bonus", desc: "5-day streak", points: +100, date: "Dec 10", time: "9:00 AM" },
  { id: "h7", type: "expired", title: "Points expired", desc: "Inactive for 30 days", points: -50, date: "Dec 1", time: "12:00 AM" },
];

export default function RewardsHistoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState("All");
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const filters = ["All", "Earned", "Redeemed"];
  const filtered = filter === "All" ? HISTORY : HISTORY.filter((h) => h.type === filter.toLowerCase());
  const totalPoints = HISTORY.reduce((s, h) => s + h.points, 0);

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Points history" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {/* Balance */}
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }, shadows.card]}>
          <Text style={[styles.balLabel, { color: "rgba(247,245,240,0.7)" }]}>Current balance</Text>
          <Text style={[styles.balPoints, { color: colors.primaryForeground }]}>{Math.max(0, totalPoints)} pts</Text>
          <Pressable style={[styles.redeemBtn, { backgroundColor: colors.accentOrange }]}
            onPress={() => router.push("/rewards/redeem" as any)}>
            <Text style={styles.redeemText}>Redeem</Text>
          </Pressable>
        </View>

        {/* Filter */}
        <View style={styles.filterRow}>
          {filters.map((f) => {
            const active = filter === f;
            return (
              <Pressable key={f} onPress={() => setFilter(f)}
                style={[styles.filterPill, { backgroundColor: active ? colors.primary : colors.card }]}>
                <Text style={[styles.filterText, { color: active ? colors.primaryForeground : colors.primary }]}>{f}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* History */}
        <View style={[styles.historyCard, { backgroundColor: colors.card }, shadows.sm]}>
          {filtered.map((item, i) => {
            const isPositive = item.points > 0;
            const isExpired = item.type === "expired";
            return (
              <View key={item.id}>
                {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                <View style={styles.historyRow}>
                  <View style={[styles.historyIcon, {
                    backgroundColor: isExpired ? colors.muted : isPositive ? colors.accentGreen + "18" : colors.accentOrange + "18"
                  }]}>
                    <Feather
                      name={isExpired ? "clock" : isPositive ? "arrow-down-left" : "arrow-up-right"}
                      size={16}
                      color={isExpired ? colors.mutedForeground : isPositive ? colors.accentGreen : colors.accentOrange}
                    />
                  </View>
                  <View style={styles.historyInfo}>
                    <Text style={[styles.historyTitle, { color: colors.primary }]}>{item.title}</Text>
                    <Text style={[styles.historyDesc, { color: colors.mutedForeground }]}>{item.desc}</Text>
                    <Text style={[styles.historyTime, { color: colors.mutedForeground }]}>{item.date} · {item.time}</Text>
                  </View>
                  <Text style={[styles.historyPoints, {
                    color: isExpired ? colors.mutedForeground : isPositive ? colors.accentGreen : colors.danger
                  }]}>
                    {isPositive ? "+" : ""}{item.points}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 16 },
  balanceCard: { borderRadius: 22, padding: 22, gap: 8 },
  balLabel: { fontFamily: "Inter_400Regular", fontSize: 13 },
  balPoints: { fontFamily: "Inter_700Bold", fontSize: 44, letterSpacing: -2 },
  redeemBtn: { alignSelf: "flex-start", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
  redeemText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#FFF" },
  filterRow: { flexDirection: "row", gap: 8 },
  filterPill: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9 },
  filterText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  historyCard: { borderRadius: 20, overflow: "hidden" },
  divider: { height: 1, marginHorizontal: 14 },
  historyRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  historyIcon: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  historyInfo: { flex: 1, gap: 2 },
  historyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  historyDesc: { fontFamily: "Inter_400Regular", fontSize: 12 },
  historyTime: { fontFamily: "Inter_400Regular", fontSize: 11 },
  historyPoints: { fontFamily: "Inter_700Bold", fontSize: 16 },
});
