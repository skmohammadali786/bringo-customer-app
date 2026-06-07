import { Feather } from "@expo/vector-icons";
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
import { EmptyState } from "@/components/ui/EmptyState";
import { useColors } from "@/hooks/useColors";
import { NOTIFICATIONS } from "@/constants/mockData";
import type { Notification } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const TYPE_ICONS: Record<Notification["type"], keyof typeof Feather.glyphMap> = {
  order: "package",
  offer: "tag",
  wallet: "credit-card",
  system: "bell",
};

const TYPE_COLORS: Record<Notification["type"], string> = {
  order: "#4A90E2",
  offer: "#FF9A3D",
  wallet: "#34C759",
  system: "#5B5B5B",
};

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + spacing.tabBarHeight;

  const unread = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  if (notifications.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topPad + 16 }]}>
          <Text style={[styles.title, { color: colors.primary }]}>Notifications</Text>
        </View>
        <EmptyState title="All caught up" message="No notifications yet." icon="bell" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <View>
          <Text style={[styles.title, { color: colors.primary }]}>Notifications</Text>
          {unread > 0 && (
            <Text style={[styles.unreadCount, { color: colors.mutedForeground }]}>
              {unread} unread
            </Text>
          )}
        </View>
        {unread > 0 && (
          <Pressable onPress={markAllRead}>
            <Text style={[styles.markAll, { color: colors.accentOrange }]}>
              Mark all read
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: botPad }]}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((n, i) => (
          <Pressable
            key={n.id}
            onPress={() => {
              setNotifications((prev) =>
                prev.map((x) => (x.id === n.id ? { ...x, isRead: true } : x))
              );
            }}
            style={[
              styles.notifCard,
              {
                backgroundColor: n.isRead ? colors.card : `${colors.accentBlue}08`,
                borderLeftColor: n.isRead ? "transparent" : TYPE_COLORS[n.type],
                borderLeftWidth: n.isRead ? 0 : 3,
              },
              shadows.sm,
            ]}
          >
            <View
              style={[
                styles.notifIcon,
                { backgroundColor: `${TYPE_COLORS[n.type]}15` },
              ]}
            >
              <Feather name={TYPE_ICONS[n.type]} size={18} color={TYPE_COLORS[n.type]} />
            </View>
            <View style={styles.notifContent}>
              <View style={styles.notifHeader}>
                <Text style={[styles.notifTitle, { color: colors.primary }]}>
                  {n.title}
                </Text>
                {!n.isRead && (
                  <View style={[styles.unreadDot, { backgroundColor: colors.accentOrange }]} />
                )}
              </View>
              <Text style={[styles.notifMessage, { color: colors.secondary }]} numberOfLines={2}>
                {n.message}
              </Text>
              <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>
                {n.time}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: spacing.pagePadding,
    paddingBottom: 16,
  },
  title: { ...typography.h2 },
  unreadCount: { ...typography.small, marginTop: 2 },
  markAll: { fontFamily: "Inter_600SemiBold", fontSize: 14, marginTop: 8 },
  list: { paddingHorizontal: spacing.pagePadding, gap: 10 },
  notifCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notifContent: { flex: 1, gap: 4 },
  notifHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  notifTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
  notifMessage: { ...typography.small, lineHeight: 18 },
  notifTime: { ...typography.caption },
});
