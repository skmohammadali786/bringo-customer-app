import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const RECENT_LOCATIONS = [
  { name: "Home", address: "Flat 4B, Sunrise Apts, Koramangala", icon: "home" as const },
  { name: "Office", address: "Block A, Manyata Tech Park, Hebbal", icon: "briefcase" as const },
  { name: "Parents", address: "45, Jayanagar 4th Block, Bengaluru", icon: "heart" as const },
];

export default function MapScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("Flat 4B, Sunrise Apts, Koramangala");

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      {/* Map area */}
      <View style={[styles.mapArea, { backgroundColor: colors.muted }]}>
        {/* Grid simulation */}
        <View style={styles.mapGrid}>
          {Array.from({ length: 40 }).map((_, i) => (
            <View key={i} style={[styles.mapCell, { backgroundColor: colors.card, opacity: 0.5 }]} />
          ))}
        </View>

        {/* Pin */}
        <View style={styles.pinWrap}>
          <View style={[styles.pinBubble, { backgroundColor: colors.accentOrange }, shadows.lg]}>
            <Feather name="map-pin" size={24} color="#FFF" />
          </View>
          <View style={[styles.pinShadow, { backgroundColor: colors.accentOrange + "30" }]} />
        </View>

        {/* Back btn */}
        <Pressable onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.background, top: topPad + 16 }, shadows.sm]}>
          <Feather name="arrow-left" size={20} color={colors.primary} />
        </Pressable>

        {/* Search overlay */}
        <View style={[styles.searchOverlay, { backgroundColor: colors.background }, shadows.lg]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search location..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.primary }]}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        {/* My location */}
        <Pressable style={[styles.myLocationBtn, { backgroundColor: colors.background }, shadows.sm]}>
          <Feather name="crosshair" size={20} color={colors.accentBlue} />
        </Pressable>
      </View>

      {/* Bottom sheet */}
      <View style={[styles.sheet, { backgroundColor: colors.background }]}>
        <View style={styles.sheetHandle} />
        <Text style={[styles.sheetTitle, { color: colors.primary }]}>Deliver to</Text>
        <Text style={[styles.selectedAddr, { color: colors.secondary }]} numberOfLines={2}>{selected}</Text>

        {/* Recent */}
        <Text style={[styles.recentLabel, { color: colors.mutedForeground }]}>Recent locations</Text>
        {RECENT_LOCATIONS.map((loc) => (
          <Pressable key={loc.name} onPress={() => setSelected(loc.address)}
            style={[styles.recentRow, { backgroundColor: selected === loc.address ? colors.muted : "transparent" }]}>
            <View style={[styles.recentIcon, { backgroundColor: colors.muted }]}>
              <Feather name={loc.icon} size={16} color={colors.secondary} />
            </View>
            <View>
              <Text style={[styles.recentName, { color: colors.primary }]}>{loc.name}</Text>
              <Text style={[styles.recentAddr, { color: colors.mutedForeground }]} numberOfLines={1}>{loc.address}</Text>
            </View>
          </Pressable>
        ))}

        <View style={{ paddingTop: 8, paddingBottom: botPad }}>
          <Button label="Confirm location" onPress={() => router.back()} variant="primary" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapArea: { height: "55%", position: "relative" },
  mapGrid: { position: "absolute", inset: 0, flexDirection: "row", flexWrap: "wrap", gap: 3, padding: 10 },
  mapCell: { width: "18%", height: 44, borderRadius: 6 },
  pinWrap: { position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -16 }, { translateY: -40 }], alignItems: "center" },
  pinBubble: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  pinShadow: { width: 20, height: 8, borderRadius: 10, marginTop: 4 },
  backBtn: { position: "absolute", left: spacing.pagePadding, width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  searchOverlay: { position: "absolute", top: 76, left: spacing.pagePadding, right: spacing.pagePadding, borderRadius: 16, padding: 12, flexDirection: "row", alignItems: "center", gap: 10 },
  searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14 },
  myLocationBtn: { position: "absolute", right: spacing.pagePadding, bottom: 20, width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  sheet: { flex: 1, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: spacing.pagePadding, gap: 12, marginTop: -20 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "rgba(0,0,0,0.15)", alignSelf: "center", marginBottom: 4 },
  sheetTitle: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5 },
  selectedAddr: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 18 },
  recentLabel: { fontFamily: "Inter_500Medium", fontSize: 12, letterSpacing: 0.5 },
  recentRow: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 12, padding: 10 },
  recentIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  recentName: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  recentAddr: { fontFamily: "Inter_400Regular", fontSize: 12, maxWidth: 260 },
});
