import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { WALLET_TRANSACTIONS } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

export default function WalletScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + spacing.tabBarHeight;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: botPad }}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        entering={FadeInDown.duration(400).delay(0)}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <Text style={[styles.title, { color: colors.primary }]}>Wallet</Text>
      </Animated.View>

      {/* Balance Card */}
      <Animated.View entering={FadeInDown.duration(400).delay(80)} style={styles.balanceWrap}>
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }, shadows.lg]}>
          <View style={styles.balanceTop}>
            <View style={[styles.walletIcon, { backgroundColor: "rgba(247,245,240,0.15)" }]}>
              <Feather name="credit-card" size={22} color={colors.primaryForeground} />
            </View>
            <View style={[styles.cashbackBadge, { backgroundColor: colors.accentOrange }]}>
              <Text style={styles.cashbackText}>Earn cashback</Text>
            </View>
          </View>
          <Text style={[styles.balanceLabel, { color: "rgba(247,245,240,0.6)" }]}>
            Available Balance
          </Text>
          <Text style={[styles.balance, { color: colors.primaryForeground }]}>
            ₹{user?.walletBalance?.toLocaleString("en-IN") ?? "0"}
          </Text>
          <View style={styles.balanceActions}>
            <Pressable
              style={[styles.walletBtn, { backgroundColor: colors.accentOrange }]}
              onPress={() => router.push("/wallet/add" as any)}
            >
              <Feather name="plus" size={16} color="#FFF" />
              <Text style={styles.walletBtnText}>Add Money</Text>
            </Pressable>
            <Pressable
              style={[styles.walletBtn, { backgroundColor: "rgba(247,245,240,0.15)" }]}
              onPress={() => router.push("/wallet/transfer" as any)}
            >
              <Feather name="arrow-up-right" size={16} color={colors.primaryForeground} />
              <Text style={[styles.walletBtnText, { color: colors.primaryForeground }]}>
                Transfer
              </Text>
            </Pressable>
          </View>
        </View>
      </Animated.View>

      {/* Quick Stats */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(160)}
        style={[styles.section, { flexDirection: "row", gap: 12 }]}
      >
        {[
          { label: "Total Spent", value: "₹4,082", icon: "shopping-bag" as const, color: colors.accentOrange },
          { label: "Cashback Earned", value: "₹250", icon: "gift" as const, color: colors.accentGreen },
        ].map((stat) => (
          <View
            key={stat.label}
            style={[styles.statCard, { backgroundColor: colors.card, flex: 1 }, shadows.sm]}
          >
            <Feather name={stat.icon} size={18} color={stat.color} />
            <Text style={[styles.statValue, { color: colors.primary }]}>{stat.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{stat.label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Transaction History */}
      <Animated.View entering={FadeInDown.duration(400).delay(240)} style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Recent Transactions</Text>
        <View style={[styles.txCard, { backgroundColor: colors.card }, shadows.sm]}>
          {WALLET_TRANSACTIONS.map((tx, i) => (
            <View key={tx.id}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <View style={styles.txRow}>
                <View
                  style={[
                    styles.txIcon,
                    {
                      backgroundColor:
                        tx.type === "credit"
                          ? "rgba(52,199,89,0.12)"
                          : "rgba(255,77,79,0.12)",
                    },
                  ]}
                >
                  <Feather
                    name={tx.type === "credit" ? "arrow-down-left" : "arrow-up-right"}
                    size={16}
                    color={tx.type === "credit" ? colors.accentGreen : colors.danger}
                  />
                </View>
                <View style={styles.txInfo}>
                  <Text style={[styles.txDesc, { color: colors.primary }]}>{tx.description}</Text>
                  <Text style={[styles.txDate, { color: colors.mutedForeground }]}>{tx.date}</Text>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    { color: tx.type === "credit" ? colors.accentGreen : colors.primary },
                  ]}
                >
                  {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: spacing.pagePadding, paddingBottom: 8 },
  title: { ...typography.h2 },
  balanceWrap: { paddingHorizontal: spacing.pagePadding, marginTop: 20 },
  balanceCard: { borderRadius: 28, padding: 24, gap: 8 },
  balanceTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  walletIcon: { width: 44, height: 44, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  cashbackBadge: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  cashbackText: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: "#FFF" },
  balanceLabel: { fontFamily: "Inter_400Regular", fontSize: 13 },
  balance: { fontFamily: "Inter_700Bold", fontSize: 44, letterSpacing: -2, lineHeight: 48 },
  balanceActions: { flexDirection: "row", gap: 12, marginTop: 16 },
  walletBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    paddingVertical: 12,
  },
  walletBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#FFF" },
  section: { paddingHorizontal: spacing.pagePadding, marginTop: 24 },
  statCard: { borderRadius: 20, padding: 16, gap: 6 },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: -0.5 },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 12 },
  sectionTitle: { ...typography.sectionTitle, marginBottom: 12 },
  txCard: { borderRadius: 20, overflow: "hidden" },
  divider: { height: 1, marginHorizontal: 16 },
  txRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  txIcon: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  txInfo: { flex: 1, gap: 2 },
  txDesc: { fontFamily: "Inter_500Medium", fontSize: 14 },
  txDate: { fontFamily: "Inter_400Regular", fontSize: 12 },
  txAmount: { fontFamily: "Inter_700Bold", fontSize: 16 },
});
