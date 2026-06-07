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
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const DELIVERY_FEE = 49;
const PLATFORM_FEE = 5;

export default function OrderSummaryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { items, total, updateQuantity, removeItem } = useCart();
  const [address] = useState("Flat 4B, Sunrise Apartments, Koramangala");
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const grandTotal = total + DELIVERY_FEE + PLATFORM_FEE;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Order Summary</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Items */}
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>Items ({items.length})</Text>
          {items.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No items in cart. Add items from the home screen.
            </Text>
          ) : (
            items.map((item) => (
              <View key={item.product.id} style={styles.itemRow}>
                <View style={[styles.itemImg, { backgroundColor: colors.muted }]}>
                  <Feather name="package" size={20} color={colors.secondary} />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={[styles.itemName, { color: colors.primary }]}>{item.product.name}</Text>
                  <Text style={[styles.itemPrice, { color: colors.accentOrange }]}>₹{item.product.price}</Text>
                </View>
                <View style={styles.qtyRow}>
                  <Pressable
                    onPress={() => updateQuantity(item.product.id, item.quantity - 1)}
                    style={[styles.qBtn, { backgroundColor: colors.muted }]}
                  >
                    <Feather name="minus" size={12} color={colors.primary} />
                  </Pressable>
                  <Text style={[styles.qVal, { color: colors.primary }]}>{item.quantity}</Text>
                  <Pressable
                    onPress={() => updateQuantity(item.product.id, item.quantity + 1)}
                    style={[styles.qBtn, { backgroundColor: colors.primary }]}
                  >
                    <Feather name="plus" size={12} color={colors.primaryForeground} />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Address */}
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
          <View style={styles.rowBetween}>
            <Text style={[styles.cardTitle, { color: colors.primary }]}>Delivery Address</Text>
            <Pressable>
              <Text style={[styles.changeLink, { color: colors.accentOrange }]}>Change</Text>
            </Pressable>
          </View>
          <View style={styles.addressRow}>
            <Feather name="map-pin" size={16} color={colors.accentOrange} />
            <Text style={[styles.addressText, { color: colors.secondary }]}>{address}</Text>
          </View>
          <View style={[styles.etaRow, { backgroundColor: colors.muted }]}>
            <Feather name="clock" size={14} color={colors.accentGreen} />
            <Text style={[styles.etaText, { color: colors.accentGreen }]}>Estimated delivery: 20–30 mins</Text>
          </View>
        </View>

        {/* Price breakdown */}
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>Price Details</Text>
          {[
            { label: "Subtotal", value: `₹${total}` },
            { label: "Delivery fee", value: `₹${DELIVERY_FEE}` },
            { label: "Platform fee", value: `₹${PLATFORM_FEE}` },
          ].map((row) => (
            <View key={row.label} style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.secondary }]}>{row.label}</Text>
              <Text style={[styles.priceValue, { color: colors.primary }]}>{row.value}</Text>
            </View>
          ))}
          <View style={[styles.totalDivider, { backgroundColor: colors.border }]} />
          <View style={styles.priceRow}>
            <Text style={[styles.totalLabel, { color: colors.primary }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>₹{grandTotal}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: botPad }]}>
        <View style={styles.footerInner}>
          <View>
            <Text style={[styles.footerTotal, { color: colors.primary }]}>₹{grandTotal}</Text>
            <Text style={[styles.footerLabel, { color: colors.mutedForeground }]}>Total payable</Text>
          </View>
          <View style={styles.footerBtn}>
            <Button
              label="Proceed to Pay"
              onPress={() => router.push("/order/payment" as any)}
              fullWidth={false}
              size="md"
            />
          </View>
        </View>
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
  content: { paddingHorizontal: spacing.pagePadding, gap: 16 },
  card: { borderRadius: 20, padding: 20, gap: 14 },
  cardTitle: { ...typography.sectionTitle },
  emptyText: { ...typography.body, textAlign: "center", paddingVertical: 12 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  itemImg: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontFamily: "Inter_500Medium", fontSize: 14 },
  itemPrice: { fontFamily: "Inter_700Bold", fontSize: 15 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  qBtn: { width: 28, height: 28, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  qVal: { fontFamily: "Inter_700Bold", fontSize: 16, minWidth: 20, textAlign: "center" },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  changeLink: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  addressRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  addressText: { ...typography.body, flex: 1 },
  etaRow: { flexDirection: "row", gap: 8, alignItems: "center", borderRadius: 12, padding: 12 },
  etaText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  priceRow: { flexDirection: "row", justifyContent: "space-between" },
  priceLabel: { ...typography.body },
  priceValue: { ...typography.bodyMedium },
  totalDivider: { height: 1 },
  totalLabel: { fontFamily: "Inter_700Bold", fontSize: 16 },
  totalValue: { fontFamily: "Inter_700Bold", fontSize: 20 },
  footer: {
    paddingHorizontal: spacing.pagePadding,
    paddingTop: 16,
  },
  footerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerTotal: { fontFamily: "Inter_700Bold", fontSize: 22 },
  footerLabel: { fontFamily: "Inter_400Regular", fontSize: 12 },
  footerBtn: { flex: 1, marginLeft: 16 },
});
