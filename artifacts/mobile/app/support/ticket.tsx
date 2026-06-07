import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const CATEGORIES = ["Order issue", "Payment / refund", "Account", "Delivery", "Offers & rewards", "Other"];
const PRIORITIES = [
  { id: "low", label: "Low", color: "#34C759" },
  { id: "medium", label: "Medium", color: "#FF9A3D" },
  { id: "high", label: "High", color: "#FF4D4F" },
];

export default function CreateTicketScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const isValid = category && subject.trim().length > 5 && description.trim().length > 10;

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    router.replace("/support" as any);
  };

  return (
    <KeyboardAvoidingView style={[{ flex: 1, backgroundColor: colors.background }]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <BackHeader title="Create ticket" />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 80 }]}>

        {/* Category */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.primary }]}>Category</Text>
          <View style={styles.catGrid}>
            {CATEGORIES.map((c) => {
              const active = category === c;
              return (
                <Pressable key={c} onPress={() => setCategory(c)}
                  style={[styles.catChip, { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border }, shadows.sm]}>
                  <Text style={[styles.catText, { color: active ? colors.primaryForeground : colors.primary }]}>{c}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Priority */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.primary }]}>Priority</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map((p) => {
              const active = priority === p.id;
              return (
                <Pressable key={p.id} onPress={() => setPriority(p.id)}
                  style={[styles.priorityBtn, { backgroundColor: active ? p.color : colors.card, borderColor: active ? p.color : colors.border }, shadows.sm]}>
                  <Text style={[styles.priorityText, { color: active ? "#FFF" : colors.primary }]}>{p.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Subject */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.primary }]}>Subject</Text>
          <TextInput value={subject} onChangeText={setSubject} placeholder="Brief description of the issue"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { backgroundColor: colors.card, color: colors.primary, borderColor: colors.border }]} />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.primary }]}>Description</Text>
          <TextInput value={description} onChangeText={setDescription}
            placeholder="Provide as much detail as possible so we can resolve this quickly..."
            placeholderTextColor={colors.mutedForeground} multiline numberOfLines={6}
            style={[styles.textarea, { backgroundColor: colors.card, color: colors.primary, borderColor: colors.border }]} />
        </View>

        {/* Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.accentBlue + "12" }]}>
          <Feather name="info" size={16} color={colors.accentBlue} />
          <Text style={[styles.infoText, { color: colors.secondary }]}>
            Average response time: &lt;2 hours. For urgent issues use live chat.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <Button label="Submit ticket" onPress={handleSubmit} loading={submitting} disabled={!isValid} variant="primary" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 22 },
  section: { gap: 10 },
  label: { fontFamily: "Inter_700Bold", fontSize: 16, letterSpacing: -0.3 },
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catChip: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1.5 },
  catText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  priorityRow: { flexDirection: "row", gap: 10 },
  priorityBtn: { flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: "center", borderWidth: 1.5 },
  priorityText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  input: { borderRadius: 14, padding: 14, fontFamily: "Inter_400Regular", fontSize: 15, borderWidth: 1 },
  textarea: { borderRadius: 14, padding: 14, fontFamily: "Inter_400Regular", fontSize: 14, minHeight: 110, textAlignVertical: "top", borderWidth: 1 },
  infoCard: { borderRadius: 14, padding: 14, flexDirection: "row", gap: 10, alignItems: "flex-start" },
  infoText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
  footer: { paddingHorizontal: spacing.pagePadding, paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
});
