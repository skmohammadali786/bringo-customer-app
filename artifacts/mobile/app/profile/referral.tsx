import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

export default function ReferralScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;
  const CODE = "ALEX200";

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
        <Text style={[styles.title, { color: colors.primary }]}>Invite Friends</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.heroCard, { backgroundColor: colors.primary }, shadows.lg]}>
          <Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>
            Earn ₹200 for every friend!
          </Text>
          <Text style={[styles.heroSub, { color: "rgba(247,245,240,0.7)" }]}>
            Share your code. They get ₹100 off their first order, you earn ₹200.
          </Text>
          <View style={[styles.codeBox, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
            <Text style={[styles.codeText, { color: colors.primaryForeground }]}>{CODE}</Text>
            <Pressable style={[styles.copyBtn, { backgroundColor: colors.accentOrange }]}>
              <Feather name="copy" size={14} color="#FFF" />
              <Text style={styles.copyText}>Copy</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.stepsSection}>
          <Text style={[styles.stepsTitle, { color: colors.primary }]}>How it works</Text>
          {[
            { step: "1", text: "Share your code with friends" },
            { step: "2", text: "They sign up and place their first order" },
            { step: "3", text: "You earn ₹200 in your Bringo Wallet" },
          ].map((s) => (
            <View key={s.step} style={styles.stepRow}>
              <View style={[styles.stepNum, { backgroundColor: colors.primary }]}>
                <Text style={[styles.stepNumText, { color: colors.primaryForeground }]}>{s.step}</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.primary }]}>{s.text}</Text>
            </View>
          ))}
        </View>

        <Pressable style={[styles.shareBtn, { backgroundColor: colors.card }, shadows.sm]}>
          <Feather name="share-2" size={20} color={colors.accentOrange} />
          <Text style={[styles.shareBtnText, { color: colors.primary }]}>Share via WhatsApp / SMS</Text>
        </Pressable>

        <View style={[styles.earningsCard, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.earningsTitle, { color: colors.primary }]}>Your Referral Earnings</Text>
          <View style={styles.earningsRow}>
            <View>
              <Text style={[styles.earningsValue, { color: colors.primary }]}>₹600</Text>
              <Text style={[styles.earningsLabel, { color: colors.mutedForeground }]}>Total earned</Text>
            </View>
            <View style={styles.dividerV} />
            <View>
              <Text style={[styles.earningsValue, { color: colors.accentGreen }]}>3</Text>
              <Text style={[styles.earningsLabel, { color: colors.mutedForeground }]}>Friends joined</Text>
            </View>
          </View>
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
  content: { paddingHorizontal: spacing.pagePadding, gap: 20 },
  heroCard: { borderRadius: 28, padding: 24, gap: 12 },
  heroTitle: { fontFamily: "Inter_700Bold", fontSize: 26, letterSpacing: -1, lineHeight: 30 },
  heroSub: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 },
  codeBox: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 16, padding: 4, paddingLeft: 16, marginTop: 8 },
  codeText: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: 3 },
  copyBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  copyText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#FFF" },
  stepsSection: { gap: 16 },
  stepsTitle: { ...typography.sectionTitle },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  stepNum: { width: 32, height: 32, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  stepNumText: { fontFamily: "Inter_700Bold", fontSize: 14 },
  stepText: { ...typography.bodyMedium, flex: 1 },
  shareBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, borderRadius: 20, padding: 18 },
  shareBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  earningsCard: { borderRadius: 20, padding: 20, gap: 16 },
  earningsTitle: { ...typography.sectionTitle },
  earningsRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-around" },
  earningsValue: { fontFamily: "Inter_700Bold", fontSize: 32, letterSpacing: -1 },
  earningsLabel: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 4 },
  dividerV: { width: 1, height: 48, backgroundColor: "#E3DED4" },
});
