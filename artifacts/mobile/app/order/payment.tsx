import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", subtitle: "Pay via any UPI app", icon: "smartphone" as const, color: "#4A90E2" },
  { id: "wallet", label: "Bringo Wallet", subtitle: "Balance: ₹1,514", icon: "credit-card" as const, color: "#34C759" },
  { id: "card", label: "Credit / Debit Card", subtitle: "Visa, Mastercard, RuPay", icon: "credit-card" as const, color: "#FF9A3D" },
  { id: "cod", label: "Cash on Delivery", subtitle: "Pay when delivered", icon: "package" as const, color: "#5B5B5B" },
];

export default function PaymentScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState("wallet");
  const [paying, setPaying] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const handlePay = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1800));
    router.replace("/order/success" as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.primary }]}>
          How would you like to pay?
        </Text>

        <View style={styles.methods}>
          {PAYMENT_METHODS.map((method) => (
            <Pressable
              key={method.id}
              onPress={() => setSelected(method.id)}
              style={[
                styles.methodCard,
                {
                  backgroundColor: colors.card,
                  borderColor: selected === method.id ? colors.primary : "transparent",
                  borderWidth: selected === method.id ? 2 : 0,
                },
                shadows.sm,
              ]}
            >
              <View style={[styles.methodIcon, { backgroundColor: `${method.color}18` }]}>
                <Feather name={method.icon} size={20} color={method.color} />
              </View>
              <View style={styles.methodText}>
                <Text style={[styles.methodLabel, { color: colors.primary }]}>{method.label}</Text>
                <Text style={[styles.methodSub, { color: colors.mutedForeground }]}>{method.subtitle}</Text>
              </View>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: selected === method.id ? colors.primary : colors.border,
                    backgroundColor: selected === method.id ? colors.primary : "transparent",
                  },
                ]}
              >
                {selected === method.id && (
                  <Feather name="check" size={12} color={colors.primaryForeground} />
                )}
              </View>
            </Pressable>
          ))}
        </View>

        {/* Security note */}
        <View style={[styles.securityNote, { backgroundColor: colors.muted }]}>
          <Feather name="shield" size={16} color={colors.accentGreen} />
          <Text style={[styles.securityText, { color: colors.secondary }]}>
            Your payment is 100% secure and encrypted
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: botPad }]}>
        <View style={[styles.amountRow, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.amountLabel, { color: colors.secondary }]}>Amount to pay</Text>
          <Text style={[styles.amount, { color: colors.primary }]}>₹594</Text>
        </View>
        <Button label="Pay Now" onPress={handlePay} loading={paying} />
      </View>
    </View>
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
  headerTitle: { ...typography.bodySemiBold, fontSize: 17 },
  content: { paddingHorizontal: spacing.pagePadding },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -1, marginBottom: 24 },
  methods: { gap: 12 },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    gap: 14,
  },
  methodIcon: { width: 46, height: 46, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  methodText: { flex: 1, gap: 2 },
  methodLabel: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  methodSub: { fontFamily: "Inter_400Regular", fontSize: 13 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    marginTop: 24,
  },
  securityText: { ...typography.small, flex: 1 },
  footer: { paddingHorizontal: spacing.pagePadding, paddingTop: 16, gap: 12 },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 16,
  },
  amountLabel: { ...typography.bodyMedium },
  amount: { fontFamily: "Inter_700Bold", fontSize: 22 },
});
