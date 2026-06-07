import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const HELP_TOPICS = [
  { icon: "package" as const, title: "Order issues", subtitle: "Missing, damaged, or wrong items", route: "/order/issue", color: "#FF9A3D" },
  { icon: "truck" as const, title: "Delivery problem", subtitle: "Late, failed, or wrong address", route: "/order/issue", color: "#4A90E2" },
  { icon: "credit-card" as const, title: "Payment & refund", subtitle: "Billing, wallet, or refund queries", route: "/support/ticket", color: "#34C759" },
  { icon: "user" as const, title: "Account help", subtitle: "Login, profile, or settings issues", route: "/support/ticket", color: "#9B59B6" },
  { icon: "gift" as const, title: "Offers & cashback", subtitle: "Coupon, promo or reward issues", route: "/support/ticket", color: "#E74C3C" },
  { icon: "more-horizontal" as const, title: "Something else", subtitle: "Any other topic", route: "/support/ticket", color: "#5B5B5B" },
];

const FAQS = [
  { q: "How long does delivery take?", a: "Most orders are delivered in 15–45 minutes depending on your location and item availability." },
  { q: "Can I cancel my order?", a: "Yes, you can cancel before the agent picks up the item. A cancellation fee may apply." },
  { q: "How do I get a refund?", a: "Refunds are processed to your Bringo Wallet within 2 minutes of approval." },
  { q: "Is there a minimum order amount?", a: "No minimum order amount. However, orders below ₹199 incur a ₹29 delivery fee." },
];

export default function SupportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Help & Support" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {/* Live chat CTA */}
        <Pressable style={[styles.chatCta, { backgroundColor: colors.primary }, shadows.lg]}
          onPress={() => router.push("/support/chat" as any)}>
          <View style={[styles.chatIcon, { backgroundColor: colors.accentOrange }]}>
            <Feather name="message-circle" size={22} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.chatTitle, { color: colors.primaryForeground }]}>Chat with support</Text>
            <Text style={[styles.chatSub, { color: "rgba(247,245,240,0.7)" }]}>Usually replies in &lt; 2 minutes</Text>
          </View>
          <View style={[styles.onlineDot, { backgroundColor: colors.accentGreen }]} />
        </Pressable>

        {/* Topics */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>What do you need help with?</Text>
        <View style={styles.topicsGrid}>
          {HELP_TOPICS.map((topic) => (
            <Pressable key={topic.title} onPress={() => router.push(topic.route as any)}
              style={[styles.topicCard, { backgroundColor: colors.card }, shadows.sm]}>
              <View style={[styles.topicIcon, { backgroundColor: topic.color + "18" }]}>
                <Feather name={topic.icon} size={20} color={topic.color} />
              </View>
              <Text style={[styles.topicTitle, { color: colors.primary }]}>{topic.title}</Text>
              <Text style={[styles.topicSub, { color: colors.mutedForeground }]} numberOfLines={2}>{topic.subtitle}</Text>
            </Pressable>
          ))}
        </View>

        {/* FAQ */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Frequently asked</Text>
        <View style={[styles.faqCard, { backgroundColor: colors.card }, shadows.sm]}>
          {FAQS.map((faq, i) => (
            <View key={i}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <Pressable style={styles.faqRow} onPress={() => setOpenFaq(openFaq === i ? null : i)}>
                <Text style={[styles.faqQ, { color: colors.primary }]}>{faq.q}</Text>
                <Feather name={openFaq === i ? "chevron-up" : "chevron-down"} size={18} color={colors.mutedForeground} />
              </Pressable>
              {openFaq === i && (
                <Text style={[styles.faqA, { color: colors.secondary }]}>{faq.a}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Create ticket */}
        <Pressable style={[styles.ticketBtn, { backgroundColor: colors.muted }]}
          onPress={() => router.push("/support/ticket" as any)}>
          <Feather name="file-text" size={18} color={colors.secondary} />
          <Text style={[styles.ticketText, { color: colors.primary }]}>Create a support ticket</Text>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 20 },
  chatCta: { borderRadius: 24, padding: 20, flexDirection: "row", alignItems: "center", gap: 14 },
  chatIcon: { width: 48, height: 48, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  chatTitle: { fontFamily: "Inter_700Bold", fontSize: 17, letterSpacing: -0.3 },
  chatSub: { fontFamily: "Inter_400Regular", fontSize: 13 },
  onlineDot: { width: 12, height: 12, borderRadius: 6 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: -0.5 },
  topicsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  topicCard: { width: "47%", borderRadius: 18, padding: 16, gap: 8 },
  topicIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  topicTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  topicSub: { fontFamily: "Inter_400Regular", fontSize: 12, lineHeight: 16 },
  faqCard: { borderRadius: 20, overflow: "hidden" },
  faqRow: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  faqQ: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 14 },
  faqA: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 19, paddingHorizontal: 16, paddingBottom: 14 },
  divider: { height: 1 },
  ticketBtn: { borderRadius: 16, padding: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  ticketText: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 15 },
});
