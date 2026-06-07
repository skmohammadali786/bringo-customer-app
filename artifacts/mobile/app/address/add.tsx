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
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const ADDRESS_TYPES = [
  { id: "home", label: "Home", icon: "home" as const },
  { id: "work", label: "Work", icon: "briefcase" as const },
  { id: "other", label: "Other", icon: "map-pin" as const },
];

export default function AddAddressScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [addressType, setAddressType] = useState("home");
  const [flat, setFlat] = useState("");
  const [building, setBuilding] = useState("");
  const [area, setArea] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [pincode, setPincode] = useState("");
  const [saving, setSaving] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const isValid = flat.trim() && area.trim() && city.trim() && pincode.length === 6;

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    router.back();
  };

  const Field = ({
    label,
    value,
    onChange,
    placeholder,
    keyboardType = "default",
    maxLength,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    keyboardType?: any;
    maxLength?: number;
  }) => (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.secondary }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        keyboardType={keyboardType}
        maxLength={maxLength}
        style={[
          styles.input,
          { backgroundColor: colors.card, color: colors.primary, borderColor: colors.border },
        ]}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <BackHeader title="Add address" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 80 }]}
      >
        {/* Map Placeholder */}
        <Pressable
          style={[styles.mapPlaceholder, { backgroundColor: colors.muted }]}
          onPress={() => router.push("/map" as any)}
        >
          <View style={[styles.mapPin, { backgroundColor: colors.accentOrange }]}>
            <Feather name="map-pin" size={20} color="#FFF" />
          </View>
          <Text style={[styles.mapText, { color: colors.secondary }]}>Tap to pick on map</Text>
          <Text style={[styles.mapSub, { color: colors.mutedForeground }]}>
            Koramangala, Bengaluru
          </Text>
        </Pressable>

        {/* Address Type */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>Address type</Text>
          <View style={styles.typeRow}>
            {ADDRESS_TYPES.map((type) => {
              const active = addressType === type.id;
              return (
                <Pressable
                  key={type.id}
                  onPress={() => setAddressType(type.id)}
                  style={[
                    styles.typeBtn,
                    {
                      backgroundColor: active ? colors.primary : colors.card,
                      borderColor: active ? colors.primary : colors.border,
                    },
                    shadows.sm,
                  ]}
                >
                  <Feather
                    name={type.icon}
                    size={16}
                    color={active ? colors.primaryForeground : colors.secondary}
                  />
                  <Text style={[styles.typeLabel, { color: active ? colors.primaryForeground : colors.primary }]}>
                    {type.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Fields */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>Address details</Text>
          <View style={styles.fields}>
            <Field label="Flat / Door no. *" value={flat} onChange={setFlat} placeholder="e.g. Flat 4B" />
            <Field label="Building / Society" value={building} onChange={setBuilding} placeholder="e.g. Sunrise Apartments" />
            <Field label="Area / Locality *" value={area} onChange={setArea} placeholder="e.g. Koramangala 5th Block" />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Field label="City *" value={city} onChange={setCity} placeholder="City" />
              </View>
              <View style={{ width: 110 }}>
                <Field label="PIN code *" value={pincode} onChange={setPincode} placeholder="560034" keyboardType="number-pad" maxLength={6} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <Button
          label="Save address"
          onPress={handleSave}
          loading={saving}
          disabled={!isValid}
          variant="primary"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.pagePadding, gap: 24 },
  mapPlaceholder: {
    height: 140,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  mapPin: { width: 44, height: 44, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  mapText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  mapSub: { fontFamily: "Inter_400Regular", fontSize: 13 },
  section: { gap: 12 },
  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 17, letterSpacing: -0.5 },
  typeRow: { flexDirection: "row", gap: 10 },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
  },
  typeLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  fields: { gap: 14 },
  field: { gap: 6 },
  fieldLabel: { fontFamily: "Inter_500Medium", fontSize: 13 },
  input: {
    borderRadius: 14,
    padding: 14,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    borderWidth: 1,
  },
  row: { flexDirection: "row", gap: 10 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.pagePadding,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
});
