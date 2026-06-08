import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

const OTP_LENGTH = 6;

export default function OTPScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const refs = useRef<(TextInput | null)[]>([]);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (val: string, idx: number) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[idx] = digit;
    setOtp(newOtp);
    if (digit && idx < OTP_LENGTH - 1) {
      refs.current[idx + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, idx: number) => {
    if (key === "Backspace" && !otp[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
      const newOtp = [...otp];
      newOtp[idx - 1] = "";
      setOtp(newOtp);
    }
  };

  const isComplete = otp.every((d) => d !== "");

  const handleVerify = async () => {
    if (!isComplete) return;
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 1200));
    router.replace({ pathname: "/(auth)/register", params: { phone: phone || "" } });
  };

  const maskedPhone = phone ? `+91 ${phone.slice(0, 5)} ${phone.slice(5)}` : "";

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.inner, { paddingTop: topPad + 24, paddingBottom: botPad + 32 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>

        <View style={styles.headline}>
          <Text style={[styles.title, { color: colors.primary }]}>
            {"Verify your\nnumber"}
          </Text>
          <Text style={[styles.sub, { color: colors.secondary }]}>
            Enter the 6-digit code sent to{"\n"}
            <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>
              {maskedPhone}
            </Text>
          </Text>
        </View>

        <View style={styles.otpRow}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={(r) => { refs.current[idx] = r; }}
              value={digit}
              onChangeText={(v) => handleChange(v, idx)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, idx)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              style={[
                styles.otpBox,
                {
                  backgroundColor: digit ? colors.primary : colors.card,
                  color: digit ? colors.primaryForeground : colors.primary,
                  borderColor: digit ? colors.primary : colors.border,
                },
                shadows.sm,
              ]}
            />
          ))}
        </View>

        <View style={styles.resendRow}>
          {resendTimer > 0 ? (
            <Text style={[styles.resendText, { color: colors.mutedForeground }]}>
              Resend code in{" "}
              <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>
                {resendTimer}s
              </Text>
            </Text>
          ) : (
            <Pressable onPress={() => setResendTimer(30)}>
              <Text style={[styles.resendText, { color: colors.accentOrange, fontFamily: "Inter_600SemiBold" }]}>
                Resend OTP
              </Text>
            </Pressable>
          )}
        </View>

        <Button
          label="Verify"
          onPress={handleVerify}
          disabled={!isComplete}
          loading={verifying}
          variant="primary"
        />

        <Text style={[styles.hint, { color: colors.mutedForeground }]}>
          Hint: Use any 6 digits to proceed
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: spacing.pagePadding, gap: 28 },
  backBtn: { width: 44, height: 44, alignItems: "flex-start", justifyContent: "center" },
  headline: { gap: 10 },
  title: { fontSize: 36, fontFamily: "Inter_700Bold", letterSpacing: -1.5, lineHeight: 42 },
  sub: { ...typography.body, lineHeight: 24 },
  otpRow: { flexDirection: "row", gap: 10, justifyContent: "space-between" },
  otpBox: {
    flex: 1, height: 60, borderRadius: 16,
    textAlign: "center", fontSize: 24,
    fontFamily: "Inter_700Bold", borderWidth: 1.5,
  },
  resendRow: { alignItems: "center" },
  resendText: { ...typography.bodyMedium },
  hint: { ...typography.small, textAlign: "center" },
});
