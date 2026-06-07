import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const PLANS = [
  {
    id: "monthly",
    name: "Monthly",
    price: 199,
    period: "/month",
    tag: null,
    features: ["Free delivery on all orders", "Priority express delivery", "5% member discount", "2× cashback points", "Priority support"],
  },
  {
    id: "quarterly",
    name: "Quarterly",
    price: 499,
    period: "/3 months",
    tag: "SAVE 16%",
    features: ["Free delivery on all orders", "Priority express delivery", "8% member discount", "2× cashback points", "Priority support", "Early access to flash sales"],
  },
  {
    id: "annual",
    name: "Annual",
    price: 1499,
    period: "/year",
    tag: "BEST VALUE",
    features: ["Free delivery on all orders", "Priority express delivery", "15% member discount", "3× cashback points", "Dedicated support agent", "Early access to flash sales", "Free premium packaging"],
  },
];

export default function PrimePlansScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState("annual");
  const [subscribing, setSubscribing] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const selectedPlan = PLANS.find((p) => p.id === selected)!;

  const handleSubscribe = async () => {
    setSubscribing(true);
    await new Promise((r) => setTimeout(r, 1500));
    router.replace("/prime/success" as any);
  };

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Choose your plan" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad + 90 }]}>
        {/* Trial banner */}
        <View style={[styles.trialBanner, { backgroundColor: colors.accentOrange }, shadows.card]}>
          <Feather name="gift" size={20} color="#FFF" />
          <Text style={styles.trialText}>Try any plan free for 7 days. Cancel anytime.</Text>
        </View>

        {/* Plan cards */}
        {PLANS.map((plan) => {
          const active = selected === plan.id;
          return (
            <Pressable key={plan.id} onPress={() => setSelected(plan.id)}
              style={[
                styles.planCard,
                {
                  backgroundColor: active ? colors.primary : colors.card,
                  borderColor: active ? colors.primary : colors.border,
                  borderWidth: active ? 0 : 1.5,
                },
                active && shadows.lg,
                !active && shadows.sm,
              ]}>
              <View style={styles.planHeader}>
                <View>
                  <Text style={[styles.planName, { color: active ? colors.primaryForeground : colors.primary }]}>{plan.name}</Text>
                  <View style={styles.planPriceRow}>
                    <Text style={[styles.planPrice, { color: active ? colors.primaryForeground : colors.primary }]}>₹{plan.price}</Text>
                    <Text style={[styles.planPeriod, { color: active ? "rgba(247,245,240,0.6)" : colors.mutedForeground }]}>{plan.period}</Text>
                  </View>
                </View>
                <View style={styles.planRight}>
                  {plan.tag && (
                    <View style={[styles.planTag, { backgroundColor: active ? colors.accentOrange : colors.accentOrange }]}>
                      <Text style={styles.planTagText}>{plan.tag}</Text>
                    </View>
                  )}
                  <View style={[styles.radio, { borderColor: active ? colors.primaryForeground : colors.border }]}>
                    {active && <View style={[styles.radioDot, { backgroundColor: colors.primaryForeground }]} />}
                  </View>
                </View>
              </View>
              <View style={[styles.planDivider, { backgroundColor: active ? "rgba(247,245,240,0.15)" : colors.border }]} />
              {plan.features.map((f) => (
                <View key={f} style={styles.featureRow}>
                  <Feather name="check" size={14} color={active ? colors.accentGreen : colors.accentGreen} />
                  <Text style={[styles.featureText, { color: active ? "rgba(247,245,240,0.85)" : colors.secondary }]}>{f}</Text>
                </View>
              ))}
            </Pressable>
          );
        })}

        <Text style={[styles.note, { color: colors.mutedForeground }]}>
          By subscribing you agree to our Terms. Your subscription auto-renews unless cancelled.
        </Text>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <View>
          <Text style={[styles.footerPrice, { color: colors.primary }]}>
            ₹{selectedPlan.price}{selectedPlan.period}
          </Text>
          <Text style={[styles.footerNote, { color: colors.accentGreen }]}>7-day free trial</Text>
        </View>
        <Button label="Start free trial" onPress={handleSubscribe} loading={subscribing} variant="primary" style={styles.subscribeBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 14 },
  trialBanner: { borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  trialText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: "#FFF", flex: 1 },
  planCard: { borderRadius: 22, padding: 20, gap: 10 },
  planHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  planName: { fontFamily: "Inter_600SemiBold", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 },
  planPriceRow: { flexDirection: "row", alignItems: "baseline", gap: 3, marginTop: 4 },
  planPrice: { fontFamily: "Inter_700Bold", fontSize: 30, letterSpacing: -1 },
  planPeriod: { fontFamily: "Inter_400Regular", fontSize: 13 },
  planRight: { gap: 8, alignItems: "flex-end" },
  planTag: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  planTagText: { fontFamily: "Inter_700Bold", fontSize: 10, color: "#FFF", letterSpacing: 0.5 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  planDivider: { height: 1 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  featureText: { fontFamily: "Inter_400Regular", fontSize: 13 },
  note: { fontFamily: "Inter_400Regular", fontSize: 12, lineHeight: 17, textAlign: "center", paddingHorizontal: 20 },
  footer: {
    paddingHorizontal: spacing.pagePadding,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  footerPrice: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: -0.5 },
  footerNote: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  subscribeBtn: { flex: 1 },
});
