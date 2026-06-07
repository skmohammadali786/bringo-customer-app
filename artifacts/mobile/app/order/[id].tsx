import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import { Badge } from "@/components/ui/Badge";
import { useColors } from "@/hooks/useColors";
import { ACTIVE_ORDERS, ORDER_STATUS_STEPS, PAST_ORDERS } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const ALL_ORDERS = [...ACTIVE_ORDERS, ...PAST_ORDERS];

const STATUS_INDEX: Record<string, number> = {
  received: 0, assigned: 1, sourcing: 2, picked: 3, delivery: 4, delivered: 5,
};

export default function OrderDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const order = ALL_ORDERS.find((o) => o.id === id) ?? ACTIVE_ORDERS[0] ?? PAST_ORDERS[0];
  const currentStep = STATUS_INDEX[order?.status ?? "received"] ?? 0;
  const isActive = order?.status !== "delivered" && order?.status !== "cancelled";

  if (!order) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.primary, textAlign: "center", marginTop: 100 }}>Order not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Order #{order.id}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: botPad }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Live tracking map placeholder */}
        {isActive && (
          <View style={[styles.mapCard, { backgroundColor: colors.primary }, shadows.lg]}>
            <View style={styles.mapGrid}>
              {Array.from({ length: 20 }).map((_, i) => (
                <View key={i} style={[styles.mapDot, { backgroundColor: "rgba(247,245,240,0.08)" }]} />
              ))}
            </View>
            <View style={styles.agentMarker}>
              <View style={[styles.markerBg, { backgroundColor: colors.accentOrange }]}>
                <Feather name="navigation" size={18} color="#FFF" />
              </View>
              <View style={[styles.markerTail, { backgroundColor: colors.accentOrange }]} />
            </View>
            <View style={styles.destMarker}>
              <View style={[styles.markerBg, { backgroundColor: colors.accentGreen }]}>
                <Feather name="home" size={16} color="#FFF" />
              </View>
            </View>
            <View style={styles.etaOverlay}>
              <Text style={styles.etaLabel}>ETA</Text>
              <Text style={styles.etaValue}>{order.eta}</Text>
            </View>
          </View>
        )}

        {/* Status Timeline */}
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>Order Status</Text>
          {ORDER_STATUS_STEPS.map((step, idx) => {
            const done = idx <= currentStep;
            const active = idx === currentStep;
            return (
              <View key={step.key} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor: done ? colors.primary : colors.muted,
                        borderColor: active ? colors.accentOrange : "transparent",
                        borderWidth: active ? 3 : 0,
                      },
                    ]}
                  >
                    {done && !active && (
                      <Feather name="check" size={10} color={colors.primaryForeground} />
                    )}
                  </View>
                  {idx < ORDER_STATUS_STEPS.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        { backgroundColor: done && idx < currentStep ? colors.primary : colors.muted },
                      ]}
                    />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineLabel,
                      { color: done ? colors.primary : colors.mutedForeground },
                      active && { color: colors.accentOrange },
                    ]}
                  >
                    {step.label}
                  </Text>
                  {active && (
                    <Badge label="In progress" variant="warning" size="sm" style={{ marginTop: 4 }} />
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Agent Info */}
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>Your Agent</Text>
          <View style={styles.agentRow}>
            <View style={[styles.agentAvatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.agentInitial, { color: colors.primaryForeground }]}>
                {order.agentName.charAt(0)}
              </Text>
            </View>
            <View style={styles.agentInfo}>
              <Text style={[styles.agentName, { color: colors.primary }]}>{order.agentName}</Text>
              <View style={styles.ratingRow}>
                <Feather name="star" size={12} color={colors.accentOrange} />
                <Text style={[styles.rating, { color: colors.secondary }]}>{order.agentRating} rating</Text>
              </View>
            </View>
            <View style={styles.agentActions}>
              <Pressable
                style={[styles.agentBtn, { backgroundColor: colors.accentGreen + "18" }]}
                onPress={() => router.push(`/chat/${order.id}` as any)}
              >
                <Feather name="message-circle" size={18} color={colors.accentGreen} />
              </Pressable>
              <Pressable style={[styles.agentBtn, { backgroundColor: colors.accentBlue + "18" }]}>
                <Feather name="phone" size={18} color={colors.accentBlue} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Order Details */}
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>Order Details</Text>
          {order.items.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <View style={[styles.itemDot, { backgroundColor: colors.accentOrange }]} />
              <Text style={[styles.itemText, { color: colors.primary }]}>{item}</Text>
            </View>
          ))}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.secondary }]}>Total</Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>₹{order.total}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
          <View style={styles.addressRow}>
            <View style={[styles.addressIcon, { backgroundColor: colors.muted }]}>
              <Feather name="map-pin" size={18} color={colors.accentOrange} />
            </View>
            <View style={styles.addressText}>
              <Text style={[styles.addressTitle, { color: colors.primary }]}>Delivery Address</Text>
              <Text style={[styles.addressValue, { color: colors.secondary }]}>{order.address}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  mapCard: {
    height: 180,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  mapGrid: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 4,
  },
  mapDot: { width: "8%", height: 20, borderRadius: 4 },
  agentMarker: { position: "absolute", left: "40%", top: "35%", alignItems: "center" },
  destMarker: { position: "absolute", right: "20%", bottom: "25%" },
  markerBg: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  markerTail: { width: 2, height: 10 },
  etaOverlay: {
    position: "absolute",
    top: 16, right: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },
  etaLabel: { fontFamily: "Inter_400Regular", fontSize: 10, color: "rgba(247,245,240,0.7)" },
  etaValue: { fontFamily: "Inter_700Bold", fontSize: 20, color: "#F7F5F0" },
  card: { borderRadius: 20, padding: 20, gap: 16 },
  cardTitle: { ...typography.sectionTitle },
  timelineRow: { flexDirection: "row", gap: 14 },
  timelineLeft: { alignItems: "center", width: 24 },
  timelineDot: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  timelineLine: { width: 2, flex: 1, minHeight: 20, marginVertical: 2 },
  timelineContent: { flex: 1, paddingBottom: 16 },
  timelineLabel: { ...typography.bodyMedium },
  agentRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  agentAvatar: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  agentInitial: { fontSize: 24, fontFamily: "Inter_700Bold" },
  agentInfo: { flex: 1, gap: 4 },
  agentName: { ...typography.bodySemiBold, fontSize: 16 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  rating: { ...typography.small },
  agentActions: { flexDirection: "row", gap: 8 },
  agentBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  itemDot: { width: 6, height: 6, borderRadius: 3 },
  itemText: { ...typography.body },
  divider: { height: 1 },
  totalRow: { flexDirection: "row", justifyContent: "space-between" },
  totalLabel: { ...typography.bodyMedium },
  totalValue: { fontFamily: "Inter_700Bold", fontSize: 18 },
  addressRow: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  addressIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  addressText: { flex: 1, gap: 4 },
  addressTitle: { ...typography.bodySemiBold },
  addressValue: { ...typography.body, lineHeight: 20 },
});
