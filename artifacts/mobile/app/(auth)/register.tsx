import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const isValid = name.trim().length >= 2;

  const handleContinue = async () => {
    if (!isValid) return;
    setSaving(true);
    await login(phone ?? "", name.trim());
    router.replace("/(tabs)" as any);
  };

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1, backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: topPad + 24, paddingBottom: botPad }]}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>

        <View style={styles.headline}>
          <Text style={[styles.title, { color: colors.primary }]}>
            {"What's your\nname?"}
          </Text>
          <Text style={[styles.sub, { color: colors.secondary }]}>
            Let us know what to call you — you can change this anytime in your profile.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.secondary }]}>Full name *</Text>
            <View
              style={[
                styles.inputWrap,
                {
                  backgroundColor: colors.card,
                  borderColor: name.length > 0 ? colors.primary : colors.border,
                },
                shadows.sm,
              ]}
            >
              <Feather name="user" size={18} color={colors.mutedForeground} />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="words"
                autoFocus
                style={[styles.input, { color: colors.primary }]}
              />
              {name.length > 0 && (
                <Pressable onPress={() => setName("")}>
                  <Feather name="x-circle" size={16} color={colors.mutedForeground} />
                </Pressable>
              )}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.secondary }]}>
              Email{" "}
              <Text style={{ color: colors.mutedForeground }}>(optional)</Text>
            </Text>
            <View
              style={[
                styles.inputWrap,
                {
                  backgroundColor: colors.card,
                  borderColor: email.length > 0 ? colors.primary : colors.border,
                },
                shadows.sm,
              ]}
            >
              <Feather name="mail" size={18} color={colors.mutedForeground} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, { color: colors.primary }]}
              />
            </View>
          </View>

          <View style={[styles.phoneBadge, { backgroundColor: colors.muted }]}>
            <Feather name="phone" size={16} color={colors.accentGreen} />
            <Text style={[styles.phoneText, { color: colors.secondary }]}>
              +91 {phone} · Verified
            </Text>
            <Feather name="check-circle" size={14} color={colors.accentGreen} />
          </View>
        </View>

        <Button
          label="Let's go →"
          onPress={handleContinue}
          loading={saving}
          disabled={!isValid}
          variant="primary"
        />

        <Text style={[styles.terms, { color: colors.mutedForeground }]}>
          By signing up, you agree to our{" "}
          <Text
            style={{ color: colors.primary }}
            onPress={() => router.push("/profile/terms" as any)}
          >
            Terms
          </Text>{" "}
          and{" "}
          <Text
            style={{ color: colors.primary }}
            onPress={() => router.push("/profile/privacy" as any)}
          >
            Privacy Policy
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: spacing.pagePadding, gap: 32 },
  backBtn: { width: 44, height: 44, alignItems: "flex-start", justifyContent: "center" },
  headline: { gap: 10 },
  title: { fontSize: 36, fontFamily: "Inter_700Bold", letterSpacing: -1.5, lineHeight: 42 },
  sub: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 22 },
  form: { gap: 18 },
  field: { gap: 8 },
  fieldLabel: { fontFamily: "Inter_500Medium", fontSize: 13 },
  inputWrap: {
    flexDirection: "row", alignItems: "center",
    borderRadius: 18, padding: 14, gap: 10, borderWidth: 1.5,
  },
  input: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 16 },
  phoneBadge: {
    flexDirection: "row", alignItems: "center",
    gap: 8, borderRadius: 14, padding: 14,
  },
  phoneText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14 },
  terms: {
    fontFamily: "Inter_400Regular", fontSize: 12,
    textAlign: "center", lineHeight: 18,
  },
});
