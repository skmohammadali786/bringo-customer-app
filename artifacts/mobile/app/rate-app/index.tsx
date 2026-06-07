import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

export default function RateAppScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 32;

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <View style={[{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ fontSize: 72 }}>🙏</Text>
        <Text style={[{ fontFamily: "Inter_700Bold", fontSize: 26, letterSpacing: -1, color: colors.primary, marginTop: 16, textAlign: "center" }]}>
          Thank you!
        </Text>
        <Text style={[{ fontFamily: "Inter_400Regular", fontSize: 15, color: colors.secondary, textAlign: "center", marginTop: 8 }]}>
          Your feedback helps us improve Bringo for everyone.
        </Text>
        <Button label="Back to app" onPress={() => router.back()} variant="primary" style={{ marginTop: 32, width: 200 }} />
      </View>
    );
  }

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Rate Bringo" />
      <View style={[styles.content, { paddingBottom: botPad }]}>
        {/* App icon */}
        <View style={styles.iconWrap}>
          <View style={[styles.appIcon, { backgroundColor: colors.primary }, shadows.lg]}>
            <Text style={styles.appLetter}>B</Text>
          </View>
          <Text style={[styles.appName, { color: colors.primary }]}>Bringo</Text>
          <Text style={[styles.appVersion, { color: colors.mutedForeground }]}>Version 1.0.0</Text>
        </View>

        {/* Stars */}
        <View style={styles.starsSection}>
          <Text style={[styles.starsLabel, { color: colors.primary }]}>How would you rate us?</Text>
          <View style={styles.starsRow}>
            {[1,2,3,4,5].map((s) => (
              <Pressable key={s} onPress={() => setRating(s)} hitSlop={12}>
                <Feather name="star" size={52} color={s <= rating ? colors.accentOrange : colors.border} />
              </Pressable>
            ))}
          </View>
          {rating > 0 && (
            <Text style={[styles.ratingLabel, { color: colors.accentOrange }]}>
              {["", "Poor", "Fair", "Good", "Great", "Excellent!"][rating]}
            </Text>
          )}
        </View>

        {/* Review */}
        <TextInput
          value={review}
          onChangeText={setReview}
          placeholder="Tell us what you love or what we can improve..."
          placeholderTextColor={colors.mutedForeground}
          multiline numberOfLines={4}
          style={[styles.reviewInput, { backgroundColor: colors.card, color: colors.primary }, shadows.sm]}
        />

        <Button
          label={rating >= 4 ? "Rate on App Store" : "Submit feedback"}
          onPress={handleSubmit}
          disabled={rating === 0}
          variant="primary"
        />

        <Pressable onPress={() => router.back()}>
          <Text style={[styles.skip, { color: colors.mutedForeground }]}>Not now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: spacing.pagePadding, gap: 24, alignItems: "center" },
  iconWrap: { alignItems: "center", gap: 8, marginTop: 8 },
  appIcon: { width: 80, height: 80, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  appLetter: { fontFamily: "Inter_700Bold", fontSize: 44, color: "#FFF" },
  appName: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: -0.5 },
  appVersion: { fontFamily: "Inter_400Regular", fontSize: 13 },
  starsSection: { alignItems: "center", gap: 14 },
  starsLabel: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: -0.5 },
  starsRow: { flexDirection: "row", gap: 8 },
  ratingLabel: { fontFamily: "Inter_700Bold", fontSize: 18 },
  reviewInput: { alignSelf: "stretch", borderRadius: 18, padding: 16, fontFamily: "Inter_400Regular", fontSize: 14, minHeight: 100, textAlignVertical: "top" },
  skip: { fontFamily: "Inter_400Regular", fontSize: 14 },
});
