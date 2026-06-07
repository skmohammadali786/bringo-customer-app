import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const TERMS = [
  {
    title: "1. Acceptance of terms",
    content: "By using the Bringo app, you agree to these Terms of Service. If you do not agree, please do not use the service. We may update these terms periodically and will notify you of any material changes.",
  },
  {
    title: "2. Service description",
    content: "Bringo provides an on-demand hyperlocal delivery service. We connect you with independent delivery agents ('Agents') who source and deliver products from local stores and suppliers.",
  },
  {
    title: "3. User responsibilities",
    content: "You must be 18+ to use Bringo. You are responsible for maintaining account security, providing accurate delivery information, and ensuring that someone is available to receive your order.",
  },
  {
    title: "4. Ordering & payments",
    content: "Orders are confirmed only after payment. Prices may vary based on availability. Bringo Wallet funds are non-transferable and non-refundable except as required by law.",
  },
  {
    title: "5. Cancellations & refunds",
    content: "Orders may be cancelled before pickup for a small fee. Refunds for issues (missing, damaged, wrong items) are processed to your Bringo Wallet within 2 business hours.",
  },
  {
    title: "6. Limitation of liability",
    content: "Bringo's liability is limited to the value of the order in question. We are not liable for indirect, incidental, or consequential damages arising from use of the service.",
  },
  {
    title: "7. Governing law",
    content: "These terms are governed by the laws of India. Disputes will be resolved through arbitration in Bengaluru under the Arbitration and Conciliation Act, 1996.",
  },
];

export default function TermsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState<number | null>(null);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Terms of Service" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        <View style={[styles.heroBanner, { backgroundColor: colors.primary }, shadows.card]}>
          <Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>Terms of Service</Text>
          <Text style={[styles.heroSub, { color: "rgba(247,245,240,0.7)" }]}>
            Please read these terms carefully before using Bringo.
          </Text>
          <Text style={[styles.heroDate, { color: "rgba(247,245,240,0.5)" }]}>Effective: January 1, 2025</Text>
        </View>

        {TERMS.map((term, i) => (
          <View key={i} style={[styles.termCard, { backgroundColor: colors.card }, shadows.sm]}>
            <Pressable style={styles.termHeader} onPress={() => setOpen(open === i ? null : i)}>
              <Text style={[styles.termTitle, { color: colors.primary }]}>{term.title}</Text>
              <Text style={[styles.chevron, { color: colors.mutedForeground }]}>
                {open === i ? "▲" : "▼"}
              </Text>
            </Pressable>
            {open === i && (
              <Text style={[styles.termContent, { color: colors.secondary }]}>{term.content}</Text>
            )}
          </View>
        ))}

        <View style={[styles.contactCard, { backgroundColor: colors.muted }]}>
          <Text style={[styles.contactTitle, { color: colors.primary }]}>Questions about these terms?</Text>
          <Text style={[styles.contactText, { color: colors.secondary }]}>Contact us at legal@bringo.app</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 12 },
  heroBanner: { borderRadius: 24, padding: 24, gap: 8 },
  heroTitle: { fontFamily: "Inter_700Bold", fontSize: 24, letterSpacing: -1 },
  heroSub: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 },
  heroDate: { fontFamily: "Inter_400Regular", fontSize: 12 },
  termCard: { borderRadius: 18, overflow: "hidden" },
  termHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16 },
  termTitle: { flex: 1, fontFamily: "Inter_600SemiBold", fontSize: 15 },
  chevron: { fontFamily: "Inter_400Regular", fontSize: 12, marginLeft: 8 },
  termContent: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 20, paddingHorizontal: 16, paddingBottom: 16 },
  contactCard: { borderRadius: 16, padding: 16, gap: 4, alignItems: "center" },
  contactTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  contactText: { fontFamily: "Inter_400Regular", fontSize: 13 },
});
