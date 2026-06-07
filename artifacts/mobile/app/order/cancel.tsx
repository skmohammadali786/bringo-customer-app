import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const REASONS = [
  "Changed my mind",
  "Ordered by mistake",
  "Found a better price elsewhere",
  "Delivery taking too long",
  "Item no longer needed",
  "Address entered incorrectly",
];

export default function CancelOrderScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [reason, setReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const handleCancel = async () => {
    setCancelling(true);
    await new Promise((r) => setTimeout(r, 1200));
    router.replace("/(tabs)/orders" as any);
  };

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Cancel order" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad + 90 }]}>
        {/* Warning */}
        <View style={[styles.warningCard, { backgroundColor: colors.danger + "12", borderColor: colors.danger + "30" }]}>
          <Feather name="alert-triangle" size={20} color={colors.danger} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[styles.warningTitle, { color: colors.primary }]}>Cancel order #ORD9A2F?</Text>
            <Text style={[styles.warningText, { color: colors.secondary }]}>
              Your agent has already started sourcing. A 10% cancellation fee may apply.
            </Text>
          </View>
        </View>

        {/* Refund info */}
        <View style={[styles.refundCard, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.refundTitle, { color: colors.primary }]}>Refund estimate</Text>
          {[
            { label: "Order total", value: "₹181" },
            { label: "Cancellation fee (10%)", value: "−₹18", red: true },
            { label: "Refund to wallet", value: "₹163", green: true },
          ].map((row) => (
            <View key={row.label} style={styles.refundRow}>
              <Text style={[styles.refundLabel, { color: colors.secondary }]}>{row.label}</Text>
              <Text style={[styles.refundValue, { color: row.red ? colors.danger : row.green ? colors.accentGreen : colors.primary }]}>{row.value}</Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.refundNote, { color: colors.mutedForeground }]}>
            Refund will be credited to your Bringo Wallet within 2 minutes.
          </Text>
        </View>

        {/* Reason */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>Reason for cancellation</Text>
          {REASONS.map((r) => (
            <Pressable key={r} onPress={() => setReason(r)}
              style={[styles.reasonRow, { backgroundColor: colors.card, borderColor: reason === r ? colors.primary : "transparent", borderWidth: reason === r ? 2 : 0 }, shadows.sm]}>
              <Text style={[styles.reasonText, { color: colors.primary }]}>{r}</Text>
              <View style={[styles.radio, { borderColor: reason === r ? colors.primary : colors.border }]}>
                {reason === r && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <Button label="Keep order" onPress={() => router.back()} variant="ghost" style={styles.keepBtn} />
        <Button label="Cancel order" onPress={handleCancel} loading={cancelling} disabled={!reason}
          variant="danger" style={styles.cancelBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 18 },
  warningCard: { borderRadius: 18, padding: 16, flexDirection: "row", gap: 12, alignItems: "flex-start", borderWidth: 1 },
  warningTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  warningText: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
  refundCard: { borderRadius: 20, padding: 18, gap: 10 },
  refundTitle: { fontFamily: "Inter_700Bold", fontSize: 16, letterSpacing: -0.5, marginBottom: 4 },
  refundRow: { flexDirection: "row", justifyContent: "space-between" },
  refundLabel: { fontFamily: "Inter_400Regular", fontSize: 14 },
  refundValue: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  divider: { height: 1, marginVertical: 4 },
  refundNote: { fontFamily: "Inter_400Regular", fontSize: 12, lineHeight: 17 },
  section: { gap: 10 },
  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 17, letterSpacing: -0.5 },
  reasonRow: { borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  reasonText: { fontFamily: "Inter_400Regular", fontSize: 14, flex: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  footer: { paddingHorizontal: spacing.pagePadding, paddingTop: 14, flexDirection: "row", gap: 10, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
  keepBtn: { flex: 1 },
  cancelBtn: { flex: 1 },
});
