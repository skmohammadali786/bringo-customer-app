import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

export default function DeleteAccountScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const [confirm, setConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const isValid = confirm.trim().toLowerCase() === "delete";

  const handleDelete = async () => {
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 1500));
    logout();
    router.replace("/(auth)/welcome" as any);
  };

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Delete account" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad + 80 }]}>
        {/* Warning */}
        <View style={[styles.warningCard, { backgroundColor: colors.danger + "10", borderColor: colors.danger + "40" }]}>
          <Feather name="alert-triangle" size={28} color={colors.danger} />
          <Text style={[styles.warningTitle, { color: colors.primary }]}>This action is permanent</Text>
          <Text style={[styles.warningText, { color: colors.secondary }]}>
            Deleting your account will permanently remove all your data, order history, wallet balance, and rewards. This cannot be undone.
          </Text>
        </View>

        {/* What gets deleted */}
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>What will be deleted</Text>
          {[
            "All personal information",
            "Order history and receipts",
            "Bringo Wallet balance (₹1,250)",
            "Rewards points (450 pts)",
            "Saved addresses",
            "Payment methods",
          ].map((item) => (
            <View key={item} style={styles.deleteItem}>
              <Feather name="x-circle" size={14} color={colors.danger} />
              <Text style={[styles.deleteItemText, { color: colors.secondary }]}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Alternatives */}
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
          <Text style={[styles.cardTitle, { color: colors.primary }]}>Before you go...</Text>
          <Pressable style={[styles.altBtn, { backgroundColor: colors.muted }]}
            onPress={() => router.push("/support/chat" as any)}>
            <Feather name="message-circle" size={18} color={colors.accentBlue} />
            <Text style={[styles.altText, { color: colors.primary }]}>Talk to support — we can help</Text>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
          <Pressable style={[styles.altBtn, { backgroundColor: colors.muted }]}
            onPress={() => router.push("/profile/privacy" as any)}>
            <Feather name="shield" size={18} color={colors.accentGreen} />
            <Text style={[styles.altText, { color: colors.primary }]}>Adjust privacy settings instead</Text>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {/* Confirmation */}
        <View style={styles.confirmSection}>
          <Text style={[styles.confirmLabel, { color: colors.primary }]}>
            Type <Text style={{ fontFamily: "Inter_700Bold" }}>delete</Text> to confirm
          </Text>
          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            placeholder="delete"
            placeholderTextColor={colors.border}
            autoCapitalize="none"
            style={[styles.confirmInput, { backgroundColor: colors.card, color: colors.primary, borderColor: isValid ? colors.danger : colors.border }, shadows.sm]}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <Button label="Cancel" onPress={() => router.back()} variant="ghost" style={styles.cancelBtn} />
        <Button label="Delete my account" onPress={handleDelete} loading={deleting} disabled={!isValid}
          variant="danger" style={styles.deleteBtn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 16 },
  warningCard: { borderRadius: 20, padding: 22, gap: 10, alignItems: "center", borderWidth: 1.5 },
  warningTitle: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: -0.5, textAlign: "center" },
  warningText: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20, textAlign: "center" },
  card: { borderRadius: 20, padding: 18, gap: 10 },
  cardTitle: { fontFamily: "Inter_700Bold", fontSize: 16, letterSpacing: -0.3, marginBottom: 4 },
  deleteItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  deleteItemText: { fontFamily: "Inter_400Regular", fontSize: 14 },
  altBtn: { borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  altText: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 14 },
  confirmSection: { gap: 8 },
  confirmLabel: { fontFamily: "Inter_400Regular", fontSize: 14 },
  confirmInput: { borderRadius: 14, padding: 14, fontFamily: "Inter_400Regular", fontSize: 16, borderWidth: 2 },
  footer: { paddingHorizontal: spacing.pagePadding, paddingTop: 14, flexDirection: "row", gap: 10, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
  cancelBtn: { flex: 1 },
  deleteBtn: { flex: 1 },
});
