import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { WALLET_TRANSACTIONS } from "@/constants/mockData";

export default function WalletHistoryScreen() {
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
        <Text style={[styles.title, { color: colors.primary }]}>Transaction History</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
          {WALLET_TRANSACTIONS.map((tx, i) => (
            <View key={tx.id}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <View style={styles.txRow}>
                <View style={[styles.txIcon, { backgroundColor: tx.type === "credit" ? "rgba(52,199,89,0.12)" : "rgba(255,77,79,0.12)" }]}>
                  <Feather name={tx.type === "credit" ? "arrow-down-left" : "arrow-up-right"} size={16} color={tx.type === "credit" ? colors.accentGreen : colors.danger} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={[styles.txDesc, { color: colors.primary }]}>{tx.description}</Text>
                  <Text style={[styles.txDate, { color: colors.mutedForeground }]}>{tx.date}</Text>
                </View>
                <Text style={[styles.txAmount, { color: tx.type === "credit" ? colors.accentGreen : colors.primary }]}>
                  {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.pagePadding, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { ...typography.h3 },
  content: { paddingHorizontal: spacing.pagePadding },
  card: { borderRadius: 20, overflow: "hidden" },
  divider: { height: 1, marginHorizontal: 16 },
  txRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  txIcon: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  txInfo: { flex: 1, gap: 2 },
  txDesc: { fontFamily: "Inter_500Medium", fontSize: 14 },
  txDate: { fontFamily: "Inter_400Regular", fontSize: 12 },
  txAmount: { fontFamily: "Inter_700Bold", fontSize: 16 },
});
