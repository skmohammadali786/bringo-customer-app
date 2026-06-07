import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OrderCard } from "@/components/home/OrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useColors } from "@/hooks/useColors";
import { ACTIVE_ORDERS, PAST_ORDERS } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const TABS = ["Active", "Past"];

export default function OrdersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + spacing.tabBarHeight;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.title, { color: colors.primary }]}>Orders</Text>
        <View style={[styles.tabPills, { backgroundColor: colors.muted }]}>
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(i)}
              style={[
                styles.tabPill,
                i === activeTab && [{ backgroundColor: colors.card }, shadows.sm],
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: i === activeTab ? colors.primary : colors.mutedForeground },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: botPad }]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 0 ? (
          ACTIVE_ORDERS.length === 0 ? (
            <EmptyState
              title="No active orders"
              message="Your active orders will appear here."
              icon="package"
              actionLabel="Order something"
              onAction={() => {}}
            />
          ) : (
            ACTIVE_ORDERS.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          )
        ) : PAST_ORDERS.length === 0 ? (
          <EmptyState
            title="No past orders"
            message="Your order history will appear here."
            icon="clock"
          />
        ) : (
          PAST_ORDERS.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacing.pagePadding,
    paddingBottom: 16,
    gap: 16,
  },
  title: { ...typography.h2 },
  tabPills: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 4,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  tabText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  list: { paddingHorizontal: spacing.pagePadding, gap: 12, paddingTop: 8 },
});
