import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const ADDRESS_TYPES = [
  { id: "home", label: "Home", icon: "home" as const },
  { id: "work", label: "Work", icon: "briefcase" as const },
  { id: "other", label: "Other", icon: "map-pin" as const },
];

export default function EditAddressScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [addressType, setAddressType] = useState("home");
  const [flat, setFlat] = useState("Flat 4B");
  const [building, setBuilding] = useState("Sunrise Apartments");
  const [area, setArea] = useState("Koramangala 5th Block");
  const [city, setCity] = useState("Bengaluru");
  const [pincode, setPincode] = useState("560095");
  const [saving, setSaving] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const isValid = flat.trim() && area.trim() && pincode.length === 6;

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    router.back();
  };

  return (
    <KeyboardAvoidingView style={[{ flex: 1, backgroundColor: colors.background }]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <BackHeader title="Edit address" />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 80 }]}>
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.primary }]}>Address type</Text>
          <View style={styles.typeRow}>
            {ADDRESS_TYPES.map((type) => {
              const active = addressType === type.id;
              return (
                <Pressable key={type.id} onPress={() => setAddressType(type.id)}
                  style={[styles.typeBtn, { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border }, shadows.sm]}>
                  <Feather name={type.icon} size={16} color={active ? colors.primaryForeground : colors.secondary} />
                  <Text style={[styles.typeLabel, { color: active ? colors.primaryForeground : colors.primary }]}>{type.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        {[
          { label: "Flat / Door no.", value: flat, set: setFlat, placeholder: "e.g. Flat 4B" },
          { label: "Building / Society", value: building, set: setBuilding, placeholder: "e.g. Sunrise Apartments" },
          { label: "Area / Locality", value: area, set: setArea, placeholder: "e.g. Koramangala" },
          { label: "City", value: city, set: setCity, placeholder: "City" },
          { label: "PIN code", value: pincode, set: setPincode, placeholder: "560034", keyboard: "number-pad", max: 6 },
        ].map((f) => (
          <View key={f.label} style={styles.section}>
            <Text style={[styles.label, { color: colors.secondary }]}>{f.label}</Text>
            <TextInput value={f.value} onChangeText={f.set} placeholder={f.placeholder}
              placeholderTextColor={colors.mutedForeground}
              keyboardType={f.keyboard as any ?? "default"} maxLength={f.max}
              style={[styles.input, { backgroundColor: colors.card, color: colors.primary, borderColor: colors.border }]} />
          </View>
        ))}
      </ScrollView>
      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <Button label="Save changes" onPress={handleSave} loading={saving} disabled={!isValid} variant="primary" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 18 },
  section: { gap: 8 },
  label: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  typeRow: { flexDirection: "row", gap: 10 },
  typeBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 14, paddingVertical: 12, borderWidth: 1.5 },
  typeLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  input: { borderRadius: 14, padding: 14, fontFamily: "Inter_400Regular", fontSize: 15, borderWidth: 1 },
  footer: { paddingHorizontal: spacing.pagePadding, paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
});
