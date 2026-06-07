import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const ASPECTS = ["Quality", "Speed", "Packaging", "Value", "Freshness"];

export default function WriteReviewScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);
  const [selectedAspects, setSelectedAspects] = useState<string[]>([]);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const toggleAspect = (a: string) => setSelectedAspects((p) => p.includes(a) ? p.filter((x) => x !== a) : [...p, a]);

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    router.back();
  };

  const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  return (
    <KeyboardAvoidingView style={[{ flex: 1, backgroundColor: colors.background }]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <BackHeader title="Write a review" />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 80 }]}>
        {/* Stars */}
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.card]}>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>Overall rating</Text>
          <View style={styles.starsRow}>
            {[1,2,3,4,5].map((s) => (
              <Pressable key={s} onPress={() => setRating(s)} hitSlop={8}>
                <Feather name="star" size={44} color={s <= rating ? colors.accentOrange : colors.border} />
              </Pressable>
            ))}
          </View>
          {rating > 0 && <Text style={[styles.ratingLabel, { color: colors.accentOrange }]}>{ratingLabels[rating]}</Text>}
        </View>

        {/* Aspects */}
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>What stood out?</Text>
          <View style={styles.aspectsWrap}>
            {ASPECTS.map((a) => {
              const sel = selectedAspects.includes(a);
              return (
                <Pressable key={a} onPress={() => toggleAspect(a)}
                  style={[styles.aspectPill, { backgroundColor: sel ? colors.primary : colors.muted }]}>
                  <Text style={[styles.aspectText, { color: sel ? colors.primaryForeground : colors.primary }]}>{a}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Text */}
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>Your review</Text>
          <TextInput
            value={review}
            onChangeText={setReview}
            placeholder="Share your experience with this product..."
            placeholderTextColor={colors.mutedForeground}
            multiline numberOfLines={5}
            style={[styles.textInput, { backgroundColor: colors.muted, color: colors.primary }]}
          />
          <Text style={[styles.charCount, { color: colors.mutedForeground }]}>{review.length}/500</Text>
        </View>
      </ScrollView>
      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <Button label="Submit review" onPress={handleSubmit} loading={submitting} disabled={rating === 0} variant="primary" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 14 },
  card: { borderRadius: 24, padding: 20, gap: 16, alignItems: "center" },
  cardTitle: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5, alignSelf: "flex-start" },
  starsRow: { flexDirection: "row", gap: 8 },
  ratingLabel: { fontFamily: "Inter_700Bold", fontSize: 16 },
  aspectsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignSelf: "stretch" },
  aspectPill: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9 },
  aspectText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  textInput: { alignSelf: "stretch", borderRadius: 14, padding: 14, fontFamily: "Inter_400Regular", fontSize: 14, minHeight: 100, textAlignVertical: "top" },
  charCount: { alignSelf: "flex-end", fontFamily: "Inter_400Regular", fontSize: 12 },
  footer: { paddingHorizontal: spacing.pagePadding, paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
});
