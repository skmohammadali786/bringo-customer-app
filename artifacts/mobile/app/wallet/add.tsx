import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000];
const PAYMENT_OPTIONS = [
  { id: "upi", label: "UPI", subtitle: "GPay · PhonePe · Paytm", icon: "smartphone" as const, color: "#4A90E2" },
  { id: "card", label: "Debit / Credit Card", subtitle: "Visa · Mastercard · RuPay", icon: "credit-card" as const, color: "#FF9A3D" },
  { id: "netbanking", label: "Net Banking", subtitle: "All major banks", icon: "globe" as const, color: "#34C759" },
];

export default function AddMoneyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState("upi");
  const [adding, setAdding] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const numAmount = parseInt(amount) || 0;
  const isValid = numAmount >= 10 && numAmount <= 50000;

  const handleAdd = async () => {
    if (!isValid) return;
    setAdding(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BackHeader title="Add money" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 90 }]}
      >
        {/* Amount Input */}
        <View style={[styles.amountCard, { backgroundColor: colors.card }, shadows.card]}>
          <Text style={[styles.amountLabel, { color: colors.mutedForeground }]}>Enter amount</Text>
          <View style={styles.amountRow}>
            <Text style={[styles.rupee, { color: colors.primary }]}>₹</Text>
            <TextInput
              value={amount}
              onChangeText={(v) => setAmount(v.replace(/[^0-9]/g, "").slice(0, 5))}
              placeholder="0"
              placeholderTextColor={colors.border}
              keyboardType="number-pad"
              style={[styles.amountInput, { color: colors.primary }]}
              autoFocus
            />
          </View>
          {numAmount > 0 && !isValid && (
            <Text style={[styles.amtError, { color: colors.danger }]}>
              {numAmount < 10 ? "Minimum ₹10" : "Maximum ₹50,000"}
            </Text>
          )}
        </View>

        {/* Quick amounts */}
        <View style={styles.quickWrap}>
          {QUICK_AMOUNTS.map((amt) => (
            <Pressable
              key={amt}
              onPress={() => setAmount(String(amt))}
              style={[
                styles.quickBtn,
                {
                  backgroundColor: amount === String(amt) ? colors.primary : colors.card,
                },
                shadows.sm,
              ]}
            >
              <Text
                style={[
                  styles.quickText,
                  { color: amount === String(amt) ? colors.primaryForeground : colors.primary },
                ]}
              >
                +₹{amt}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Offer Banner */}
        <View style={[styles.offerBanner, { backgroundColor: colors.accentOrange + "18" }]}>
          <Feather name="gift" size={20} color={colors.accentOrange} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.offerTitle, { color: colors.primary }]}>Add ₹1000, get ₹50 bonus!</Text>
            <Text style={[styles.offerSub, { color: colors.secondary }]}>Limited time offer</Text>
          </View>
        </View>

        {/* Payment Method */}
        <Text style={[styles.sectionLabel, { color: colors.primary }]}>Pay via</Text>
        <View style={styles.payOptions}>
          {PAYMENT_OPTIONS.map((opt) => {
            const active = selected === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setSelected(opt.id)}
                style={[
                  styles.payOpt,
                  {
                    backgroundColor: colors.card,
                    borderColor: active ? colors.primary : "transparent",
                    borderWidth: active ? 2 : 1,
                  },
                  shadows.sm,
                ]}
              >
                <View style={[styles.payIcon, { backgroundColor: opt.color + "18" }]}>
                  <Feather name={opt.icon} size={20} color={opt.color} />
                </View>
                <View style={styles.payText}>
                  <Text style={[styles.payLabel, { color: colors.primary }]}>{opt.label}</Text>
                  <Text style={[styles.paySub, { color: colors.mutedForeground }]}>{opt.subtitle}</Text>
                </View>
                {active && (
                  <View style={[styles.checkCircle, { backgroundColor: colors.primary }]}>
                    <Feather name="check" size={12} color={colors.primaryForeground} />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <Button
          label={numAmount > 0 && isValid ? `Add ₹${numAmount.toLocaleString("en-IN")}` : "Add Money"}
          onPress={handleAdd}
          loading={adding}
          disabled={!isValid}
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.pagePadding, gap: 20 },
  amountCard: { borderRadius: 24, padding: 28, alignItems: "center", gap: 8 },
  amountLabel: { fontFamily: "Inter_400Regular", fontSize: 14 },
  amountRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  rupee: { fontSize: 40, fontFamily: "Inter_700Bold" },
  amountInput: {
    fontSize: 64,
    fontFamily: "Inter_700Bold",
    letterSpacing: -3,
    minWidth: 60,
    textAlign: "center",
  },
  amtError: { fontFamily: "Inter_400Regular", fontSize: 13 },
  quickWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  quickBtn: { borderRadius: 12, paddingHorizontal: 18, paddingVertical: 10 },
  quickText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  offerBanner: {
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  offerTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  offerSub: { fontFamily: "Inter_400Regular", fontSize: 12 },
  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 17, letterSpacing: -0.5 },
  payOptions: { gap: 10 },
  payOpt: {
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  payIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  payText: { flex: 1, gap: 2 },
  payLabel: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  paySub: { fontFamily: "Inter_400Regular", fontSize: 12 },
  checkCircle: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.pagePadding,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
});
