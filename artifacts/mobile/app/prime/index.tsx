import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const PERKS = [
  { icon: "truck" as const, title: "Free delivery always", subtitle: "No minimum order. No delivery fee.", color: "#34C759" },
  { icon: "zap" as const, title: "Priority express", subtitle: "Get orders 2× faster than regular.", color: "#FF9A3D" },
  { icon: "percent" as const, title: "Member discounts", subtitle: "Exclusive 5–15% off on everything.", color: "#4A90E2" },
  { icon: "credit-card" as const, title: "2× cashback", subtitle: "Earn double Bringo points on every order.", color: "#9B59B6" },
  { icon: "headphones" as const, title: "Priority support", subtitle: "Dedicated support line, zero wait time.", color: "#E74C3C" },
  { icon: "calendar" as const, title: "Scheduled deliveries", subtitle: "Plan recurring orders weekly or monthly.", color: "#1ABC9C" },
];

export default function PrimeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BackHeader title="" transparent />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 90 }]}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <View style={[styles.logoBadge, { backgroundColor: colors.accentOrange }]}>
            <Text style={styles.logoText}>B</Text>
          </View>
          <Text style={styles.heroTitle}>Bringo Prime</Text>
          <Text style={styles.heroSub}>
            The fastest, smartest way to get anything delivered.
          </Text>
          <View style={styles.heroTags}>
            {["Free delivery", "2× faster", "Best price"].map((tag) => (
              <View key={tag} style={[styles.heroTag, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
                <Feather name="check" size={12} color={colors.accentOrange} />
                <Text style={styles.heroTagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Perks */}
        <View style={styles.perksSection}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Everything you get</Text>
          {PERKS.map((perk) => (
            <View key={perk.icon} style={[styles.perkRow, { backgroundColor: colors.card }, shadows.sm]}>
              <View style={[styles.perkIcon, { backgroundColor: perk.color + "18" }]}>
                <Feather name={perk.icon} size={22} color={perk.color} />
              </View>
              <View style={styles.perkText}>
                <Text style={[styles.perkTitle, { color: colors.primary }]}>{perk.title}</Text>
                <Text style={[styles.perkSub, { color: colors.secondary }]}>{perk.subtitle}</Text>
              </View>
              <Feather name="check-circle" size={20} color={colors.accentGreen} />
            </View>
          ))}
        </View>

        {/* Comparison */}
        <View style={[styles.compareCard, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.compareTitle, { color: colors.primary }]}>Prime vs Regular</Text>
          {[
            { label: "Delivery fee", regular: "₹29/order", prime: "Free" },
            { label: "Express delivery", regular: "₹49", prime: "Included" },
            { label: "Cashback", regular: "1%", prime: "2%" },
            { label: "Support", regular: "Standard", prime: "Priority" },
          ].map((row, i) => (
            <View key={row.label}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <View style={styles.compareRow}>
                <Text style={[styles.compareLabel, { color: colors.secondary }]}>{row.label}</Text>
                <Text style={[styles.compareRegular, { color: colors.mutedForeground }]}>{row.regular}</Text>
                <View style={[styles.comparePrimeBadge, { backgroundColor: colors.accentOrange + "18" }]}>
                  <Text style={[styles.comparePrime, { color: colors.accentOrange }]}>{row.prime}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Testimonial */}
        <View style={[styles.testimonial, { backgroundColor: colors.primary }, shadows.card]}>
          <Text style={styles.testimonialText}>
            "Prime changed how I shop. I order 3× more and save ₹500+ a month on deliveries."
          </Text>
          <Text style={styles.testimonialAuthor}>— Priya M., Prime since 2024</Text>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <View style={styles.footerInfo}>
          <Text style={[styles.footerPrice, { color: colors.primary }]}>₹199/month</Text>
          <Text style={[styles.footerSave, { color: colors.accentGreen }]}>Save ₹500+ monthly</Text>
        </View>
        <Button
          label="Try free for 7 days"
          onPress={() => router.push("/prime/plans" as any)}
          variant="primary"
          style={styles.ctaBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { gap: 20 },
  hero: {
    minHeight: 280,
    padding: 28,
    paddingTop: 80,
    gap: 10,
    alignItems: "center",
  },
  logoBadge: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  logoText: { fontSize: 32, fontFamily: "Inter_700Bold", color: "#FFF" },
  heroTitle: { fontSize: 36, fontFamily: "Inter_700Bold", color: "#FFF", letterSpacing: -1.5, textAlign: "center" },
  heroSub: { fontFamily: "Inter_400Regular", fontSize: 15, color: "rgba(247,245,240,0.7)", textAlign: "center" },
  heroTags: { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 8 },
  heroTag: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  heroTagText: { fontFamily: "Inter_500Medium", fontSize: 12, color: "#FFF" },
  perksSection: { paddingHorizontal: spacing.pagePadding, gap: 10 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: -0.8, marginBottom: 4 },
  perkRow: { borderRadius: 18, padding: 16, flexDirection: "row", alignItems: "center", gap: 14 },
  perkIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  perkText: { flex: 1, gap: 2 },
  perkTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  perkSub: { fontFamily: "Inter_400Regular", fontSize: 13 },
  compareCard: { borderRadius: 24, padding: 20, gap: 0, marginHorizontal: spacing.pagePadding },
  compareTitle: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5, marginBottom: 14 },
  compareRow: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  compareLabel: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14 },
  compareRegular: { fontFamily: "Inter_400Regular", fontSize: 14, minWidth: 80, textAlign: "center", textDecorationLine: "line-through" },
  comparePrimeBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  comparePrime: { fontFamily: "Inter_700Bold", fontSize: 13 },
  divider: { height: 1 },
  testimonial: {
    borderRadius: 24,
    padding: 24,
    gap: 10,
    marginHorizontal: spacing.pagePadding,
  },
  testimonialText: { fontFamily: "Inter_400Regular", fontSize: 15, color: "rgba(247,245,240,0.9)", lineHeight: 22, fontStyle: "italic" },
  testimonialAuthor: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: colors => colors, opacity: 0.6 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.pagePadding,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  footerInfo: { gap: 2 },
  footerPrice: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: -0.5 },
  footerSave: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  ctaBtn: { flex: 1 },
});
