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
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const PAYMENT_METHODS = [
  { id: "wallet", label: "Bringo Wallet", subtitle: "Balance: ₹1,250", icon: "credit-card" as const, color: "#FF9A3D" },
  { id: "upi", label: "UPI / Net Banking", subtitle: "GPay, PhonePe, BHIM", icon: "smartphone" as const, color: "#4A90E2" },
  { id: "card", label: "Credit / Debit Card", subtitle: "Visa, Mastercard, RuPay", icon: "credit-card" as const, color: "#34C759" },
  { id: "cod", label: "Cash on Delivery", subtitle: "Pay when delivered", icon: "dollar-sign" as const, color: "#8B4513" },
];

const VALID_CODES: Record<string, { discount: number; label: string }> = {
  "BRINGO10": { discount: 10, label: "10% off" },
  "FIRST50": { discount: 50, label: "₹50 off" },
  "SAVE20": { discount: 20, label: "20% off" },
};

export default function CheckoutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items, total, itemCount, clearCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState("wallet");
  const [placing, setPlacing] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [promoError, setPromoError] = useState("");
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const deliveryFee = total > 199 ? 0 : 29;

  const discountAmount = appliedPromo
    ? VALID_CODES[appliedPromo.code]?.discount > 20
      ? VALID_CODES[appliedPromo.code].discount
      : Math.round((total * VALID_CODES[appliedPromo.code].discount) / 100)
    : 0;

  const grandTotal = Math.max(total + deliveryFee - discountAmount, 0);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (VALID_CODES[code]) {
      setAppliedPromo({ code, ...VALID_CODES[code] });
      setPromoError("");
    } else {
      setPromoError("Invalid promo code. Try BRINGO10 or FIRST50.");
      setAppliedPromo(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoError("");
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1800));
    clearCart();
    router.replace("/order/success" as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BackHeader title="Checkout" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 100 }]}
      >
        {/* Delivery Address */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card }, shadows.sm]}>
          <View style={styles.sectionHead}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Deliver to</Text>
            <Pressable onPress={() => router.push("/checkout/address" as any)}>
              <Text style={[styles.changeText, { color: colors.accentOrange }]}>Change</Text>
            </Pressable>
          </View>
          <View style={styles.addrRow}>
            <View style={[styles.addrDot, { backgroundColor: colors.accentGreen }]} />
            <View style={styles.addrInfo}>
              <Text style={[styles.addrLabel, { color: colors.primary }]}>Home</Text>
              <Text style={[styles.addrVal, { color: colors.secondary }]}>
                Flat 4B, Sunrise Apartments, Koramangala, Bengaluru 560095
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Time */}
        <Pressable
          style={[styles.sectionCard, { backgroundColor: colors.card }, shadows.sm]}
          onPress={() => router.push("/checkout/time" as any)}
        >
          <View style={styles.sectionHead}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Delivery time</Text>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </View>
          <View style={styles.timeRow}>
            <View style={[styles.timeIcon, { backgroundColor: colors.accentBlue + "18" }]}>
              <Feather name="clock" size={18} color={colors.accentBlue} />
            </View>
            <View>
              <Text style={[styles.timeLabel, { color: colors.primary }]}>Express delivery</Text>
              <Text style={[styles.timeSub, { color: colors.mutedForeground }]}>Arrives in 25–35 minutes</Text>
            </View>
          </View>
        </Pressable>

        {/* Promo / Offer Code */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card }, shadows.sm]}>
          <View style={styles.sectionHead}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Promo code</Text>
            {appliedPromo && (
              <View style={[styles.appliedBadge, { backgroundColor: colors.accentGreen + "18" }]}>
                <Feather name="tag" size={12} color={colors.accentGreen} />
                <Text style={[styles.appliedText, { color: colors.accentGreen }]}>
                  {appliedPromo.label} applied
                </Text>
              </View>
            )}
          </View>
          {appliedPromo ? (
            <View style={styles.appliedRow}>
              <View style={[styles.appliedCodeBox, { backgroundColor: colors.accentGreen + "15", borderColor: colors.accentGreen }]}>
                <Feather name="check-circle" size={16} color={colors.accentGreen} />
                <Text style={[styles.appliedCode, { color: colors.accentGreen }]}>{appliedPromo.code}</Text>
              </View>
              <Pressable onPress={handleRemovePromo} style={styles.removeBtn}>
                <Feather name="x" size={18} color={colors.mutedForeground} />
              </Pressable>
            </View>
          ) : (
            <View>
              <View style={styles.promoInputRow}>
                <TextInput
                  value={promoCode}
                  onChangeText={(t) => {
                    setPromoCode(t);
                    setPromoError("");
                  }}
                  placeholder="Enter promo code"
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="characters"
                  style={[
                    styles.promoInput,
                    {
                      backgroundColor: colors.muted,
                      color: colors.primary,
                      borderColor: promoError ? colors.danger : colors.border,
                    },
                  ]}
                />
                <Pressable
                  onPress={handleApplyPromo}
                  disabled={!promoCode.trim()}
                  style={[
                    styles.applyBtn,
                    { backgroundColor: promoCode.trim() ? colors.primary : colors.muted },
                  ]}
                >
                  <Text style={[styles.applyText, { color: promoCode.trim() ? colors.primaryForeground : colors.mutedForeground }]}>
                    Apply
                  </Text>
                </Pressable>
              </View>
              {promoError ? (
                <Text style={[styles.promoError, { color: colors.danger }]}>{promoError}</Text>
              ) : null}
            </View>
          )}
        </View>

        {/* Order Summary */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Order summary</Text>
          {items.map((item) => (
            <View key={item.product.id} style={styles.orderItem}>
              <Text style={[styles.orderItemQty, { color: colors.mutedForeground }]}>
                {item.quantity}×
              </Text>
              <Text style={[styles.orderItemName, { color: colors.primary }]} numberOfLines={1}>
                {item.product.name}
              </Text>
              <Text style={[styles.orderItemPrice, { color: colors.primary }]}>
                ₹{item.product.price * item.quantity}
              </Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          {[
            { label: "Item total", value: `₹${total}` },
            { label: "Delivery", value: deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`, green: deliveryFee === 0 },
            ...(appliedPromo ? [{ label: `Discount (${appliedPromo.code})`, value: `-₹${discountAmount}`, green: true }] : []),
            { label: "Taxes", value: "₹0" },
          ].map((row) => (
            <View key={row.label} style={styles.billRow}>
              <Text style={[styles.billLabel, { color: colors.secondary }]}>{row.label}</Text>
              <Text style={[styles.billValue, { color: row.green ? colors.accentGreen : colors.primary }]}>
                {row.value}
              </Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.billRow}>
            <Text style={[styles.totalLabel, { color: colors.primary }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>₹{grandTotal}</Text>
          </View>
        </View>

        {/* Payment Method */}
        <View style={[styles.sectionCard, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Payment method</Text>
          {PAYMENT_METHODS.map((method) => (
            <Pressable
              key={method.id}
              onPress={() => setSelectedPayment(method.id)}
              style={[
                styles.payRow,
                selectedPayment === method.id && [
                  styles.payRowActive,
                  { borderColor: colors.primary, backgroundColor: colors.muted },
                ],
              ]}
            >
              <View style={[styles.payIcon, { backgroundColor: method.color + "18" }]}>
                <Feather name={method.icon} size={18} color={method.color} />
              </View>
              <View style={styles.payInfo}>
                <Text style={[styles.payLabel, { color: colors.primary }]}>{method.label}</Text>
                <Text style={[styles.paySub, { color: colors.mutedForeground }]}>{method.subtitle}</Text>
              </View>
              <View
                style={[
                  styles.radio,
                  { borderColor: selectedPayment === method.id ? colors.primary : colors.border },
                ]}
              >
                {selectedPayment === method.id && (
                  <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Place Order */}
      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <View>
          <Text style={[styles.footerTotal, { color: colors.primary }]}>₹{grandTotal}</Text>
          <Text style={[styles.footerSub, { color: colors.mutedForeground }]}>inclusive of all taxes</Text>
        </View>
        <Button
          label="Place Order"
          onPress={handlePlaceOrder}
          loading={placing}
          variant="primary"
          style={styles.placeBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.pagePadding, gap: 14 },
  sectionCard: { borderRadius: 20, padding: 18, gap: 14 },
  sectionHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 17, letterSpacing: -0.5 },
  changeText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  addrRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  addrDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  addrInfo: { flex: 1, gap: 3 },
  addrLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  addrVal: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  timeIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  timeLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  timeSub: { fontFamily: "Inter_400Regular", fontSize: 12 },
  promoInputRow: { flexDirection: "row", gap: 10 },
  promoInput: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    borderWidth: 1,
    letterSpacing: 1,
  },
  applyBtn: {
    borderRadius: 12,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  applyText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  promoError: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 4 },
  appliedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  appliedText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  appliedRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  appliedCodeBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  appliedCode: { fontFamily: "Inter_700Bold", fontSize: 14, letterSpacing: 1 },
  removeBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  orderItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  orderItemQty: { fontFamily: "Inter_500Medium", fontSize: 14, minWidth: 20 },
  orderItemName: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14 },
  orderItemPrice: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  divider: { height: 1 },
  billRow: { flexDirection: "row", justifyContent: "space-between" },
  billLabel: { fontFamily: "Inter_400Regular", fontSize: 14 },
  billValue: { fontFamily: "Inter_500Medium", fontSize: 14 },
  totalLabel: { fontFamily: "Inter_700Bold", fontSize: 16 },
  totalValue: { fontFamily: "Inter_700Bold", fontSize: 18 },
  payRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  payRowActive: { borderWidth: 1.5 },
  payIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  payInfo: { flex: 1, gap: 2 },
  payLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  paySub: { fontFamily: "Inter_400Regular", fontSize: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.pagePadding,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  footerTotal: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: -0.5 },
  footerSub: { fontFamily: "Inter_400Regular", fontSize: 11 },
  placeBtn: { flex: 1 },
});
