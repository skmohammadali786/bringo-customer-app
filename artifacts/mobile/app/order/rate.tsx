import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const QUICK_TAGS = ["Fast delivery", "Friendly agent", "Items as described", "Great packaging", "Would reorder"];

export default function RateOrderScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [orderRating, setOrderRating] = useState(0);
  const [agentRating, setAgentRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BackHeader title="Rate your experience" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 80 }]}
      >
        {/* Agent Card */}
        <View style={[styles.agentCard, { backgroundColor: colors.card }, shadows.card]}>
          <View style={[styles.agentAvatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.agentInitial, { color: colors.primaryForeground }]}>R</Text>
          </View>
          <View style={styles.agentInfo}>
            <Text style={[styles.agentName, { color: colors.primary }]}>Rahul K.</Text>
            <Text style={[styles.agentSub, { color: colors.mutedForeground }]}>Your delivery agent</Text>
          </View>
          <View style={[styles.completedBadge, { backgroundColor: colors.accentGreen + "18" }]}>
            <Feather name="check-circle" size={14} color={colors.accentGreen} />
            <Text style={[styles.completedText, { color: colors.accentGreen }]}>Delivered</Text>
          </View>
        </View>

        {/* Order Rating */}
        <View style={[styles.ratingCard, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.ratingTitle, { color: colors.primary }]}>How was your order?</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setOrderRating(star)} hitSlop={8}>
                <Feather
                  name="star"
                  size={40}
                  color={star <= orderRating ? colors.accentOrange : colors.border}
                />
              </Pressable>
            ))}
          </View>
          <Text style={[styles.ratingLabel, { color: colors.mutedForeground }]}>
            {orderRating === 0 ? "Tap a star" : orderRating >= 4 ? "Great!" : orderRating >= 3 ? "Okay" : "Poor"}
          </Text>
        </View>

        {/* Agent Rating */}
        <View style={[styles.ratingCard, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.ratingTitle, { color: colors.primary }]}>Rate your agent</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setAgentRating(star)} hitSlop={8}>
                <Feather
                  name="star"
                  size={40}
                  color={star <= agentRating ? colors.accentOrange : colors.border}
                />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Quick Tags */}
        <View style={[styles.ratingCard, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.ratingTitle, { color: colors.primary }]}>What went well?</Text>
          <View style={styles.tagsWrap}>
            {QUICK_TAGS.map((tag) => {
              const selected = selectedTags.includes(tag);
              return (
                <Pressable
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: selected ? colors.primary : colors.muted,
                      borderColor: selected ? colors.primary : "transparent",
                    },
                  ]}
                >
                  <Text style={[styles.tagText, { color: selected ? colors.primaryForeground : colors.primary }]}>
                    {tag}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Written Review */}
        <View style={[styles.ratingCard, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.ratingTitle, { color: colors.primary }]}>Leave a comment</Text>
          <TextInput
            value={review}
            onChangeText={setReview}
            placeholder="Tell us more about your experience..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={4}
            style={[
              styles.reviewInput,
              { backgroundColor: colors.muted, color: colors.primary },
            ]}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <Button
          label="Submit Review"
          onPress={handleSubmit}
          loading={submitting}
          disabled={orderRating === 0}
          variant="primary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.pagePadding, gap: 14 },
  agentCard: {
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  agentAvatar: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  agentInitial: { fontFamily: "Inter_700Bold", fontSize: 24 },
  agentInfo: { flex: 1, gap: 2 },
  agentName: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5 },
  agentSub: { fontFamily: "Inter_400Regular", fontSize: 13 },
  completedBadge: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  completedText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  ratingCard: { borderRadius: 20, padding: 20, gap: 14, alignItems: "center" },
  ratingTitle: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5, alignSelf: "flex-start" },
  starsRow: { flexDirection: "row", gap: 8 },
  ratingLabel: { fontFamily: "Inter_400Regular", fontSize: 14 },
  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignSelf: "stretch" },
  tag: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9, borderWidth: 1.5 },
  tagText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  reviewInput: {
    alignSelf: "stretch",
    borderRadius: 14,
    padding: 14,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    minHeight: 90,
    textAlignVertical: "top",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.pagePadding,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
});
