import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { useTheme, ThemePreference } from "@/context/ThemeContext";
import { shadows, spacing } from "@/constants/spacing";

const THEMES: { id: ThemePreference; label: string; icon: "sun" | "moon" | "smartphone"; desc: string }[] = [
  { id: "light", label: "Light", icon: "sun", desc: "Always use light mode" },
  { id: "dark", label: "Dark", icon: "moon", desc: "Always use dark mode" },
  { id: "system", label: "System", icon: "smartphone", desc: "Follow device setting" },
];

const ACCENT_COLORS = [
  { hex: "#FF9A3D", label: "Orange" },
  { hex: "#4A90E2", label: "Blue" },
  { hex: "#34C759", label: "Green" },
  { hex: "#9B59B6", label: "Purple" },
  { hex: "#E74C3C", label: "Red" },
  { hex: "#1ABC9C", label: "Teal" },
];

export default function AppearanceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { preference, setPreference, accentColor, setAccentColor } = useTheme();
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Appearance" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: botPad }]}
      >
        {/* Theme */}
        <Animated.View entering={FadeInDown.duration(400).delay(0)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Theme</Text>
          <View style={styles.themeGrid}>
            {THEMES.map((t) => {
              const active = preference === t.id;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setPreference(t.id)}
                  style={[
                    styles.themeCard,
                    {
                      backgroundColor: active ? colors.primary : colors.card,
                      borderColor: active ? colors.primary : colors.border,
                      borderWidth: active ? 0 : 1.5,
                    },
                    shadows.sm,
                  ]}
                >
                  <View
                    style={[
                      styles.themeIcon,
                      {
                        backgroundColor: active
                          ? "rgba(255,255,255,0.15)"
                          : colors.muted,
                      },
                    ]}
                  >
                    <Feather
                      name={t.icon}
                      size={20}
                      color={active ? colors.primaryForeground : colors.secondary}
                    />
                  </View>
                  <Text
                    style={[
                      styles.themeLabel,
                      { color: active ? colors.primaryForeground : colors.primary },
                    ]}
                  >
                    {t.label}
                  </Text>
                  <Text
                    style={[
                      styles.themeDesc,
                      {
                        color: active
                          ? "rgba(247,245,240,0.7)"
                          : colors.mutedForeground,
                      },
                    ]}
                  >
                    {t.desc}
                  </Text>
                  {active && (
                    <View style={[styles.checkBadge, { backgroundColor: colors.accentOrange }]}>
                      <Feather name="check" size={10} color="#FFF" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
          <View style={[styles.noteCard, { backgroundColor: colors.muted }]}>
            <Feather name="info" size={14} color={colors.mutedForeground} />
            <Text style={[styles.noteText, { color: colors.secondary }]}>
              Changes apply immediately across the entire app.
            </Text>
          </View>
        </Animated.View>

        {/* Accent color */}
        <Animated.View entering={FadeInDown.duration(400).delay(80)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Accent color</Text>
          <View style={[styles.accentCard, { backgroundColor: colors.card }, shadows.sm]}>
            <View style={styles.accentRow}>
              {ACCENT_COLORS.map((c) => {
                const active = accentColor === c.hex;
                return (
                  <Pressable
                    key={c.hex}
                    onPress={() => setAccentColor(c.hex)}
                    style={[
                      styles.accentDot,
                      {
                        backgroundColor: c.hex,
                        transform: [{ scale: active ? 1.2 : 1 }],
                        borderWidth: active ? 2 : 0,
                        borderColor: "#FFF",
                      },
                    ]}
                  >
                    {active && <Feather name="check" size={14} color="#FFF" />}
                  </Pressable>
                );
              })}
            </View>
            <View style={[styles.previewRow, { backgroundColor: colors.muted }]}>
              <View style={[styles.previewBtn, { backgroundColor: colors.accentOrange }]}>
                <Text style={styles.previewBtnText}>Add to cart</Text>
              </View>
              <View
                style={[styles.previewBadge, { backgroundColor: colors.accentOrange + "20" }]}
              >
                <Text style={[styles.previewBadgeText, { color: colors.accentOrange }]}>
                  OFFER
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Accessibility */}
        <Animated.View entering={FadeInDown.duration(400).delay(160)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Accessibility</Text>
          <View style={[styles.accessCard, { backgroundColor: colors.card }, shadows.sm]}>
            <View style={styles.accessRow}>
              <View style={styles.accessInfo}>
                <Text style={[styles.accessLabel, { color: colors.primary }]}>
                  Default: Light mode
                </Text>
                <Text style={[styles.accessDesc, { color: colors.mutedForeground }]}>
                  App starts in light mode unless changed above
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: colors.accentGreen + "20" },
                ]}
              >
                <Text style={[styles.badgeText, { color: colors.accentGreen }]}>Active</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 24 },
  section: { gap: 12 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5 },
  themeGrid: { flexDirection: "row", gap: 10 },
  themeCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    gap: 8,
    alignItems: "center",
    position: "relative",
  },
  themeIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  themeLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  themeDesc: { fontFamily: "Inter_400Regular", fontSize: 11, textAlign: "center" },
  checkBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  noteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    borderRadius: 12,
    padding: 12,
  },
  noteText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
  accentCard: { borderRadius: 20, padding: 16, gap: 16 },
  accentRow: { flexDirection: "row", gap: 12, justifyContent: "space-around" },
  accentDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  previewRow: {
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  previewBtn: { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 9 },
  previewBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#FFF" },
  previewBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  previewBadgeText: { fontFamily: "Inter_700Bold", fontSize: 11 },
  accessCard: { borderRadius: 20, overflow: "hidden" },
  accessRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  accessInfo: { flex: 1, gap: 2 },
  accessLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  accessDesc: { fontFamily: "Inter_400Regular", fontSize: 12 },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
});
