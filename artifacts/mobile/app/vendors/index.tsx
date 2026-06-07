import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const STORES = [
  { id: "s1", name: "Fresh Mart", emoji: "🏪", category: "Grocery", rating: 4.8, eta: "15 min", distance: "0.5 km", open: true, minOrder: 99 },
  { id: "s2", name: "MediPlus Pharmacy", emoji: "💊", category: "Pharmacy", rating: 4.9, eta: "12 min", distance: "0.8 km", open: true, minOrder: 0 },
  { id: "s3", name: "TechZone Electronics", emoji: "⚡", category: "Electronics", rating: 4.6, eta: "25 min", distance: "1.2 km", open: true, minOrder: 299 },
  { id: "s4", name: "Baker's Delight", emoji: "🥐", category: "Bakery", rating: 4.7, eta: "20 min", distance: "0.3 km", open: false, minOrder: 49 },
  { id: "s5", name: "Nature's Basket", emoji: "🥗", category: "Organic", rating: 4.9, eta: "18 min", distance: "0.9 km", open: true, minOrder: 149 },
  { id: "s6", name: "SparkClean", emoji: "🧹", category: "Household", rating: 4.5, eta: "30 min", distance: "1.5 km", open: true, minOrder: 199 },
];

const CATEGORIES_FILTER = ["All", "Grocery", "Pharmacy", "Electronics", "Bakery", "Organic"];

export default function VendorsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState("All");
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const filtered = filter === "All" ? STORES : STORES.filter((s) => s.category === filter);

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="All stores" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow} style={styles.filterBar}>
        {CATEGORIES_FILTER.map((cat) => {
          const active = filter === cat;
          return (
            <Pressable key={cat} onPress={() => setFilter(cat)}
              style={[styles.filterPill, { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border }]}>
              <Text style={[styles.filterText, { color: active ? colors.primaryForeground : colors.primary }]}>{cat}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.list, { paddingBottom: botPad }]}>
        <Text style={[styles.count, { color: colors.mutedForeground }]}>{filtered.length} stores nearby</Text>
        {filtered.map((store) => (
          <Pressable key={store.id} style={[styles.storeCard, { backgroundColor: colors.card }, shadows.sm]}
            onPress={() => router.push(`/store/${store.id}` as any)}>
            <View style={[styles.storeIcon, { backgroundColor: `${store.open ? colors.accentGreen : colors.border}18` }]}>
              <Text style={styles.storeEmoji}>{store.emoji}</Text>
            </View>
            <View style={styles.storeInfo}>
              <View style={styles.storeTop}>
                <Text style={[styles.storeName, { color: colors.primary }]}>{store.name}</Text>
                {!store.open && (
                  <View style={[styles.closedBadge, { backgroundColor: colors.muted }]}>
                    <Text style={[styles.closedText, { color: colors.mutedForeground }]}>Closed</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.storeCat, { color: colors.mutedForeground }]}>{store.category}</Text>
              <View style={styles.storeMeta}>
                <View style={styles.metaItem}>
                  <Feather name="star" size={11} color={colors.accentOrange} />
                  <Text style={[styles.metaText, { color: colors.secondary }]}>{store.rating}</Text>
                </View>
                <Text style={[styles.metaDot, { color: colors.border }]}>·</Text>
                <Feather name="clock" size={11} color={colors.mutedForeground} />
                <Text style={[styles.metaText, { color: colors.secondary }]}>{store.eta}</Text>
                <Text style={[styles.metaDot, { color: colors.border }]}>·</Text>
                <Feather name="map-pin" size={11} color={colors.mutedForeground} />
                <Text style={[styles.metaText, { color: colors.secondary }]}>{store.distance}</Text>
              </View>
              {store.minOrder > 0 && (
                <Text style={[styles.minOrder, { color: colors.mutedForeground }]}>
                  Min. order: ₹{store.minOrder}
                </Text>
              )}
            </View>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterBar: { maxHeight: 60, flexGrow: 0 },
  filterRow: { paddingHorizontal: spacing.pagePadding, gap: 8, paddingBottom: 8, alignItems: "center" },
  filterPill: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9, borderWidth: 1.5 },
  filterText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  list: { paddingHorizontal: spacing.pagePadding, gap: 12 },
  count: { fontFamily: "Inter_400Regular", fontSize: 13, marginBottom: 4 },
  storeCard: { borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  storeIcon: { width: 54, height: 54, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  storeEmoji: { fontSize: 26 },
  storeInfo: { flex: 1, gap: 3 },
  storeTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  storeName: { fontFamily: "Inter_600SemiBold", fontSize: 15, flex: 1 },
  closedBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  closedText: { fontFamily: "Inter_500Medium", fontSize: 11 },
  storeCat: { fontFamily: "Inter_400Regular", fontSize: 12 },
  storeMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 2 },
  metaText: { fontFamily: "Inter_400Regular", fontSize: 12 },
  metaDot: { fontFamily: "Inter_400Regular", fontSize: 12 },
  minOrder: { fontFamily: "Inter_400Regular", fontSize: 11 },
});
