import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const ADDRESSES = [
  { id: "a1", label: "Home", address: "Flat 4B, Sunrise Apartments, Koramangala, Bengaluru 560095", icon: "home" as const, isDefault: true },
  { id: "a2", label: "Work", address: "Block A, Manyata Tech Park, Hebbal, Bengaluru 560045", icon: "briefcase" as const, isDefault: false },
  { id: "a3", label: "Parents", address: "45, Jayanagar 4th Block, Bengaluru 560041", icon: "heart" as const, isDefault: false },
];

export default function CheckoutAddressScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState("a1");
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Delivery address" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad + 80 }]}>
        {ADDRESSES.map((addr) => {
          const active = selected === addr.id;
          return (
            <Pressable key={addr.id} onPress={() => setSelected(addr.id)}
              style={[styles.addrCard, {
                backgroundColor: colors.card,
                borderColor: active ? colors.primary : "transparent",
                borderWidth: active ? 2 : 0,
              }, shadows.sm]}>
              <View style={[styles.addrIcon, { backgroundColor: active ? colors.primary : colors.muted }]}>
                <Feather name={addr.icon} size={18} color={active ? colors.primaryForeground : colors.secondary} />
              </View>
              <View style={styles.addrInfo}>
                <View style={styles.addrLabelRow}>
                  <Text style={[styles.addrLabel, { color: colors.primary }]}>{addr.label}</Text>
                  {addr.isDefault && (
                    <View style={[styles.defaultBadge, { backgroundColor: colors.accentGreen + "18" }]}>
                      <Text style={[styles.defaultText, { color: colors.accentGreen }]}>Default</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.addrText, { color: colors.secondary }]} numberOfLines={2}>
                  {addr.address}
                </Text>
              </View>
              <View style={[styles.radio, { borderColor: active ? colors.primary : colors.border }]}>
                {active && <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />}
              </View>
            </Pressable>
          );
        })}

        <Pressable style={[styles.addNewBtn, { backgroundColor: colors.card, borderColor: colors.border }, shadows.sm]}
          onPress={() => router.push("/address/add" as any)}>
          <View style={[styles.addIcon, { backgroundColor: colors.muted }]}>
            <Feather name="plus" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.addText, { color: colors.primary }]}>Add new address</Text>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </Pressable>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <Button label="Deliver here" onPress={() => router.back()} variant="primary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 12 },
  addrCard: { borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "flex-start", gap: 12 },
  addrIcon: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center", marginTop: 2 },
  addrInfo: { flex: 1, gap: 4 },
  addrLabelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  addrLabel: { fontFamily: "Inter_700Bold", fontSize: 15 },
  defaultBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  defaultText: { fontFamily: "Inter_500Medium", fontSize: 11 },
  addrText: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 18 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center", marginTop: 2 },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  addNewBtn: { borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1.5, borderStyle: "dashed" },
  addIcon: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  addText: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 15 },
  footer: { paddingHorizontal: spacing.pagePadding, paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
});
