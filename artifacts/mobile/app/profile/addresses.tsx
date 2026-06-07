import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const SAVED_ADDRESSES = [
  {
    id: "1",
    label: "Home",
    address: "Flat 4B, Sunrise Apartments, Koramangala, Bengaluru - 560034",
    isDefault: true,
    icon: "home" as const,
  },
  {
    id: "2",
    label: "Work",
    address: "WeWork Galaxy, 43 Residency Road, MG Road, Bengaluru - 560025",
    isDefault: false,
    icon: "briefcase" as const,
  },
];

export default function AddressesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [addresses, setAddresses] = useState(SAVED_ADDRESSES);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const setDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View
        entering={FadeInDown.duration(400).delay(0)}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.primary }]}>Saved Addresses</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: botPad }]}
        showsVerticalScrollIndicator={false}
      >
        {addresses.map((addr, i) => (
          <Animated.View
            key={addr.id}
            entering={FadeInDown.duration(400).delay(80 + i * 80)}
          >
            <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
              <View
                style={[
                  styles.addrIcon,
                  { backgroundColor: addr.isDefault ? colors.primary + "15" : colors.muted },
                ]}
              >
                <Feather
                  name={addr.icon}
                  size={20}
                  color={addr.isDefault ? colors.primary : colors.secondary}
                />
              </View>
              <View style={styles.addrInfo}>
                <View style={styles.labelRow}>
                  <Text style={[styles.addrLabel, { color: colors.primary }]}>{addr.label}</Text>
                  {addr.isDefault && (
                    <View style={[styles.defaultBadge, { backgroundColor: colors.accentGreen + "20" }]}>
                      <Text style={[styles.defaultText, { color: colors.accentGreen }]}>
                        Default
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.addrText, { color: colors.secondary }]}>{addr.address}</Text>
                {!addr.isDefault && (
                  <Pressable onPress={() => setDefault(addr.id)}>
                    <Text style={[styles.setDefaultText, { color: colors.accentOrange }]}>
                      Set as default
                    </Text>
                  </Pressable>
                )}
              </View>
              <Pressable
                style={styles.editBtn}
                onPress={() => router.push(`/address/edit?id=${addr.id}` as any)}
              >
                <Feather name="edit-2" size={16} color={colors.mutedForeground} />
              </Pressable>
            </View>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInDown.duration(400).delay(80 + addresses.length * 80)}>
          <Pressable
            style={[styles.addCard, { borderColor: colors.border }]}
            onPress={() => router.push("/address/add" as any)}
          >
            <Feather name="plus-circle" size={22} color={colors.accentOrange} />
            <Text style={[styles.addText, { color: colors.primary }]}>Add New Address</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.pagePadding,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { ...typography.h3 },
  list: { paddingHorizontal: spacing.pagePadding, gap: 12 },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
    borderRadius: 20,
  },
  addrIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  addrInfo: { flex: 1, gap: 6 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  addrLabel: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  defaultBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  defaultText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  addrText: { ...typography.small, lineHeight: 18 },
  setDefaultText: { fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 2 },
  editBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  addCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  addText: { fontFamily: "Inter_500Medium", fontSize: 15 },
});
