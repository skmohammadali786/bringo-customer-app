import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Badge } from "@/components/ui/Badge";
import { useColors } from "@/hooks/useColors";
import { shadows } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import type { Order } from "@/constants/mockData";

const STATUS_CONFIG = {
  received: { label: "Order Received", variant: "info" as const, icon: "check-circle" as const },
  assigned: { label: "Agent Assigned", variant: "info" as const, icon: "user" as const },
  sourcing: { label: "Sourcing Product", variant: "warning" as const, icon: "search" as const },
  picked: { label: "Pickup Complete", variant: "warning" as const, icon: "package" as const },
  delivery: { label: "Out for Delivery", variant: "success" as const, icon: "navigation" as const },
  delivered: { label: "Delivered", variant: "success" as const, icon: "check-circle" as const },
  cancelled: { label: "Cancelled", variant: "error" as const, icon: "x-circle" as const },
};

type OrderCardProps = {
  order: Order;
  compact?: boolean;
};

export function OrderCard({ order, compact = false }: OrderCardProps) {
  const colors = useColors();
  const status = STATUS_CONFIG[order.status];

  return (
    <Pressable
      onPress={() => router.push(`/order/${order.id}` as any)}
      style={[styles.card, { backgroundColor: colors.card, borderRadius: 20 }, shadows.card]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.orderId, { color: colors.mutedForeground }]}>
            #{order.id}
          </Text>
          <Text style={[styles.time, { color: colors.secondary }]}>
            {order.createdAt}
          </Text>
        </View>
        <Badge label={status.label} variant={status.variant} />
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <Text style={[styles.items, { color: colors.foreground }]} numberOfLines={1}>
        {order.items.join(", ")}
      </Text>

      {!compact && (
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Feather name={status.icon} size={14} color={colors.accentOrange} />
            {order.status !== "delivered" && order.status !== "cancelled" ? (
              <Text style={[styles.eta, { color: colors.accentOrange }]}>
                ETA {order.eta}
              </Text>
            ) : (
              <Text style={[styles.eta, { color: colors.mutedForeground }]}>
                {order.deliveredAt}
              </Text>
            )}
          </View>
          <Text style={[styles.total, { color: colors.primary }]}>
            ₹{order.total}
          </Text>
        </View>
      )}

      {order.status !== "delivered" && order.status !== "cancelled" && !compact && (
        <View style={[styles.trackBtn, { backgroundColor: colors.primary }]}>
          <Text style={[styles.trackText, { color: colors.primaryForeground }]}>
            Track Order
          </Text>
          <Feather name="arrow-right" size={14} color={colors.primaryForeground} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, gap: 12 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  orderId: { ...typography.caption, letterSpacing: 0.5, textTransform: "uppercase" },
  time: { ...typography.small, marginTop: 2 },
  divider: { height: 1 },
  items: { ...typography.bodyMedium, fontSize: 14 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  eta: { ...typography.smallMedium, fontFamily: "Inter_600SemiBold" },
  total: { ...typography.price, fontSize: 16 },
  trackBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 12,
    paddingVertical: 10,
  },
  trackText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
});
