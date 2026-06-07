import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

export default function OrderReceiptScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Receipt" right={
        <Pressable hitSlop={8}>
          <Feather name="download" size={20} color={colors.primary} />
        </Pressable>
      } />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {/* Receipt header */}
        <View style={[styles.receiptCard, { backgroundColor: colors.card }, shadows.card]}>
          <View style={styles.receiptTop}>
            <View style={[styles.logoBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.logoText, { color: colors.primaryForeground }]}>B</Text>
            </View>
            <Text style={[styles.brandName, { color: colors.primary }]}>Bringo</Text>
            <Text style={[styles.orderId, { color: colors.mutedForeground }]}>Order #ORD7B1C</Text>
            <Text style={[styles.orderDate, { color: colors.mutedForeground }]}>Yesterday · 6:15 PM</Text>
          </View>

          {/* Items */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.primary }]}>Items</Text>
            {[
              { name: "Vitamin C 1000mg", qty: 1, price: 299 },
              { name: "Paracetamol 500mg", qty: 2, price: 28 },
            ].map((item) => (
              <View key={item.name} style={styles.itemRow}>
                <Text style={[styles.itemQty, { color: colors.mutedForeground }]}>{item.qty}×</Text>
                <Text style={[styles.itemName, { color: colors.primary }]}>{item.name}</Text>
                <Text style={[styles.itemPrice, { color: colors.primary }]}>₹{item.price * item.qty}</Text>
              </View>
            ))}
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Bill */}
          {[
            { label: "Subtotal", value: "₹355" },
            { label: "Delivery fee", value: "FREE", green: true },
            { label: "Taxes", value: "₹0" },
          ].map((row) => (
            <View key={row.label} style={styles.billRow}>
              <Text style={[styles.billLabel, { color: colors.secondary }]}>{row.label}</Text>
              <Text style={[styles.billValue, { color: row.green ? colors.accentGreen : colors.primary }]}>{row.value}</Text>
            </View>
          ))}

          <View style={[styles.totalRow, { backgroundColor: colors.primary, borderRadius: 14, padding: 14, marginTop: 4 }]}>
            <Text style={[styles.totalLabel, { color: colors.primaryForeground }]}>Total paid</Text>
            <Text style={[styles.totalValue, { color: colors.primaryForeground }]}>₹355</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Payment */}
          <View style={styles.paymentSection}>
            <Text style={[styles.sectionLabel, { color: colors.primary }]}>Payment</Text>
            <View style={styles.payRow}>
              <View style={[styles.payIcon, { backgroundColor: colors.accentOrange + "18" }]}>
                <Feather name="credit-card" size={16} color={colors.accentOrange} />
              </View>
              <Text style={[styles.payMethod, { color: colors.primary }]}>Bringo Wallet</Text>
              <Text style={[styles.payAmount, { color: colors.primary }]}>₹355</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Delivery */}
          <View style={styles.deliverySection}>
            <Text style={[styles.sectionLabel, { color: colors.primary }]}>Delivered to</Text>
            <Text style={[styles.address, { color: colors.secondary }]}>
              Flat 4B, Sunrise Apartments, Koramangala, Bengaluru 560095
            </Text>
            <Text style={[styles.agent, { color: colors.mutedForeground }]}>By Priya M. · ⭐ 5.0</Text>
          </View>

          {/* Perforated bottom */}
          <View style={styles.perfRow}>
            {Array.from({ length: 12 }).map((_, i) => (
              <View key={i} style={[styles.perfDot, { backgroundColor: colors.background }]} />
            ))}
          </View>
          <View style={styles.receiptFooter}>
            <Text style={[styles.thankText, { color: colors.mutedForeground }]}>Thank you for using Bringo!</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 16 },
  receiptCard: { borderRadius: 28, overflow: "hidden" },
  receiptTop: { padding: 28, alignItems: "center", gap: 6 },
  logoBadge: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: "Inter_700Bold", fontSize: 24 },
  brandName: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: -0.5 },
  orderId: { fontFamily: "Inter_500Medium", fontSize: 14 },
  orderDate: { fontFamily: "Inter_400Regular", fontSize: 13 },
  section: { paddingHorizontal: 20, gap: 8 },
  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 15, marginBottom: 4 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  itemQty: { fontFamily: "Inter_500Medium", fontSize: 13, minWidth: 20 },
  itemName: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 13 },
  itemPrice: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  divider: { height: 1, marginHorizontal: 20, marginVertical: 12 },
  billRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20 },
  billLabel: { fontFamily: "Inter_400Regular", fontSize: 14 },
  billValue: { fontFamily: "Inter_500Medium", fontSize: 14 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20 },
  totalLabel: { fontFamily: "Inter_700Bold", fontSize: 16 },
  totalValue: { fontFamily: "Inter_700Bold", fontSize: 18 },
  paymentSection: { paddingHorizontal: 20, gap: 10 },
  payRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  payIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  payMethod: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 14 },
  payAmount: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  deliverySection: { paddingHorizontal: 20, gap: 6 },
  address: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
  agent: { fontFamily: "Inter_400Regular", fontSize: 13 },
  perfRow: { flexDirection: "row", justifyContent: "space-around", marginHorizontal: -4, marginTop: 12 },
  perfDot: { width: 16, height: 16, borderRadius: 8 },
  receiptFooter: { padding: 20, alignItems: "center" },
  thankText: { fontFamily: "Inter_400Regular", fontSize: 13 },
});
