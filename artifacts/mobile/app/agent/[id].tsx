import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const AGENT_STATS = [
  { label: "Deliveries", value: "1,248" },
  { label: "Rating", value: "4.9" },
  { label: "On time", value: "98%" },
];

const RECENT_REVIEWS = [
  { name: "Priya M.", rating: 5, text: "Super fast and very friendly!", time: "2 days ago" },
  { name: "Arjun S.", rating: 5, text: "Professional and on time.", time: "1 week ago" },
];

export default function AgentProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Agent profile" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {/* Profile */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }, shadows.card]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarLetter, { color: colors.primaryForeground }]}>R</Text>
          </View>
          <Text style={[styles.agentName, { color: colors.primary }]}>Rahul Kumar</Text>
          <View style={styles.ratingRow}>
            {[1,2,3,4,5].map((s) => (
              <Feather key={s} name="star" size={18} color={s <= 5 ? colors.accentOrange : colors.border} />
            ))}
            <Text style={[styles.ratingText, { color: colors.secondary }]}>(4.9)</Text>
          </View>
          <View style={[styles.activeBadge, { backgroundColor: colors.accentGreen + "18" }]}>
            <View style={[styles.activeDot, { backgroundColor: colors.accentGreen }]} />
            <Text style={[styles.activeText, { color: colors.accentGreen }]}>On delivery</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {AGENT_STATS.map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: colors.card }, shadows.sm]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Current order */}
        <View style={[styles.orderCard, { backgroundColor: colors.primary }, shadows.lg]}>
          <Text style={[styles.orderTitle, { color: colors.primaryForeground }]}>Your current order</Text>
          <Text style={[styles.orderItems, { color: "rgba(247,245,240,0.8)" }]}>Organic Milk × 2 · Bread × 1</Text>
          <View style={styles.etaRow}>
            <Feather name="navigation" size={16} color={colors.accentOrange} />
            <Text style={[styles.etaText, { color: colors.primaryForeground }]}>Arriving in 8 minutes</Text>
          </View>
          <Pressable style={[styles.trackBtn, { backgroundColor: colors.accentOrange }]}
            onPress={() => router.push("/agent/track" as any)}>
            <Feather name="map" size={16} color="#FFF" />
            <Text style={styles.trackText}>Track live</Text>
          </Pressable>
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable style={[styles.actionBtn, { backgroundColor: colors.card }, shadows.sm]}
            onPress={() => router.push("/chat/support" as any)}>
            <View style={[styles.actionIcon, { backgroundColor: colors.accentGreen + "18" }]}>
              <Feather name="message-circle" size={22} color={colors.accentGreen} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.primary }]}>Message</Text>
          </Pressable>
          <Pressable style={[styles.actionBtn, { backgroundColor: colors.card }, shadows.sm]}>
            <View style={[styles.actionIcon, { backgroundColor: colors.accentBlue + "18" }]}>
              <Feather name="phone" size={22} color={colors.accentBlue} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.primary }]}>Call</Text>
          </Pressable>
          <Pressable style={[styles.actionBtn, { backgroundColor: colors.card }, shadows.sm]}
            onPress={() => router.push("/order/issue" as any)}>
            <View style={[styles.actionIcon, { backgroundColor: colors.danger + "18" }]}>
              <Feather name="alert-circle" size={22} color={colors.danger} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.primary }]}>Report</Text>
          </Pressable>
        </View>

        {/* Reviews */}
        <View style={styles.reviewSection}>
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>Recent reviews</Text>
          {RECENT_REVIEWS.map((r) => (
            <View key={r.name} style={[styles.reviewCard, { backgroundColor: colors.card }, shadows.sm]}>
              <View style={styles.reviewTop}>
                <View style={[styles.reviewAvatar, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.reviewInitial, { color: colors.primary }]}>{r.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.reviewName, { color: colors.primary }]}>{r.name}</Text>
                  <View style={styles.starsRow}>
                    {[1,2,3,4,5].map((s) => (
                      <Feather key={s} name="star" size={11} color={s <= r.rating ? colors.accentOrange : colors.border} />
                    ))}
                  </View>
                </View>
                <Text style={[styles.reviewTime, { color: colors.mutedForeground }]}>{r.time}</Text>
              </View>
              <Text style={[styles.reviewText, { color: colors.secondary }]}>{r.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 16 },
  profileCard: { borderRadius: 28, padding: 28, alignItems: "center", gap: 10 },
  avatar: { width: 80, height: 80, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  avatarLetter: { fontSize: 40, fontFamily: "Inter_700Bold" },
  agentName: { fontSize: 24, fontFamily: "Inter_700Bold", letterSpacing: -0.8 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { fontFamily: "Inter_500Medium", fontSize: 15, marginLeft: 4 },
  activeBadge: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  activeDot: { width: 8, height: 8, borderRadius: 4 },
  activeText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: { flex: 1, borderRadius: 18, padding: 16, gap: 4, alignItems: "center" },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: -0.5 },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 12 },
  orderCard: { borderRadius: 24, padding: 20, gap: 8 },
  orderTitle: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5 },
  orderItems: { fontFamily: "Inter_400Regular", fontSize: 14 },
  etaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  etaText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  trackBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 14, padding: 12, marginTop: 8 },
  trackText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#FFF" },
  actionsRow: { flexDirection: "row", gap: 10 },
  actionBtn: { flex: 1, borderRadius: 18, padding: 16, alignItems: "center", gap: 10 },
  actionIcon: { width: 50, height: 50, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  actionLabel: { fontFamily: "Inter_500Medium", fontSize: 13 },
  reviewSection: { gap: 10 },
  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5 },
  reviewCard: { borderRadius: 18, padding: 14, gap: 8 },
  reviewTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  reviewInitial: { fontFamily: "Inter_700Bold", fontSize: 16 },
  reviewName: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  starsRow: { flexDirection: "row", gap: 2 },
  reviewTime: { fontFamily: "Inter_400Regular", fontSize: 12 },
  reviewText: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
});
