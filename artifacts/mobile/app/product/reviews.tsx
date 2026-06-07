import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const ALL_REVIEWS = [
  { id: "r1", name: "Priya M.", rating: 5, text: "Excellent quality! Delivered in 12 minutes. Super fresh.", time: "2 days ago", verified: true },
  { id: "r2", name: "Arjun S.", rating: 4, text: "Good product, packaging was slightly damaged but contents fine.", time: "1 week ago", verified: true },
  { id: "r3", name: "Sneha P.", rating: 5, text: "Best quality I've found locally. Will definitely reorder.", time: "2 weeks ago", verified: true },
  { id: "r4", name: "Rohan K.", rating: 3, text: "Average quality. Expected better for the price.", time: "3 weeks ago", verified: false },
  { id: "r5", name: "Kavya R.", rating: 5, text: "Absolutely love this! Perfect freshness, delivered super fast.", time: "1 month ago", verified: true },
  { id: "r6", name: "Amit D.", rating: 4, text: "Good as always. Packaging could be improved.", time: "1 month ago", verified: true },
];

const RATING_DIST = [5, 4, 3, 2, 1];

export default function ProductReviewsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState(0);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const avgRating = (ALL_REVIEWS.reduce((a, r) => a + r.rating, 0) / ALL_REVIEWS.length).toFixed(1);
  const filtered = filter === 0 ? ALL_REVIEWS : ALL_REVIEWS.filter((r) => r.rating === filter);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BackHeader
        title="Reviews"
        right={
          <Pressable onPress={() => router.push("/product/write-review" as any)} hitSlop={8}>
            <Feather name="edit-2" size={20} color={colors.primary} />
          </Pressable>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {/* Summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.card }, shadows.card]}>
          <View style={styles.avgBlock}>
            <Text style={[styles.avgNum, { color: colors.primary }]}>{avgRating}</Text>
            <View style={styles.starsRow}>
              {[1,2,3,4,5].map((s) => (
                <Feather key={s} name="star" size={18} color={s <= Math.round(parseFloat(avgRating)) ? colors.accentOrange : colors.border} />
              ))}
            </View>
            <Text style={[styles.avgCount, { color: colors.mutedForeground }]}>{ALL_REVIEWS.length} reviews</Text>
          </View>
          <View style={styles.distBlock}>
            {RATING_DIST.map((r) => {
              const count = ALL_REVIEWS.filter((rv) => rv.rating === r).length;
              const pct = (count / ALL_REVIEWS.length) * 100;
              return (
                <View key={r} style={styles.distRow}>
                  <Text style={[styles.distNum, { color: colors.mutedForeground }]}>{r}</Text>
                  <Feather name="star" size={10} color={colors.accentOrange} />
                  <View style={[styles.distBar, { backgroundColor: colors.muted }]}>
                    <View style={[styles.distFill, { width: `${pct}%`, backgroundColor: colors.accentOrange }]} />
                  </View>
                  <Text style={[styles.distCount, { color: colors.mutedForeground }]}>{count}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {["All", "5★", "4★", "3★", "2★", "1★"].map((f, i) => {
            const active = filter === (i === 0 ? 0 : 6 - i);
            const val = i === 0 ? 0 : 6 - i;
            return (
              <Pressable key={f} onPress={() => setFilter(val)}
                style={[styles.filterPill, { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border }]}>
                <Text style={[styles.filterText, { color: active ? colors.primaryForeground : colors.primary }]}>{f}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Reviews list */}
        {filtered.map((review) => (
          <View key={review.id} style={[styles.reviewCard, { backgroundColor: colors.card }, shadows.sm]}>
            <View style={styles.reviewTop}>
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={[styles.avatarLetter, { color: colors.primaryForeground }]}>{review.name.charAt(0)}</Text>
              </View>
              <View style={styles.reviewMeta}>
                <View style={styles.reviewNameRow}>
                  <Text style={[styles.reviewName, { color: colors.primary }]}>{review.name}</Text>
                  {review.verified && (
                    <View style={[styles.verifiedBadge, { backgroundColor: colors.accentGreen + "18" }]}>
                      <Feather name="check-circle" size={11} color={colors.accentGreen} />
                      <Text style={[styles.verifiedText, { color: colors.accentGreen }]}>Verified</Text>
                    </View>
                  )}
                </View>
                <View style={styles.starsRow}>
                  {[1,2,3,4,5].map((s) => (
                    <Feather key={s} name="star" size={12} color={s <= review.rating ? colors.accentOrange : colors.border} />
                  ))}
                </View>
              </View>
              <Text style={[styles.reviewTime, { color: colors.mutedForeground }]}>{review.time}</Text>
            </View>
            <Text style={[styles.reviewText, { color: colors.secondary }]}>{review.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.pagePadding, gap: 14 },
  summaryCard: { borderRadius: 24, padding: 20, flexDirection: "row", gap: 20 },
  avgBlock: { alignItems: "center", gap: 4, minWidth: 90 },
  avgNum: { fontSize: 48, fontFamily: "Inter_700Bold", letterSpacing: -2 },
  starsRow: { flexDirection: "row", gap: 2 },
  avgCount: { fontFamily: "Inter_400Regular", fontSize: 12 },
  distBlock: { flex: 1, gap: 6, justifyContent: "center" },
  distRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  distNum: { fontFamily: "Inter_500Medium", fontSize: 12, minWidth: 8 },
  distBar: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  distFill: { height: "100%", borderRadius: 3 },
  distCount: { fontFamily: "Inter_400Regular", fontSize: 12, minWidth: 16, textAlign: "right" },
  filterRow: { gap: 8, paddingBottom: 4 },
  filterPill: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1.5 },
  filterText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  reviewCard: { borderRadius: 20, padding: 16, gap: 12 },
  reviewTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  avatar: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  avatarLetter: { fontFamily: "Inter_700Bold", fontSize: 16 },
  reviewMeta: { flex: 1, gap: 4 },
  reviewNameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  reviewName: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 3, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  verifiedText: { fontFamily: "Inter_500Medium", fontSize: 10 },
  reviewTime: { fontFamily: "Inter_400Regular", fontSize: 12 },
  reviewText: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 },
});
