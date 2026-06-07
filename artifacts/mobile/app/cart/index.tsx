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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

export default function CartScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items, removeItem, updateQty, total, itemCount, clearCart } = useCart();
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const deliveryFee = total > 199 ? 0 : 29;
  const grandTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <BackHeader title="Cart" />
        <EmptyState
          title="Your cart is empty"
          message="Add items from our catalog to get started."
          icon="shopping-bag"
          actionLabel="Browse products"
          onAction={() => router.push("/(tabs)" as any)}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BackHeader
        title={`Cart (${itemCount})`}
        right={
          <Pressable onPress={clearCart} hitSlop={8}>
            <Text style={[styles.clearText, { color: colors.danger }]}>Clear</Text>
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: botPad + 120 }]}
      >
        {/* Cart Items */}
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
          {items.map((item, idx) => (
            <View key={item.product.id}>
              {idx > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <View style={styles.itemRow}>
                <View style={[styles.itemImg, { backgroundColor: colors.muted }]}>
                  <Text style={styles.itemEmoji}>
                    {item.product.category === "Groceries" ? "🥛" :
                     item.product.category === "Pharmacy" ? "💊" :
                     item.product.category === "Electronics" ? "⚡" : "📦"}
                  </Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: colors.primary }]} numberOfLines={1}>
                    {item.product.name}
                  </Text>
                  <Text style={[styles.itemUnit, { color: colors.mutedForeground }]}>
                    {item.product.unit}
                  </Text>
                  <Text style={[styles.itemPrice, { color: colors.primary }]}>
                    ₹{item.product.price}
                  </Text>
                </View>
                <View style={styles.itemActions}>
                  <View style={[styles.qtyRow, { backgroundColor: colors.muted }]}>
                    <Pressable
                      onPress={() =>
                        item.quantity === 1
                          ? removeItem(item.product.id)
                          : updateQty(item.product.id, item.quantity - 1)
                      }
                      style={styles.qBtn}
                    >
                      <Feather
                        name={item.quantity === 1 ? "trash-2" : "minus"}
                        size={14}
                        color={item.quantity === 1 ? colors.danger : colors.primary}
                      />
                    </Pressable>
                    <Text style={[styles.qtyText, { color: colors.primary }]}>{item.quantity}</Text>
                    <Pressable
                      onPress={() => updateQty(item.product.id, item.quantity + 1)}
                      style={styles.qBtn}
                    >
                      <Feather name="plus" size={14} color={colors.primary} />
                    </Pressable>
                  </View>
                  <Text style={[styles.subtotal, { color: colors.primary }]}>
                    ₹{item.product.price * item.quantity}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Promo Code */}
        <Pressable
          style={[styles.promoCard, { backgroundColor: colors.card }, shadows.sm]}
          onPress={() => router.push("/promo" as any)}
        >
          <View style={[styles.promoIcon, { backgroundColor: colors.accentOrange + "18" }]}>
            <Feather name="tag" size={18} color={colors.accentOrange} />
          </View>
          <Text style={[styles.promoText, { color: colors.primary }]}>Apply promo code</Text>
          <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
        </Pressable>

        {/* Bill Summary */}
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>Bill Summary</Text>
          {[
            { label: "Item total", value: `₹${total}` },
            { label: "Delivery fee", value: deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`, highlight: deliveryFee === 0 },
            { label: "Taxes & charges", value: "₹0" },
          ].map((row) => (
            <View key={row.label} style={styles.billRow}>
              <Text style={[styles.billLabel, { color: colors.secondary }]}>{row.label}</Text>
              <Text
                style={[
                  styles.billValue,
                  { color: row.highlight ? colors.accentGreen : colors.primary },
                ]}
              >
                {row.value}
              </Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.billRow}>
            <Text style={[styles.totalLabel, { color: colors.primary }]}>Grand Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>₹{grandTotal}</Text>
          </View>
          {deliveryFee === 0 && (
            <View style={[styles.savingBadge, { backgroundColor: colors.accentGreen + "15" }]}>
              <Feather name="check-circle" size={14} color={colors.accentGreen} />
              <Text style={[styles.savingText, { color: colors.accentGreen }]}>
                You saved ₹29 on delivery!
              </Text>
            </View>
          )}
        </View>

        {/* Delivery Address */}
        <Pressable
          style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}
          onPress={() => router.push("/address/add" as any)}
        >
          <View style={styles.addrRow}>
            <View style={[styles.addrIcon, { backgroundColor: colors.accentOrange + "18" }]}>
              <Feather name="map-pin" size={18} color={colors.accentOrange} />
            </View>
            <View style={styles.addrText}>
              <Text style={[styles.addrTitle, { color: colors.primary }]}>Deliver to</Text>
              <Text style={[styles.addrValue, { color: colors.secondary }]} numberOfLines={1}>
                Flat 4B, Sunrise Apartments, Koramangala
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </View>
        </Pressable>
      </ScrollView>

      {/* Checkout CTA */}
      <View
        style={[
          styles.footer,
          { backgroundColor: colors.background, paddingBottom: botPad },
        ]}
      >
        <View style={styles.footerInfo}>
          <Text style={[styles.footerTotal, { color: colors.primary }]}>₹{grandTotal}</Text>
          <Text style={[styles.footerItems, { color: colors.mutedForeground }]}>
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </Text>
        </View>
        <Button
          label="Place Order"
          onPress={() => router.push("/checkout" as any)}
          variant="primary"
          style={styles.checkoutBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingHorizontal: spacing.pagePadding, gap: 14, paddingTop: 4 },
  card: { borderRadius: 20, padding: 18, gap: 14 },
  cardTitle: { fontFamily: "Inter_700Bold", fontSize: 17, letterSpacing: -0.5, marginBottom: 2 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  itemImg: { width: 60, height: 60, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  itemEmoji: { fontSize: 28 },
  itemInfo: { flex: 1, gap: 2 },
  itemName: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  itemUnit: { fontFamily: "Inter_400Regular", fontSize: 12 },
  itemPrice: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  itemActions: { alignItems: "flex-end", gap: 8 },
  qtyRow: { flexDirection: "row", alignItems: "center", borderRadius: 12, overflow: "hidden" },
  qBtn: { width: 34, height: 34, alignItems: "center", justifyContent: "center" },
  qtyText: { fontFamily: "Inter_700Bold", fontSize: 15, minWidth: 24, textAlign: "center" },
  subtotal: { fontFamily: "Inter_700Bold", fontSize: 15 },
  divider: { height: 1 },
  promoCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  promoIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  promoText: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 15 },
  billRow: { flexDirection: "row", justifyContent: "space-between" },
  billLabel: { fontFamily: "Inter_400Regular", fontSize: 14 },
  billValue: { fontFamily: "Inter_500Medium", fontSize: 14 },
  totalLabel: { fontFamily: "Inter_700Bold", fontSize: 16 },
  totalValue: { fontFamily: "Inter_700Bold", fontSize: 18 },
  savingBadge: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 10, padding: 10 },
  savingText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  addrRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  addrIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  addrText: { flex: 1, gap: 2 },
  addrTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  addrValue: { fontFamily: "Inter_400Regular", fontSize: 13 },
  clearText: { fontFamily: "Inter_500Medium", fontSize: 14 },
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
  footerInfo: { gap: 1 },
  footerTotal: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: -0.5 },
  footerItems: { fontFamily: "Inter_400Regular", fontSize: 12 },
  checkoutBtn: { flex: 1 },
});
