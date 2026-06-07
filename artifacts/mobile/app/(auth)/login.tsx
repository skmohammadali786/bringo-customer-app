import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
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

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0);

  const isValid = phone.replace(/\D/g, "").length === 10;

  const handleSendOTP = () => {
    if (!isValid) return;
    router.push({ pathname: "/(auth)/otp", params: { phone } });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={[
          styles.inner,
          { paddingTop: topPad + 24, paddingBottom: botPad + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>

        <View style={styles.headline}>
          <Text style={[styles.title, { color: colors.primary }]}>
            {"What's your\nphone number?"}
          </Text>
          <Text style={[styles.sub, { color: colors.secondary }]}>
            We'll send a one-time code to verify your number.
          </Text>
        </View>

        <Pressable
          style={[
            styles.inputCard,
            {
              backgroundColor: colors.card,
              borderColor: focused ? colors.primary : "transparent",
              borderWidth: focused ? 2 : 0,
            },
            shadows.card,
          ]}
          onPress={() => inputRef.current?.focus()}
        >
          <View style={[styles.prefix, { backgroundColor: colors.muted }]}>
            <Text style={[styles.prefixText, { color: colors.primary }]}>+91</Text>
          </View>
          <TextInput
            ref={inputRef}
            value={phone}
            onChangeText={(t) => setPhone(t.replace(/\D/g, "").slice(0, 10))}
            placeholder="Enter phone number"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="number-pad"
            style={[styles.input, { color: colors.primary, fontFamily: "Inter_500Medium" }]}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {phone.length > 0 && (
            <Pressable onPress={() => setPhone("")}>
              <Feather name="x-circle" size={18} color={colors.mutedForeground} />
            </Pressable>
          )}
        </Pressable>

        <View style={styles.actions}>
          <Button
            label="Send OTP"
            onPress={handleSendOTP}
            disabled={!isValid}
            variant="primary"
          />
          <Text style={[styles.terms, { color: colors.mutedForeground }]}>
            By continuing you agree to our{" "}
            <Text style={{ color: colors.primary, fontFamily: "Inter_500Medium" }}>
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text style={{ color: colors.primary, fontFamily: "Inter_500Medium" }}>
              Privacy Policy
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flexGrow: 1, paddingHorizontal: spacing.pagePadding, gap: 32 },
  backBtn: { width: 44, height: 44, alignItems: "flex-start", justifyContent: "center" },
  headline: { gap: 10 },
  title: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  sub: { ...typography.body },
  inputCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 14,
    gap: 12,
  },
  prefix: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  prefixText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  input: { flex: 1, fontSize: 20, letterSpacing: 1 },
  actions: { gap: 16 },
  terms: { ...typography.small, textAlign: "center", lineHeight: 18 },
});
