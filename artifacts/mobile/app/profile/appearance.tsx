import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const THEMES = [
  { id: "light", label: "Light", icon: "sun" as const, desc: "Always use light mode" },
  { id: "dark", label: "Dark", icon: "moon" as const, desc: "Always use dark mode" },
  { id: "system", label: "System", icon: "smartphone" as const, desc: "Follow system setting" },
];

const ACCENT_COLORS = ["#FF9A3D", "#4A90E2", "#34C759", "#9B59B6", "#E74C3C", "#1ABC9C"];

export default function AppearanceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [theme, setTheme] = useState("system");
  const [accent, setAccent] = useState("#FF9A3D");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Appearance" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {/* Theme */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Theme</Text>
          <View style={styles.themeGrid}>
            {THEMES.map((t) => {
              const active = theme === t.id;
              return (
                <Pressable key={t.id} onPress={() => setTheme(t.id)}
                  style={[styles.themeCard, { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border, borderWidth: active ? 0 : 1.5 }, shadows.sm]}>
                  <View style={[styles.themeIcon, { backgroundColor: active ? "rgba(255,255,255,0.15)" : colors.muted }]}>
                    <Feather name={t.icon} size={20} color={active ? colors.primaryForeground : colors.secondary} />
                  </View>
                  <Text style={[styles.themeLabel, { color: active ? colors.primaryForeground : colors.primary }]}>{t.label}</Text>
                  <Text style={[styles.themeDesc, { color: active ? "rgba(247,245,240,0.7)" : colors.mutedForeground }]}>{t.desc}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Accent color */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Accent color</Text>
          <View style={[styles.accentCard, { backgroundColor: colors.card }, shadows.sm]}>
            <View style={styles.accentRow}>
              {ACCENT_COLORS.map((c) => (
                <Pressable key={c} onPress={() => setAccent(c)}
                  style={[styles.accentDot, { backgroundColor: c, transform: [{ scale: accent === c ? 1.2 : 1 }] }]}>
                  {accent === c && <Feather name="check" size={14} color="#FFF" />}
                </Pressable>
              ))}
            </View>
            <View style={[styles.previewRow, { backgroundColor: colors.muted }]}>
              <View style={[styles.previewBtn, { backgroundColor: accent }]}>
                <Text style={styles.previewBtnText}>Add to cart</Text>
              </View>
              <View style={[styles.previewBadge, { backgroundColor: accent + "20" }]}>
                <Text style={[styles.previewBadgeText, { color: accent }]}>OFFER</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Accessibility */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Accessibility</Text>
          <View style={[styles.accessCard, { backgroundColor: colors.card }, shadows.sm]}>
            {[
              { label: "Reduce motion", desc: "Disable animations and transitions", value: reduceMotion, toggle: () => setReduceMotion((v) => !v) },
              { label: "Larger text", desc: "Increase text size across the app", value: largeText, toggle: () => setLargeText((v) => !v) },
            ].map((item, i) => (
              <View key={item.label}>
                {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                <View style={styles.accessRow}>
                  <View style={styles.accessInfo}>
                    <Text style={[styles.accessLabel, { color: colors.primary }]}>{item.label}</Text>
                    <Text style={[styles.accessDesc, { color: colors.mutedForeground }]}>{item.desc}</Text>
                  </View>
                  <Pressable onPress={item.toggle} style={[styles.toggle, { backgroundColor: item.value ? colors.primary : colors.muted }]}>
                    <View style={[styles.toggleDot, { left: item.value ? 20 : 2 }]} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 24 },
  section: { gap: 12 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5 },
  themeGrid: { flexDirection: "row", gap: 10 },
  themeCard: { flex: 1, borderRadius: 18, padding: 14, gap: 8, alignItems: "center" },
  themeIcon: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  themeLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  themeDesc: { fontFamily: "Inter_400Regular", fontSize: 11, textAlign: "center" },
  accentCard: { borderRadius: 20, padding: 16, gap: 16 },
  accentRow: { flexDirection: "row", gap: 12, justifyContent: "space-around" },
  accentDot: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  previewRow: { borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  previewBtn: { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 9 },
  previewBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#FFF" },
  previewBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  previewBadgeText: { fontFamily: "Inter_700Bold", fontSize: 11 },
  accessCard: { borderRadius: 20, overflow: "hidden" },
  divider: { height: 1, marginHorizontal: 16 },
  accessRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  accessInfo: { flex: 1, gap: 2 },
  accessLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  accessDesc: { fontFamily: "Inter_400Regular", fontSize: 12 },
  toggle: { width: 44, height: 26, borderRadius: 13, justifyContent: "center", position: "relative" },
  toggleDot: { position: "absolute", width: 20, height: 20, borderRadius: 10, backgroundColor: "#FFF", top: 3 },
});
