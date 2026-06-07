import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [offers, setOffers] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settings = [
    { label: "Order Updates", desc: "Real-time order status notifications", value: orderUpdates, onToggle: setOrderUpdates },
    { label: "Offers & Promotions", desc: "Get notified about deals", value: offers, onToggle: setOffers },
    { label: "Dark Mode", desc: "Switch to dark theme", value: darkMode, onToggle: setDarkMode },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: botPad }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.primary }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
          {settings.map((s, i) => (
            <View key={s.label}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <View style={styles.settingRow}>
                <View style={styles.settingText}>
                  <Text style={[styles.settingLabel, { color: colors.primary }]}>{s.label}</Text>
                  <Text style={[styles.settingDesc, { color: colors.mutedForeground }]}>{s.desc}</Text>
                </View>
                <Switch
                  value={s.value}
                  onValueChange={s.onToggle}
                  trackColor={{ false: colors.muted, true: colors.primary }}
                  thumbColor={colors.primaryForeground}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.pagePadding, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { ...typography.h3 },
  content: { paddingHorizontal: spacing.pagePadding },
  card: { borderRadius: 20, overflow: "hidden" },
  divider: { height: 1, marginHorizontal: 16 },
  settingRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 14 },
  settingText: { flex: 1, gap: 2 },
  settingLabel: { fontFamily: "Inter_500Medium", fontSize: 15 },
  settingDesc: { fontFamily: "Inter_400Regular", fontSize: 12 },
});
