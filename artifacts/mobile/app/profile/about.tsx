import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

export default function AboutScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const LINKS = [
    { label: "Privacy Policy", icon: "shield" as const, route: "/profile/privacy" },
    { label: "Terms of Service", icon: "file-text" as const, route: "/profile/terms" },
    { label: "Help Center", icon: "help-circle" as const, route: "/support" },
    { label: "Rate the app", icon: "star" as const, route: "/rate-app" },
    { label: "Licenses", icon: "code" as const, route: "/profile/about" },
  ];

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="About Bringo" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {/* Brand */}
        <View style={[styles.brandCard, { backgroundColor: colors.card }, shadows.card]}>
          <View style={[styles.logoBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.logoText, { color: colors.primaryForeground }]}>B</Text>
          </View>
          <Text style={[styles.brandName, { color: colors.primary }]}>Bringo</Text>
          <Text style={[styles.tagline, { color: colors.secondary }]}>anything, delivered.</Text>
          <View style={[styles.versionBadge, { backgroundColor: colors.muted }]}>
            <Text style={[styles.versionText, { color: colors.secondary }]}>Version 1.0.0 · Build 100</Text>
          </View>
        </View>

        {/* Mission */}
        <View style={[styles.missionCard, { backgroundColor: colors.primary }, shadows.lg]}>
          <Text style={styles.missionTitle}>Our mission</Text>
          <Text style={styles.missionText}>
            We believe that getting anything you need — groceries, medicine, electronics — should be as fast as a
            text message and as reliable as a friend. Bringo exists to make that a reality for every neighbourhood in India.
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { value: "2M+", label: "Deliveries" },
            { value: "15 min", label: "Avg. delivery" },
            { value: "4.9★", label: "App rating" },
          ].map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.card }, shadows.sm]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Links */}
        <View style={[styles.linksCard, { backgroundColor: colors.card }, shadows.sm]}>
          {LINKS.map((link, i) => (
            <View key={link.label}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <Pressable style={styles.linkRow} onPress={() => router.push(link.route as any)}>
                <View style={[styles.linkIcon, { backgroundColor: colors.muted }]}>
                  <Feather name={link.icon} size={16} color={colors.secondary} />
                </View>
                <Text style={[styles.linkLabel, { color: colors.primary }]}>{link.label}</Text>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </Pressable>
            </View>
          ))}
        </View>

        <Text style={[styles.footer, { color: colors.mutedForeground }]}>
          Made with ❤️ in Bengaluru, India{"\n"}© 2025 Bringo Technologies Pvt Ltd
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 16 },
  brandCard: { borderRadius: 28, padding: 28, alignItems: "center", gap: 8 },
  logoBadge: { width: 72, height: 72, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: 40, fontFamily: "Inter_700Bold" },
  brandName: { fontSize: 28, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  tagline: { fontFamily: "Inter_400Regular", fontSize: 15 },
  versionBadge: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6, marginTop: 4 },
  versionText: { fontFamily: "Inter_400Regular", fontSize: 13 },
  missionCard: { borderRadius: 24, padding: 24, gap: 10 },
  missionTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: "#F7F5F0", letterSpacing: -0.5 },
  missionText: { fontFamily: "Inter_400Regular", fontSize: 14, color: "rgba(247,245,240,0.8)", lineHeight: 22 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, borderRadius: 18, padding: 16, gap: 4, alignItems: "center" },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: -0.5 },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 12 },
  linksCard: { borderRadius: 20, overflow: "hidden" },
  divider: { height: 1, marginHorizontal: 16 },
  linkRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  linkIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  linkLabel: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 15 },
  footer: { fontFamily: "Inter_400Regular", fontSize: 12, textAlign: "center", lineHeight: 18, marginBottom: 8 },
});
