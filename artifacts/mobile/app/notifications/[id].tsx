import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { NOTIFICATIONS } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";

export default function NotificationDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const notif = NOTIFICATIONS.find((n) => n.id === id) ?? NOTIFICATIONS[0];

  const TYPE_COLORS: Record<string, string> = {
    order: colors.accentBlue,
    offer: colors.accentOrange,
    wallet: colors.accentGreen,
    system: colors.mutedForeground,
  };

  const TYPE_ICONS: Record<string, any> = {
    order: "package",
    offer: "tag",
    wallet: "credit-card",
    system: "bell",
  };

  const color = TYPE_COLORS[notif.type] ?? colors.primary;
  const icon = TYPE_ICONS[notif.type] ?? "bell";

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Notification" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {/* Icon */}
        <View style={styles.iconWrap}>
          <View style={[styles.iconCircle, { backgroundColor: color + "18" }]}>
            <Feather name={icon} size={40} color={color} />
          </View>
          <View style={[styles.typeBadge, { backgroundColor: color }]}>
            <Text style={styles.typeText}>{notif.type.toUpperCase()}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.card]}>
          <Text style={[styles.title, { color: colors.primary }]}>{notif.title}</Text>
          <Text style={[styles.message, { color: colors.secondary }]}>{notif.message}</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.timeRow}>
            <Feather name="clock" size={14} color={colors.mutedForeground} />
            <Text style={[styles.time, { color: colors.mutedForeground }]}>{notif.time}</Text>
          </View>
        </View>

        {/* Actions */}
        {notif.type === "order" && (
          <View style={styles.actionsWrap}>
            <Button label="View order" onPress={() => router.push("/order/ORD7B1C" as any)} variant="primary" />
            <Button label="Track delivery" onPress={() => router.push("/order/ORD7B1C" as any)} variant="outline" />
          </View>
        )}
        {notif.type === "offer" && (
          <Button label="View offer" onPress={() => router.push("/offers" as any)} variant="primary" />
        )}
        {notif.type === "wallet" && (
          <Button label="View wallet" onPress={() => router.push("/(tabs)/wallet" as any)} variant="primary" />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 20, alignItems: "center" },
  iconWrap: { alignItems: "center", marginTop: 20, gap: 12 },
  iconCircle: { width: 100, height: 100, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  typeBadge: { borderRadius: 999, paddingHorizontal: 14, paddingVertical: 5 },
  typeText: { fontFamily: "Inter_700Bold", fontSize: 11, color: "#FFF", letterSpacing: 1 },
  card: { alignSelf: "stretch", borderRadius: 24, padding: 24, gap: 16 },
  title: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: -0.5, textAlign: "center" },
  message: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 22, textAlign: "center" },
  divider: { height: 1 },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 6, justifyContent: "center" },
  time: { fontFamily: "Inter_400Regular", fontSize: 13 },
  actionsWrap: { alignSelf: "stretch", gap: 10 },
});
