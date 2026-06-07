import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OrderCard } from "@/components/home/OrderCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { useColors } from "@/hooks/useColors";
import { ACTIVE_ORDERS, PAST_ORDERS } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const TABS = ["Active", "Past", "Requests"];

const MOCK_REQUESTS = [
  {
    id: "req_001",
    product: "Organic Whole Milk 500ml",
    category: "Groceries",
    status: "Sourcing",
    budget: "Under ₹100",
    createdAt: "10 min ago",
    eta: "20–30 min",
  },
  {
    id: "req_002",
    product: "USB-C Fast Charger 65W",
    category: "Electronics",
    status: "Agent Assigned",
    budget: "₹500–₹2000",
    createdAt: "2 hours ago",
    eta: "30–45 min",
  },
];

function RequestCard({ request }: { request: typeof MOCK_REQUESTS[0] }) {
  const colors = useColors();

  const statusColor =
    request.status === "Sourcing"
      ? colors.accentOrange
      : request.status === "Agent Assigned"
      ? colors.accentBlue
      : colors.accentGreen;

  return (
    <View style={[styles.reqCard, { backgroundColor: colors.card }, shadows.sm]}>
      <View style={styles.reqTop}>
        <View style={[styles.reqDot, { backgroundColor: statusColor }]} />
        <Text style={[styles.reqStatus, { color: statusColor }]}>{request.status}</Text>
        <Text style={[styles.reqTime, { color: colors.mutedForeground }]}>
          {request.createdAt}
        </Text>
      </View>
      <Text style={[styles.reqProduct, { color: colors.primary }]}>{request.product}</Text>
      <View style={styles.reqMeta}>
        <View style={[styles.reqBadge, { backgroundColor: colors.muted }]}>
          <Text style={[styles.reqBadgeText, { color: colors.secondary }]}>
            {request.category}
          </Text>
        </View>
        <View style={[styles.reqBadge, { backgroundColor: colors.muted }]}>
          <Text style={[styles.reqBadgeText, { color: colors.secondary }]}>
            Budget: {request.budget}
          </Text>
        </View>
      </View>
      <View style={[styles.reqProgress, { backgroundColor: colors.muted }]}>
        <View style={styles.reqTrack}>
          {["Received", "Sourcing", "Assigned", "Delivered"].map((step, i) => {
            const steps = ["Received", "Sourcing", "Agent Assigned", "Delivered"];
            const currentIdx = steps.indexOf(request.status);
            const done = i <= currentIdx;
            return (
              <View key={step} style={styles.reqStep}>
                <View
                  style={[
                    styles.reqStepDot,
                    {
                      backgroundColor: done ? colors.accentOrange : colors.border,
                      width: done ? 10 : 6,
                      height: done ? 10 : 6,
                    },
                  ]}
                />
                {i < 3 && (
                  <View
                    style={[
                      styles.reqStepLine,
                      { backgroundColor: i < currentIdx ? colors.accentOrange : colors.border },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
        <Text style={[styles.reqEta, { color: colors.secondary }]}>ETA: {request.eta}</Text>
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + spacing.tabBarHeight;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        entering={FadeInDown.duration(400).delay(0)}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
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
      </Animated.View>

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
            ACTIVE_ORDERS.map((order, i) => (
              <Animated.View key={order.id} entering={FadeInDown.duration(400).delay(i * 80)}>
                <OrderCard order={order} />
              </Animated.View>
            ))
          )
        ) : activeTab === 1 ? (
          PAST_ORDERS.length === 0 ? (
            <EmptyState
              title="No past orders"
              message="Your order history will appear here."
              icon="clock"
            />
          ) : (
            PAST_ORDERS.map((order, i) => (
              <Animated.View key={order.id} entering={FadeInDown.duration(400).delay(i * 80)}>
                <OrderCard order={order} />
              </Animated.View>
            ))
          )
        ) : (
          MOCK_REQUESTS.length === 0 ? (
            <EmptyState
              title="No requests yet"
              message="Your product requests will appear here."
              icon="inbox"
            />
          ) : (
            MOCK_REQUESTS.map((req, i) => (
              <Animated.View key={req.id} entering={FadeInDown.duration(400).delay(i * 80)}>
                <RequestCard request={req} />
              </Animated.View>
            ))
          )
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
  tabText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  list: { paddingHorizontal: spacing.pagePadding, gap: 12, paddingTop: 8 },
  reqCard: {
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },
  reqTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  reqDot: { width: 8, height: 8, borderRadius: 4 },
  reqStatus: { fontFamily: "Inter_600SemiBold", fontSize: 13, flex: 1 },
  reqTime: { fontFamily: "Inter_400Regular", fontSize: 12 },
  reqProduct: { fontFamily: "Inter_700Bold", fontSize: 16, letterSpacing: -0.3 },
  reqMeta: { flexDirection: "row", gap: 8 },
  reqBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  reqBadgeText: { fontFamily: "Inter_400Regular", fontSize: 12 },
  reqProgress: { borderRadius: 14, padding: 14, gap: 8 },
  reqTrack: { flexDirection: "row", alignItems: "center" },
  reqStep: { flex: 1, flexDirection: "row", alignItems: "center" },
  reqStepDot: { borderRadius: 5 },
  reqStepLine: { flex: 1, height: 2, marginHorizontal: 3 },
  reqEta: { fontFamily: "Inter_400Regular", fontSize: 12 },
});
