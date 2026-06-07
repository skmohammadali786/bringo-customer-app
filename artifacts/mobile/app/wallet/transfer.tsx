import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const METHODS = [
  { id: "upi", label: "UPI ID / Phone", icon: "smartphone" as const, placeholder: "Enter UPI ID or phone number" },
  { id: "bank", label: "Bank account", icon: "credit-card" as const, placeholder: "Enter account number" },
];

export default function TransferScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [method, setMethod] = useState("upi");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const numAmount = parseInt(amount) || 0;
  const isValid = recipient.trim().length > 5 && numAmount >= 1 && numAmount <= 1250;
  const walletBalance = 1250;

  const handleTransfer = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.back();
  };

  return (
    <KeyboardAvoidingView style={[{ flex: 1, backgroundColor: colors.background }]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <BackHeader title="Transfer money" />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 80 }]}>
        {/* Balance */}
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }, shadows.lg]}>
          <Text style={[styles.balanceLabel, { color: "rgba(247,245,240,0.7)" }]}>Available balance</Text>
          <Text style={[styles.balanceAmt, { color: colors.primaryForeground }]}>₹{walletBalance.toLocaleString("en-IN")}</Text>
        </View>

        {/* Method */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Transfer to</Text>
        <View style={styles.methodRow}>
          {METHODS.map((m) => (
            <Pressable key={m.id} onPress={() => setMethod(m.id)}
              style={[styles.methodBtn, { backgroundColor: method === m.id ? colors.primary : colors.card, borderColor: method === m.id ? colors.primary : colors.border }, shadows.sm]}>
              <Feather name={m.icon} size={18} color={method === m.id ? colors.primaryForeground : colors.secondary} />
              <Text style={[styles.methodLabel, { color: method === m.id ? colors.primaryForeground : colors.primary }]}>{m.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Recipient */}
        <View style={styles.section}>
          <Text style={[styles.fieldLabel, { color: colors.secondary }]}>
            {METHODS.find((m) => m.id === method)?.label}
          </Text>
          <TextInput value={recipient} onChangeText={setRecipient}
            placeholder={METHODS.find((m) => m.id === method)?.placeholder ?? ""}
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { backgroundColor: colors.card, color: colors.primary, borderColor: colors.border }]} />
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={[styles.fieldLabel, { color: colors.secondary }]}>Amount (max ₹{walletBalance})</Text>
          <View style={[styles.amountRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.rupeeSign, { color: colors.primary }]}>₹</Text>
            <TextInput value={amount} onChangeText={(v) => setAmount(v.replace(/[^0-9]/g, "").slice(0, 5))}
              placeholder="0" placeholderTextColor={colors.border} keyboardType="number-pad"
              style={[styles.amountInput, { color: colors.primary }]} />
          </View>
          {numAmount > walletBalance && (
            <Text style={[styles.errorText, { color: colors.danger }]}>Exceeds wallet balance</Text>
          )}
        </View>

        <View style={[styles.noteCard, { backgroundColor: colors.muted }]}>
          <Feather name="info" size={16} color={colors.mutedForeground} />
          <Text style={[styles.noteText, { color: colors.secondary }]}>
            Transfers from Bringo Wallet are instant and free.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <Button label={numAmount > 0 && isValid ? `Transfer ₹${numAmount}` : "Transfer"} onPress={handleTransfer}
          loading={sending} disabled={!isValid} variant="primary" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 22 },
  balanceCard: { borderRadius: 22, padding: 22, gap: 6 },
  balanceLabel: { fontFamily: "Inter_400Regular", fontSize: 13 },
  balanceAmt: { fontFamily: "Inter_700Bold", fontSize: 40, letterSpacing: -2 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 17, letterSpacing: -0.4 },
  methodRow: { flexDirection: "row", gap: 10 },
  methodBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 14, paddingVertical: 12, borderWidth: 1.5 },
  methodLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  section: { gap: 8 },
  fieldLabel: { fontFamily: "Inter_500Medium", fontSize: 13 },
  input: { borderRadius: 14, padding: 14, fontFamily: "Inter_400Regular", fontSize: 15, borderWidth: 1 },
  amountRow: { borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 4, borderWidth: 1 },
  rupeeSign: { fontFamily: "Inter_700Bold", fontSize: 24 },
  amountInput: { fontFamily: "Inter_700Bold", fontSize: 32, letterSpacing: -1, flex: 1 },
  errorText: { fontFamily: "Inter_400Regular", fontSize: 13 },
  noteCard: { borderRadius: 14, padding: 14, flexDirection: "row", gap: 8, alignItems: "flex-start" },
  noteText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
  footer: { paddingHorizontal: spacing.pagePadding, paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
});
