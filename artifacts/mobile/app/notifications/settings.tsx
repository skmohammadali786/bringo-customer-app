import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const NOTIF_SETTINGS = [
  {
    section: "Orders",
    items: [
      { id: "order_placed", title: "Order placed", desc: "When your order is confirmed" },
      { id: "order_picked", title: "Agent picked up", desc: "When your agent picks up items" },
      { id: "order_delivery", title: "Out for delivery", desc: "When your order is on the way" },
      { id: "order_delivered", title: "Delivered", desc: "When your order arrives" },
    ],
  },
  {
    section: "Offers & rewards",
    items: [
      { id: "flash_sale", title: "Flash sales", desc: "Time-limited deals and discounts" },
      { id: "personalised", title: "Personalised offers", desc: "Deals based on your preferences" },
      { id: "rewards", title: "Rewards & cashback", desc: "Points credited and rewards available" },
    ],
  },
  {
    section: "Account",
    items: [
      { id: "wallet", title: "Wallet activity", desc: "Credits, debits and refunds" },
      { id: "security", title: "Security alerts", desc: "Login attempts and account changes" },
      { id: "updates", title: "App updates", desc: "New features and improvements" },
    ],
  },
];

export default function NotificationSettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_SETTINGS.flatMap((s) => s.items).map((i) => [i.id, true]))
  );
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const toggle = (id: string) => setEnabled((s) => ({ ...s, [id]: !s[id] }));

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Notifications" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {NOTIF_SETTINGS.map((section) => (
          <View key={section.section} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{section.section.toUpperCase()}</Text>
            <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
              {section.items.map((item, i) => (
                <View key={item.id}>
                  {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                  <View style={styles.row}>
                    <View style={styles.info}>
                      <Text style={[styles.itemTitle, { color: colors.primary }]}>{item.title}</Text>
                      <Text style={[styles.itemDesc, { color: colors.mutedForeground }]}>{item.desc}</Text>
                    </View>
                    <Pressable onPress={() => toggle(item.id)}
                      style={[styles.toggle, { backgroundColor: enabled[item.id] ? colors.primary : colors.muted }]}>
                      <View style={[styles.toggleDot, { left: enabled[item.id] ? 20 : 2 }]} />
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={[styles.infoCard, { backgroundColor: colors.muted }]}>
          <Text style={[styles.infoText, { color: colors.secondary }]}>
            Bringo may still send critical security and account notifications even if notifications are off.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 20 },
  section: { gap: 8 },
  sectionTitle: { fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 1 },
  card: { borderRadius: 20, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  info: { flex: 1, gap: 2 },
  itemTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  itemDesc: { fontFamily: "Inter_400Regular", fontSize: 12 },
  toggle: { width: 44, height: 26, borderRadius: 13, justifyContent: "center", position: "relative" },
  toggleDot: { position: "absolute", width: 20, height: 20, borderRadius: 10, backgroundColor: "#FFF", top: 3 },
  divider: { height: 1, marginHorizontal: 16 },
  infoCard: { borderRadius: 14, padding: 14 },
  infoText: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
});
