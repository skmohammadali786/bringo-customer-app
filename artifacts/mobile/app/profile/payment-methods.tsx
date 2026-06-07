import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const SAVED_METHODS = [
  { id: "upi1", type: "UPI", label: "GPay", detail: "user@okaxis", icon: "smartphone" as const, color: "#4A90E2", isDefault: true },
  { id: "card1", type: "Card", label: "HDFC Visa", detail: "•••• •••• •••• 4242", icon: "credit-card" as const, color: "#FF9A3D", isDefault: false },
  { id: "card2", type: "Card", label: "SBI Mastercard", detail: "•••• •••• •••• 8374", icon: "credit-card" as const, color: "#34C759", isDefault: false },
];

export default function PaymentMethodsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [methods, setMethods] = useState(SAVED_METHODS);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const setDefault = (id: string) => setMethods((m) => m.map((x) => ({ ...x, isDefault: x.id === id })));
  const remove = (id: string) => setMethods((m) => m.filter((x) => x.id !== id));

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Payment methods" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>

        {/* Wallet */}
        <View style={[styles.walletCard, { backgroundColor: colors.primary }, shadows.lg]}>
          <View style={styles.walletTop}>
            <Text style={[styles.walletLabel, { color: "rgba(247,245,240,0.7)" }]}>Bringo Wallet</Text>
            <View style={[styles.walletBadge, { backgroundColor: colors.accentOrange }]}>
              <Text style={styles.walletBadgeText}>Default</Text>
            </View>
          </View>
          <Text style={[styles.walletBalance, { color: colors.primaryForeground }]}>₹1,250</Text>
          <Pressable style={[styles.addMoneyBtn, { backgroundColor: colors.accentOrange }]}
            onPress={() => router.push("/wallet/add" as any)}>
            <Feather name="plus" size={14} color="#FFF" />
            <Text style={styles.addMoneyText}>Add money</Text>
          </Pressable>
        </View>

        {/* Saved methods */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Saved methods</Text>
        {methods.map((m) => (
          <View key={m.id} style={[styles.methodCard, { backgroundColor: colors.card }, shadows.sm]}>
            <View style={[styles.methodIcon, { backgroundColor: m.color + "18" }]}>
              <Feather name={m.icon} size={20} color={m.color} />
            </View>
            <View style={styles.methodInfo}>
              <View style={styles.methodTop}>
                <Text style={[styles.methodLabel, { color: colors.primary }]}>{m.label}</Text>
                {m.isDefault && (
                  <View style={[styles.defaultBadge, { backgroundColor: colors.accentGreen + "18" }]}>
                    <Text style={[styles.defaultText, { color: colors.accentGreen }]}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.methodDetail, { color: colors.mutedForeground }]}>{m.type} · {m.detail}</Text>
            </View>
            <View style={styles.methodActions}>
              {!m.isDefault && (
                <Pressable onPress={() => setDefault(m.id)} hitSlop={8}>
                  <Text style={[styles.setDefaultText, { color: colors.accentOrange }]}>Set default</Text>
                </Pressable>
              )}
              <Pressable onPress={() => remove(m.id)} hitSlop={8}>
                <Feather name="trash-2" size={16} color={colors.danger} />
              </Pressable>
            </View>
          </View>
        ))}

        {/* Add new */}
        <Pressable style={[styles.addNewBtn, { backgroundColor: colors.card, borderColor: colors.border }, shadows.sm]}
          onPress={() => router.push("/profile/add-payment" as any)}>
          <View style={[styles.addNewIcon, { backgroundColor: colors.muted }]}>
            <Feather name="plus" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.addNewText, { color: colors.primary }]}>Add new payment method</Text>
          <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
        </Pressable>

        <View style={[styles.infoCard, { backgroundColor: colors.muted }]}>
          <Feather name="shield" size={16} color={colors.accentGreen} />
          <Text style={[styles.infoText, { color: colors.secondary }]}>
            Your payment info is encrypted and never stored on our servers.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 14 },
  walletCard: { borderRadius: 24, padding: 22, gap: 8 },
  walletTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  walletLabel: { fontFamily: "Inter_400Regular", fontSize: 13 },
  walletBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  walletBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: "#FFF" },
  walletBalance: { fontFamily: "Inter_700Bold", fontSize: 40, letterSpacing: -2 },
  addMoneyBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9, alignSelf: "flex-start", marginTop: 4 },
  addMoneyText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#FFF" },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5 },
  methodCard: { borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  methodIcon: { width: 46, height: 46, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  methodInfo: { flex: 1, gap: 3 },
  methodTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  methodLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  defaultBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  defaultText: { fontFamily: "Inter_500Medium", fontSize: 11 },
  methodDetail: { fontFamily: "Inter_400Regular", fontSize: 13 },
  methodActions: { gap: 8, alignItems: "flex-end" },
  setDefaultText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  addNewBtn: { borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1.5, borderStyle: "dashed" },
  addNewIcon: { width: 46, height: 46, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  addNewText: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 15 },
  infoCard: { borderRadius: 14, padding: 14, flexDirection: "row", gap: 10, alignItems: "flex-start" },
  infoText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
});
