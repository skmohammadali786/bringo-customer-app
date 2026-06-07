import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
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
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const FAQS = [
  { q: "How does Bringo work?", a: "You request a product, we assign a nearby agent who sources it from local stores and delivers it to you. No need to know which store — we handle everything." },
  { q: "How long does delivery take?", a: "Most deliveries are completed in 20–45 minutes depending on product availability and your location." },
  { q: "What if the product is not available?", a: "Your agent will suggest an alternative and wait for your approval before purchasing." },
  { q: "Can I cancel my order?", a: "You can cancel within 2 minutes of placing the order. After that, cancellation charges may apply." },
  { q: "How do refunds work?", a: "Refunds are processed to your Bringo Wallet within 24 hours of approval." },
];

export default function HelpScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<number | null>(null);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.primary }]}>Help Center</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: botPad }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick actions */}
        <View style={styles.quickRow}>
          {[
            { icon: "message-circle" as const, label: "Live Chat", color: colors.accentGreen },
            { icon: "phone" as const, label: "Call Us", color: colors.accentBlue },
            { icon: "mail" as const, label: "Email", color: colors.accentOrange },
          ].map((action) => (
            <Pressable
              key={action.label}
              style={[styles.quickBtn, { backgroundColor: colors.card }, shadows.sm]}
            >
              <View style={[styles.quickIcon, { backgroundColor: `${action.color}18` }]}>
                <Feather name={action.icon} size={20} color={action.color} />
              </View>
              <Text style={[styles.quickLabel, { color: colors.primary }]}>{action.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.faqTitle, { color: colors.primary }]}>Frequently Asked</Text>

        {FAQS.map((faq, i) => (
          <Pressable
            key={i}
            onPress={() => setExpanded(expanded === i ? null : i)}
            style={[styles.faqCard, { backgroundColor: colors.card }, shadows.sm]}
          >
            <View style={styles.faqHeader}>
              <Text style={[styles.faqQ, { color: colors.primary }]}>{faq.q}</Text>
              <Feather
                name={expanded === i ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.mutedForeground}
              />
            </View>
            {expanded === i && (
              <Text style={[styles.faqA, { color: colors.secondary }]}>{faq.a}</Text>
            )}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.pagePadding,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { ...typography.h3 },
  content: { paddingHorizontal: spacing.pagePadding, gap: 12 },
  quickRow: { flexDirection: "row", gap: 12, marginBottom: 8 },
  quickBtn: { flex: 1, borderRadius: 18, padding: 16, alignItems: "center", gap: 10 },
  quickIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  quickLabel: { fontFamily: "Inter_500Medium", fontSize: 13 },
  faqTitle: { ...typography.sectionTitle, marginTop: 8, marginBottom: 4 },
  faqCard: { borderRadius: 18, padding: 18, gap: 12 },
  faqHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  faqQ: { fontFamily: "Inter_500Medium", fontSize: 15, flex: 1, lineHeight: 22 },
  faqA: { ...typography.body, lineHeight: 22 },
});
