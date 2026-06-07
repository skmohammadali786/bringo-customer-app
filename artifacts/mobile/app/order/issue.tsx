import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const ISSUE_TYPES = [
  { id: "missing", label: "Item missing", icon: "package" as const },
  { id: "damaged", label: "Item damaged", icon: "alert-triangle" as const },
  { id: "wrong", label: "Wrong item", icon: "x-circle" as const },
  { id: "quality", label: "Quality issue", icon: "thumbs-down" as const },
  { id: "late", label: "Very late delivery", icon: "clock" as const },
  { id: "other", label: "Other", icon: "more-horizontal" as const },
];

export default function ReportIssueScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    router.back();
  };

  return (
    <KeyboardAvoidingView style={[{ flex: 1, backgroundColor: colors.background }]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <BackHeader title="Report an issue" />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 80 }]}>

        <View style={[styles.orderBadge, { backgroundColor: colors.card }, shadows.sm]}>
          <Feather name="package" size={18} color={colors.accentOrange} />
          <Text style={[styles.orderText, { color: colors.primary }]}>Order #ORD9A2F</Text>
          <View style={[styles.dateBadge, { backgroundColor: colors.muted }]}>
            <Text style={[styles.dateText, { color: colors.secondary }]}>Today</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>What's the issue?</Text>
          <View style={styles.issueGrid}>
            {ISSUE_TYPES.map((issue) => {
              const active = issueType === issue.id;
              return (
                <Pressable key={issue.id} onPress={() => setIssueType(issue.id)}
                  style={[styles.issueCard, { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border }, shadows.sm]}>
                  <Feather name={issue.icon} size={20} color={active ? colors.primaryForeground : colors.secondary} />
                  <Text style={[styles.issueLabel, { color: active ? colors.primaryForeground : colors.primary }]}>{issue.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>Tell us more</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the issue in detail so we can help you better..."
            placeholderTextColor={colors.mutedForeground}
            multiline numberOfLines={5}
            style={[styles.textarea, { backgroundColor: colors.card, color: colors.primary }, shadows.sm]}
          />
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.accentBlue + "12" }]}>
          <Feather name="info" size={16} color={colors.accentBlue} />
          <Text style={[styles.infoText, { color: colors.secondary }]}>
            Our support team will review your complaint within 2 hours and issue a refund if applicable.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <Button label="Submit complaint" onPress={handleSubmit} loading={submitting} disabled={!issueType} variant="primary" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 24 },
  orderBadge: { borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  orderText: { flex: 1, fontFamily: "Inter_600SemiBold", fontSize: 15 },
  dateBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  dateText: { fontFamily: "Inter_400Regular", fontSize: 12 },
  section: { gap: 12 },
  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5 },
  issueGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  issueCard: { width: "47%", borderRadius: 16, padding: 16, gap: 8, borderWidth: 1.5, alignItems: "flex-start" },
  issueLabel: { fontFamily: "Inter_500Medium", fontSize: 13 },
  textarea: { borderRadius: 16, padding: 14, fontFamily: "Inter_400Regular", fontSize: 14, minHeight: 100, textAlignVertical: "top" },
  infoCard: { borderRadius: 14, padding: 14, flexDirection: "row", gap: 10, alignItems: "flex-start" },
  infoText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
  footer: { paddingHorizontal: spacing.pagePadding, paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
});
