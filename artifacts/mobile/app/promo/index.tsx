import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const RECENT_CODES = ["NEWUSER10", "BRINGO50", "WEEKEND"];
const VALID_CODES: Record<string, { label: string; saving: string }> = {
  "NEWUSER10": { label: "10% off your order", saving: "₹18" },
  "BRINGO50": { label: "₹50 off on orders above ₹299", saving: "₹50" },
  "WEEKEND": { label: "Free delivery this weekend", saving: "₹29" },
};

export default function PromoScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [validInfo, setValidInfo] = useState<{ label: string; saving: string } | null>(null);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const checkCode = async () => {
    if (!code.trim()) return;
    setState("checking");
    await new Promise((r) => setTimeout(r, 800));
    const info = VALID_CODES[code.toUpperCase().trim()];
    if (info) { setState("valid"); setValidInfo(info); }
    else { setState("invalid"); setValidInfo(null); }
  };

  const applyCode = () => router.back();

  const inputBorderColor = state === "valid" ? colors.accentGreen : state === "invalid" ? colors.danger : code ? colors.primary : colors.border;

  return (
    <KeyboardAvoidingView style={[{ flex: 1, backgroundColor: colors.background }]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <BackHeader title="Promo code" />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 80 }]}>
        {/* Input */}
        <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: inputBorderColor }, shadows.sm]}>
          <Feather name="tag" size={20} color={colors.mutedForeground} />
          <TextInput value={code} onChangeText={(v) => { setCode(v.toUpperCase()); setState("idle"); }}
            placeholder="Enter code (e.g. BRINGO50)"
            placeholderTextColor={colors.mutedForeground} autoCapitalize="characters" autoCorrect={false}
            style={[styles.input, { color: colors.primary }]} />
          {code.length > 0 && (
            <Pressable onPress={() => { setCode(""); setState("idle"); }}>
              <Feather name="x" size={18} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        {/* Status */}
        {state === "valid" && validInfo && (
          <View style={[styles.successCard, { backgroundColor: colors.accentGreen + "15", borderColor: colors.accentGreen }]}>
            <Feather name="check-circle" size={20} color={colors.accentGreen} />
            <View>
              <Text style={[styles.successLabel, { color: colors.primary }]}>{validInfo.label}</Text>
              <Text style={[styles.successSaving, { color: colors.accentGreen }]}>You save {validInfo.saving}</Text>
            </View>
          </View>
        )}
        {state === "invalid" && (
          <View style={[styles.errorCard, { backgroundColor: colors.danger + "15", borderColor: colors.danger }]}>
            <Feather name="x-circle" size={20} color={colors.danger} />
            <Text style={[styles.errorText, { color: colors.danger }]}>Invalid or expired code</Text>
          </View>
        )}

        {/* Recent codes */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Recently used</Text>
        {RECENT_CODES.map((c) => (
          <Pressable key={c} onPress={() => { setCode(c); setState("idle"); }}
            style={[styles.recentRow, { backgroundColor: colors.card }, shadows.sm]}>
            <View style={[styles.codeBox, { borderColor: colors.border }]}>
              <Text style={[styles.codeText, { color: colors.primary }]}>{c}</Text>
            </View>
            <Text style={[styles.codeDesc, { color: colors.secondary }]}>{VALID_CODES[c]?.label ?? "Promotional code"}</Text>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
        ))}

        {/* View all offers */}
        <Pressable style={[styles.allOffersBtn, { backgroundColor: colors.muted }]}
          onPress={() => router.push("/offers" as any)}>
          <Text style={[styles.allOffersText, { color: colors.primary }]}>Browse all offers</Text>
          <Feather name="chevron-right" size={16} color={colors.primary} />
        </Pressable>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        {state === "valid" ? (
          <Button label="Apply code" onPress={applyCode} variant="primary" />
        ) : (
          <Button label="Check code" onPress={checkCode} loading={state === "checking"} disabled={!code.trim()} variant="primary" />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 16 },
  inputCard: { borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 10, borderWidth: 2 },
  input: { flex: 1, fontFamily: "Inter_600SemiBold", fontSize: 16, letterSpacing: 1 },
  successCard: { borderRadius: 14, padding: 14, flexDirection: "row", gap: 10, alignItems: "center", borderWidth: 1.5 },
  successLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  successSaving: { fontFamily: "Inter_700Bold", fontSize: 13 },
  errorCard: { borderRadius: 14, padding: 14, flexDirection: "row", gap: 10, alignItems: "center", borderWidth: 1.5 },
  errorText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 17, letterSpacing: -0.5 },
  recentRow: { borderRadius: 16, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  codeBox: { borderRadius: 8, borderWidth: 1, borderStyle: "dashed", paddingHorizontal: 10, paddingVertical: 4 },
  codeText: { fontFamily: "Inter_700Bold", fontSize: 12, letterSpacing: 1 },
  codeDesc: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 13 },
  allOffersBtn: { borderRadius: 14, padding: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  allOffersText: { fontFamily: "Inter_500Medium", fontSize: 14 },
  footer: { paddingHorizontal: spacing.pagePadding, paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
});
