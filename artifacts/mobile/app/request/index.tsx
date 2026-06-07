import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const STEPS = ["Details", "Preferences", "Budget", "Review"];

const BUDGET_OPTIONS = ["Under ₹100", "₹100–₹500", "₹500–₹2000", "₹2000+", "No limit"];
const CATEGORIES = ["Groceries", "Pharmacy", "Electronics", "Personal Care", "Home & Kitchen", "Other"];

export default function RequestProductScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [brand, setBrand] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 32;

  const canNext = step === 0 ? productName.trim().length > 0 : true;

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 1500));
      router.replace("/order/success" as any);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Pressable onPress={() => (step > 0 ? setStep((s) => s - 1) : router.back())} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>Request Product</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Step Progress */}
      <View style={styles.progressWrap}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View
              style={[
                styles.stepDot,
                {
                  backgroundColor: i <= step ? colors.primary : colors.muted,
                  width: i === step ? 28 : 8,
                },
              ]}
            />
            {i < STEPS.length - 1 && (
              <View
                style={[
                  styles.stepLine,
                  { backgroundColor: i < step ? colors.primary : colors.muted },
                ]}
              />
            )}
          </View>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: botPad }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.stepLabel, { color: colors.mutedForeground }]}>
          Step {step + 1} of {STEPS.length}
        </Text>
        <Text style={[styles.stepTitle, { color: colors.primary }]}>
          {step === 0 && "What do you need?"}
          {step === 1 && "Any preferences?"}
          {step === 2 && "What's your budget?"}
          {step === 3 && "Review your request"}
        </Text>

        {step === 0 && (
          <View style={styles.fields}>
            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.secondary }]}>Product Name *</Text>
              <TextInput
                value={productName}
                onChangeText={setProductName}
                placeholder="e.g. Organic Whole Milk 500ml"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.inputField, { backgroundColor: colors.card, color: colors.primary }, shadows.sm]}
              />
            </View>
            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.secondary }]}>Description (optional)</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Add any details that help us find the right product"
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={3}
                style={[styles.inputField, styles.textarea, { backgroundColor: colors.card, color: colors.primary }, shadows.sm]}
              />
            </View>
            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.secondary }]}>Category</Text>
              <View style={styles.chips}>
                {CATEGORIES.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setCategory(c)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: category === c ? colors.primary : colors.card,
                      },
                      shadows.sm,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: category === c ? colors.primaryForeground : colors.primary },
                      ]}
                    >
                      {c}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}

        {step === 1 && (
          <View style={styles.fields}>
            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.secondary }]}>Quantity</Text>
              <View style={styles.quantityRow}>
                <Pressable
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={[styles.qBtn, { backgroundColor: colors.muted }]}
                >
                  <Feather name="minus" size={18} color={colors.primary} />
                </Pressable>
                <Text style={[styles.qValue, { color: colors.primary }]}>{quantity}</Text>
                <Pressable
                  onPress={() => setQuantity((q) => q + 1)}
                  style={[styles.qBtn, { backgroundColor: colors.primary }]}
                >
                  <Feather name="plus" size={18} color={colors.primaryForeground} />
                </Pressable>
              </View>
            </View>
            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.secondary }]}>Brand preference (optional)</Text>
              <TextInput
                value={brand}
                onChangeText={setBrand}
                placeholder="e.g. Amul, Samsung, etc."
                placeholderTextColor={colors.mutedForeground}
                style={[styles.inputField, { backgroundColor: colors.card, color: colors.primary }, shadows.sm]}
              />
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.fields}>
            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.secondary }]}>Budget range</Text>
              <View style={styles.budgetGrid}>
                {BUDGET_OPTIONS.map((b) => (
                  <Pressable
                    key={b}
                    onPress={() => setBudget(b)}
                    style={[
                      styles.budgetOpt,
                      {
                        backgroundColor: budget === b ? colors.primary : colors.card,
                        borderColor: budget === b ? colors.primary : colors.border,
                      },
                      shadows.sm,
                    ]}
                  >
                    <Text
                      style={[
                        styles.budgetText,
                        { color: budget === b ? colors.primaryForeground : colors.primary },
                      ]}
                    >
                      {b}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.secondary }]}>Special notes (optional)</Text>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Any specific instructions for our agent"
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={3}
                style={[styles.inputField, styles.textarea, { backgroundColor: colors.card, color: colors.primary }, shadows.sm]}
              />
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={[styles.reviewCard, { backgroundColor: colors.card }, shadows.card]}>
            {[
              { label: "Product", value: productName || "—" },
              { label: "Category", value: category || "Not specified" },
              { label: "Quantity", value: `${quantity}` },
              { label: "Brand", value: brand || "Any brand" },
              { label: "Budget", value: budget || "Not specified" },
              { label: "Notes", value: notes || "None" },
            ].map((row, i, arr) => (
              <View key={row.label}>
                {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
                  <Text style={[styles.reviewValue, { color: colors.primary }]}>{row.value}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: botPad - 16 }]}>
        <Button
          label={step === STEPS.length - 1 ? "Submit Request" : "Continue"}
          onPress={handleNext}
          disabled={!canNext}
          loading={submitting}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.pagePadding,
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { ...typography.bodySemiBold, fontSize: 17 },
  progressWrap: { flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.pagePadding, marginVertical: 16 },
  stepItem: { flex: 1, flexDirection: "row", alignItems: "center" },
  stepDot: { height: 8, borderRadius: 4 },
  stepLine: { flex: 1, height: 2, marginHorizontal: 4 },
  content: { paddingHorizontal: spacing.pagePadding, paddingTop: 8 },
  stepLabel: { ...typography.caption, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  stepTitle: { fontSize: 30, fontFamily: "Inter_700Bold", letterSpacing: -1, marginBottom: 28 },
  fields: { gap: 24 },
  field: { gap: 10 },
  fieldLabel: { ...typography.label },
  inputField: {
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  textarea: { minHeight: 88, textAlignVertical: "top" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10 },
  chipText: { fontFamily: "Inter_500Medium", fontSize: 14 },
  quantityRow: { flexDirection: "row", alignItems: "center", gap: 20 },
  qBtn: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  qValue: { fontSize: 28, fontFamily: "Inter_700Bold", minWidth: 40, textAlign: "center" },
  budgetGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  budgetOpt: {
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1.5,
  },
  budgetText: { fontFamily: "Inter_500Medium", fontSize: 14 },
  reviewCard: { borderRadius: 24, overflow: "hidden" },
  reviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    gap: 16,
  },
  reviewLabel: { ...typography.label, flex: 1 },
  reviewValue: { ...typography.bodyMedium, flex: 2, textAlign: "right" },
  divider: { height: 1, marginHorizontal: 16 },
  footer: { paddingHorizontal: spacing.pagePadding, paddingTop: 16 },
});
