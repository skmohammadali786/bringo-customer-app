import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

export default function PersonalInfoScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 32;

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    updateUser({ name });
    setSaving(false);
    router.back();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.inner, { paddingTop: topPad + 16, paddingBottom: botPad }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.primary }]}>Personal Information</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.avatarWrap}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarLetter, { color: colors.primaryForeground }]}>
            {name.charAt(0).toUpperCase() || "U"}
          </Text>
        </View>
        <Pressable style={[styles.editAvatarBtn, { backgroundColor: colors.accentOrange }]}>
          <Feather name="camera" size={14} color="#FFF" />
        </Pressable>
      </View>

      <View style={styles.fields}>
        {[
          { label: "Full Name", value: name, onChange: setName, type: "default" as const },
          { label: "Phone Number", value: `+91 ${user?.phone ?? ""}`, onChange: () => {}, type: "phone-pad" as const },
        ].map((field) => (
          <View key={field.label} style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.secondary }]}>{field.label}</Text>
            <View style={[styles.fieldInput, { backgroundColor: colors.card }, shadows.sm]}>
              <TextInput
                value={field.value}
                onChangeText={field.onChange}
                keyboardType={field.type}
                editable={field.label === "Full Name"}
                style={[styles.input, { color: colors.primary, opacity: field.label === "Full Name" ? 1 : 0.5 }]}
                placeholderTextColor={colors.mutedForeground}
              />
            </View>
          </View>
        ))}
      </View>

      <Button label="Save Changes" onPress={save} loading={saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { paddingHorizontal: spacing.pagePadding, gap: 28 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { ...typography.h3 },
  avatarWrap: { alignItems: "center", position: "relative" },
  avatar: { width: 88, height: 88, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  avatarLetter: { fontSize: 44, fontFamily: "Inter_700Bold" },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: "36%",
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  fields: { gap: 16 },
  fieldGroup: { gap: 8 },
  fieldLabel: { ...typography.label },
  fieldInput: { borderRadius: 16, padding: 16 },
  input: { fontSize: 16, fontFamily: "Inter_400Regular" },
});
