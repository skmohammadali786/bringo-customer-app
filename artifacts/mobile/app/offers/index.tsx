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
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { OFFERS } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";

const ALL_OFFERS = [
  ...OFFERS,
  {
    id: "o4",
    title: "Electronics deal",
    subtitle: "₹100 off on electronics",
    code: "ELEC100",
    discount: "₹100 OFF",
    color: "#4A90E2",
    expiresAt: "Dec 28",
  },
  {
    id: "o5",
    title: "New user bonus",
    subtitle: "Extra 10% cashback",
    code: "NEWUSER10",
    discount: "10% CASHBACK",
    color: "#9B59B6",
    expiresAt: "Jan 15",
  },
  {
    id: "o6",
    title: "Weekend blowout",
    subtitle: "Free delivery all weekend",
    code: "WEEKEND",
    discount: "FREE DELIVERY",
    color: "#E67E22",
    expiresAt: "This weekend",
  },
];

const FILTER_TABS = ["All", "Active", "Groceries", "Pharmacy", "Electronics"];

export default function OffersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("All");
  const [copied, setCopied] = useState<string | null>(null);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const handleCopy = (code: string) => {
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BackHeader title="Offers & Coupons" />

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        style={styles.filterBar}
      >
        {FILTER_TABS.map((tab) => {
          const active = activeFilter === tab;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveFilter(tab)}
              style={[
                styles.filterPill,
                { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border },
              ]}
            >
              <Text style={[styles.filterText, { color: active ? colors.primaryForeground : colors.primary }]}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.list, { paddingBottom: botPad }]}
      >
        {/* Promo code input */}
        <Pressable
          style={[styles.promoInput, { backgroundColor: colors.card, borderColor: colors.accentOrange }, shadows.sm]}
          onPress={() => router.push("/promo" as any)}
        >
          <Feather name="tag" size={20} color={colors.accentOrange} />
          <Text style={[styles.promoPlaceholder, { color: colors.mutedForeground }]}>
            Enter coupon code...
          </Text>
          <View style={[styles.applyBtn, { backgroundColor: colors.accentOrange }]}>
            <Text style={styles.applyText}>Apply</Text>
          </View>
        </Pressable>

        <Text style={[styles.sectionLabel, { color: colors.primary }]}>
          {ALL_OFFERS.length} offers available
        </Text>

        {ALL_OFFERS.map((offer) => (
          <View
            key={offer.id}
            style={[styles.offerCard, { backgroundColor: colors.card }, shadows.sm]}
          >
            <View style={[styles.offerBanner, { backgroundColor: offer.color }]}>
              <Text style={styles.discountText}>{offer.discount}</Text>
              <Text style={styles.offerTitle}>{offer.title}</Text>
            </View>
            <View style={styles.offerBody}>
              <View>
                <Text style={[styles.offerSub, { color: colors.secondary }]}>{offer.subtitle}</Text>
                <View style={styles.codeRow}>
                  <View style={[styles.codeBadge, { borderColor: colors.border }]}>
                    <Text style={[styles.codeText, { color: colors.primary }]}>{offer.code}</Text>
                  </View>
                  <Text style={[styles.expires, { color: colors.mutedForeground }]}>
                    Expires {offer.expiresAt}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => handleCopy(offer.code)}
                style={[
                  styles.copyBtn,
                  { backgroundColor: copied === offer.code ? colors.accentGreen : colors.primary },
                ]}
              >
                <Feather
                  name={copied === offer.code ? "check" : "copy"}
                  size={14}
                  color="#FFF"
                />
                <Text style={styles.copyText}>
                  {copied === offer.code ? "Copied!" : "Copy"}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filterBar: { maxHeight: 56 },
  filterScroll: { paddingHorizontal: spacing.pagePadding, gap: 8, alignItems: "center" },
  filterPill: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1.5,
  },
  filterText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  list: { paddingHorizontal: spacing.pagePadding, gap: 14, paddingTop: 12 },
  promoInput: {
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  promoPlaceholder: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 15 },
  applyBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 7 },
  applyText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#FFF" },
  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 17, letterSpacing: -0.5 },
  offerCard: { borderRadius: 20, overflow: "hidden" },
  offerBanner: { padding: 20, gap: 4 },
  discountText: { fontFamily: "Inter_700Bold", fontSize: 13, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: 1 },
  offerTitle: { fontFamily: "Inter_700Bold", fontSize: 22, color: "#FFF", letterSpacing: -0.5 },
  offerBody: {
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
  },
  offerSub: { fontFamily: "Inter_400Regular", fontSize: 13, marginBottom: 10 },
  codeRow: { gap: 6 },
  codeBadge: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  codeText: { fontFamily: "Inter_700Bold", fontSize: 13, letterSpacing: 1.5 },
  expires: { fontFamily: "Inter_400Regular", fontSize: 11 },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  copyText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#FFF" },
});
