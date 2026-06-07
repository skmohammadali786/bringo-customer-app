import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const EMOJI_RATINGS = [
  { emoji: "😤", label: "Terrible", value: 1 },
  { emoji: "😕", label: "Bad", value: 2 },
  { emoji: "😐", label: "Okay", value: 3 },
  { emoji: "😊", label: "Good", value: 4 },
  { emoji: "🤩", label: "Amazing!", value: 5 },
];

const CATEGORIES = ["App experience", "Delivery speed", "Product quality", "Customer support", "Pricing", "Other"];

export default function FeedbackScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    router.back();
  };

  return (
    <KeyboardAvoidingView style={[{ flex: 1, backgroundColor: colors.background }]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <BackHeader title="Give feedback" />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 80 }]}>
        {/* Emoji rating */}
        <View style={[styles.ratingCard, { backgroundColor: colors.card }, shadows.card]}>
          <Text style={[styles.ratingQuestion, { color: colors.primary }]}>How's your Bringo experience?</Text>
          <View style={styles.emojiRow}>
            {EMOJI_RATINGS.map((r) => (
              <Pressable key={r.value} onPress={() => setRating(r.value)} style={styles.emojiBtn}>
                <Text style={[styles.emoji, rating === r.value ? styles.emojiSelected : {}]}>{r.emoji}</Text>
                {rating === r.value && (
                  <Text style={[styles.emojiLabel, { color: colors.primary }]}>{r.label}</Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>What's it about?</Text>
          <View style={styles.catGrid}>
            {CATEGORIES.map((c) => {
              const active = category === c;
              return (
                <Pressable key={c} onPress={() => setCategory(c)}
                  style={[styles.catChip, { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border }]}>
                  <Text style={[styles.catText, { color: active ? colors.primaryForeground : colors.primary }]}>{c}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Text */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Tell us more</Text>
          <TextInput
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Share your thoughts, suggestions, or report a bug..."
            placeholderTextColor={colors.mutedForeground}
            multiline numberOfLines={5}
            style={[styles.textarea, { backgroundColor: colors.card, color: colors.primary }, shadows.sm]}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <Button label="Submit feedback" onPress={handleSubmit} loading={submitting}
          disabled={rating === 0} variant="primary" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 24 },
  ratingCard: { borderRadius: 24, padding: 24, gap: 20, alignItems: "center" },
  ratingQuestion: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: -0.5, textAlign: "center" },
  emojiRow: { flexDirection: "row", gap: 8 },
  emojiBtn: { alignItems: "center", gap: 4, flex: 1 },
  emoji: { fontSize: 36 },
  emojiSelected: { fontSize: 44 },
  emojiLabel: { fontFamily: "Inter_600SemiBold", fontSize: 11, textAlign: "center" },
  section: { gap: 12 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 17, letterSpacing: -0.4 },
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catChip: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1.5 },
  catText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  textarea: { borderRadius: 16, padding: 14, fontFamily: "Inter_400Regular", fontSize: 14, minHeight: 100, textAlignVertical: "top" },
  footer: { paddingHorizontal: spacing.pagePadding, paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
});
