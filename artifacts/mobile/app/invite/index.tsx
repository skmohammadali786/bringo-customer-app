import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const REFERRAL_HISTORY = [
  { name: "Priya M.", status: "Signed up", earning: "₹200", time: "3 days ago" },
  { name: "Rahul K.", status: "First order placed", earning: "₹200", time: "1 week ago" },
  { name: "Sneha D.", status: "Invited", earning: "Pending", time: "2 days ago" },
];

const referralCode = "BRINGO-ARJUN";
const referralLink = `https://bringo.app/join?ref=${referralCode}`;

export default function InviteScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const totalEarned = 400;

  const handleCopy = async () => {
    try {
      if (Platform.OS === "web") {
        await navigator.clipboard?.writeText(referralCode);
      } else {
        await Clipboard.setStringAsync(referralCode);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async (platform?: string) => {
    const message = `Hey! Join Bringo and get ₹100 off your first order. Use my referral code: ${referralCode}\n\n${referralLink}`;
    try {
      await Share.share({
        message,
        url: referralLink,
        title: "Join Bringo & get ₹100 off!",
      });
    } catch {
      Alert.alert("Share", message);
    }
  };

  const SHARE_OPTIONS = [
    { id: "whatsapp", label: "WhatsApp", icon: "message-circle" as const, color: "#25D366" },
    { id: "sms", label: "SMS", icon: "smartphone" as const, color: "#4A90E2" },
    { id: "email", label: "Email", icon: "mail" as const, color: "#FF9A3D" },
    { id: "copy", label: "Copy link", icon: "copy" as const, color: "#5B5B5B" },
  ];

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Invite & earn" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: botPad }]}
      >
        {/* Hero */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(0)}
          style={[styles.heroCard, { backgroundColor: colors.primary }, shadows.lg]}
        >
          <Text style={styles.heroEmoji}>🎁</Text>
          <Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>
            Earn ₹200 for every friend
          </Text>
          <Text style={[styles.heroSub, { color: "rgba(247,245,240,0.7)" }]}>
            Your friend gets ₹100 off their first order. You earn ₹200 when they complete it.
          </Text>
          <View style={styles.earningsRow}>
            <View style={[styles.earningCard, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
              <Text style={styles.earningValue}>₹{totalEarned}</Text>
              <Text style={styles.earningLabel}>Total earned</Text>
            </View>
            <View style={[styles.earningCard, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
              <Text style={styles.earningValue}>2</Text>
              <Text style={styles.earningLabel}>Friends joined</Text>
            </View>
            <View style={[styles.earningCard, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
              <Text style={styles.earningValue}>1</Text>
              <Text style={styles.earningLabel}>Pending</Text>
            </View>
          </View>
        </Animated.View>

        {/* Referral code */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(80)}
          style={[styles.codeCard, { backgroundColor: colors.card }, shadows.card]}
        >
          <Text style={[styles.codeLabel, { color: colors.mutedForeground }]}>
            Your referral code
          </Text>
          <View style={styles.codeRow}>
            <View
              style={[
                styles.codeBadge,
                { backgroundColor: colors.muted, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.codeText, { color: colors.primary }]}>{referralCode}</Text>
            </View>
            <Pressable
              onPress={handleCopy}
              style={[
                styles.copyBtn,
                { backgroundColor: copied ? colors.accentGreen : colors.primary },
              ]}
            >
              <Feather name={copied ? "check" : "copy"} size={16} color="#FFF" />
              <Text style={styles.copyText}>{copied ? "Copied!" : "Copy"}</Text>
            </Pressable>
          </View>
        </Animated.View>

        {/* Share options */}
        <Animated.View entering={FadeInDown.duration(400).delay(160)}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Share via</Text>
          <View style={styles.shareGrid}>
            {SHARE_OPTIONS.map((opt) => (
              <Pressable
                key={opt.id}
                style={({ pressed }) => [
                  styles.shareBtn,
                  { backgroundColor: colors.card },
                  shadows.sm,
                  pressed && { opacity: 0.75 },
                ]}
                onPress={() =>
                  opt.id === "copy" ? handleCopy() : handleShare(opt.id)
                }
              >
                <View style={[styles.shareIcon, { backgroundColor: opt.color + "18" }]}>
                  <Feather name={opt.icon} size={22} color={opt.color} />
                </View>
                <Text style={[styles.shareLabel, { color: colors.primary }]}>{opt.label}</Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* How it works */}
        <Animated.View entering={FadeInDown.duration(400).delay(220)}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>How it works</Text>
          <View style={[styles.howCard, { backgroundColor: colors.card }, shadows.sm]}>
            {[
              { step: "1", text: "Share your code with friends" },
              { step: "2", text: "They sign up with your code" },
              { step: "3", text: "They place their first order" },
              { step: "4", text: "You earn ₹200, they get ₹100 off!" },
            ].map((row, i) => (
              <View key={row.step}>
                {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                <View style={styles.stepRow}>
                  <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.stepNum, { color: colors.primaryForeground }]}>
                      {row.step}
                    </Text>
                  </View>
                  <Text style={[styles.stepText, { color: colors.primary }]}>{row.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* History */}
        <Animated.View entering={FadeInDown.duration(400).delay(280)}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Referral history</Text>
          </View>
          {REFERRAL_HISTORY.slice(0, 2).map((r, i) => (
            <Animated.View
              key={r.name}
              entering={FadeInDown.duration(300).delay(300 + i * 60)}
            >
              <View
                style={[styles.refRow, { backgroundColor: colors.card }, shadows.sm]}
              >
                <View style={[styles.refAvatar, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.refInitial, { color: colors.primary }]}>
                    {r.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.refInfo}>
                  <Text style={[styles.refName, { color: colors.primary }]}>{r.name}</Text>
                  <Text style={[styles.refStatus, { color: colors.mutedForeground }]}>
                    {r.status} · {r.time}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.refEarning,
                    {
                      color:
                        r.earning === "Pending"
                          ? colors.mutedForeground
                          : colors.accentGreen,
                    },
                  ]}
                >
                  {r.earning}
                </Text>
              </View>
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 16 },
  heroCard: { borderRadius: 28, padding: 24, gap: 10, alignItems: "center" },
  heroEmoji: { fontSize: 48 },
  heroTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    letterSpacing: -0.8,
    textAlign: "center",
  },
  heroSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  earningsRow: { flexDirection: "row", gap: 10, marginTop: 6 },
  earningCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: "center", gap: 3 },
  earningValue: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: "#FFF",
    letterSpacing: -0.5,
  },
  earningLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: "rgba(247,245,240,0.7)",
  },
  codeCard: { borderRadius: 22, padding: 20, gap: 10 },
  codeLabel: { fontFamily: "Inter_400Regular", fontSize: 13 },
  codeRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  codeBadge: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  codeText: { fontFamily: "Inter_700Bold", fontSize: 16, letterSpacing: 2 },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  copyText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#FFF" },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5, marginBottom: 10 },
  shareGrid: { flexDirection: "row", gap: 10 },
  shareBtn: { flex: 1, borderRadius: 18, padding: 14, alignItems: "center", gap: 8 },
  shareIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  shareLabel: { fontFamily: "Inter_500Medium", fontSize: 12 },
  howCard: { borderRadius: 20, overflow: "hidden" },
  stepRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  stepBadge: { width: 28, height: 28, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  stepNum: { fontFamily: "Inter_700Bold", fontSize: 14 },
  stepText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14 },
  divider: { height: 1, marginHorizontal: 14 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  refRow: {
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  refAvatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  refInitial: { fontFamily: "Inter_700Bold", fontSize: 18 },
  refInfo: { flex: 1, gap: 2 },
  refName: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  refStatus: { fontFamily: "Inter_400Regular", fontSize: 12 },
  refEarning: { fontFamily: "Inter_700Bold", fontSize: 14 },
});
