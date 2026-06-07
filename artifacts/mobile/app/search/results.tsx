import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import { PRODUCTS } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";

const { width } = Dimensions.get("window");
const SORT_OPTIONS = ["Relevance", "Price: Low–High", "Price: High–Low", "Delivery time", "Rating"];

export default function SearchResultsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { q } = useLocalSearchParams<{ q: string }>();
  const { addItem } = useCart();
  const [sortIdx, setSortIdx] = useState(0);
  const [showSort, setShowSort] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;
  const cardWidth = (width - spacing.pagePadding * 2 - 12) / 2;

  const query = q ?? "";
  const results = PRODUCTS.filter((p) =>
    !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title={query ? `"${query}"` : "Search results"} right={
        <Pressable onPress={() => router.push("/search/filters" as any)} hitSlop={8}>
          <Feather name="sliders" size={20} color={colors.primary} />
        </Pressable>
      } />

      {/* Sort bar */}
      <View style={[styles.sortBar, { borderBottomColor: colors.border }]}>
        <Text style={[styles.resultsCount, { color: colors.mutedForeground }]}>{results.length} results</Text>
        <Pressable style={styles.sortBtn} onPress={() => setShowSort(!showSort)}>
          <Feather name="chevrons-up-down" size={14} color={colors.secondary} />
          <Text style={[styles.sortText, { color: colors.secondary }]}>{SORT_OPTIONS[sortIdx]}</Text>
        </Pressable>
      </View>

      {/* Sort dropdown */}
      {showSort && (
        <View style={[styles.sortDropdown, { backgroundColor: colors.card }, shadows.lg]}>
          {SORT_OPTIONS.map((opt, i) => (
            <Pressable key={opt} onPress={() => { setSortIdx(i); setShowSort(false); }}
              style={[styles.sortOption, i === sortIdx && { backgroundColor: colors.muted }]}>
              <Text style={[styles.sortOptionText, { color: colors.primary }]}>{opt}</Text>
              {i === sortIdx && <Feather name="check" size={14} color={colors.primary} />}
            </Pressable>
          ))}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.grid, { paddingBottom: botPad }]}>
        {results.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="search" size={44} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.primary }]}>No results found</Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>Try a different search term</Text>
          </View>
        ) : (
          results.map((p) => (
            <Pressable key={p.id} style={[styles.card, { backgroundColor: colors.card, width: cardWidth }, shadows.sm]}
              onPress={() => router.push(`/product/${p.id}` as any)}>
              <View style={[styles.imgWrap, { backgroundColor: colors.muted }]}>
                <Text style={styles.emoji}>
                  {p.category === "Groceries" ? "🥛" : p.category === "Pharmacy" ? "💊" : p.category === "Electronics" ? "⚡" : "📦"}
                </Text>
                {p.originalPrice && (
                  <View style={[styles.saleBadge, { backgroundColor: colors.danger }]}>
                    <Text style={styles.saleText}>SALE</Text>
                  </View>
                )}
              </View>
              <View style={styles.info}>
                <Text style={[styles.name, { color: colors.primary }]} numberOfLines={2}>{p.name}</Text>
                <Text style={[styles.unit, { color: colors.mutedForeground }]}>{p.unit}</Text>
                <View style={styles.priceRow}>
                  <Text style={[styles.price, { color: colors.primary }]}>₹{p.price}</Text>
                  {p.originalPrice && <Text style={[styles.origPrice, { color: colors.mutedForeground }]}>₹{p.originalPrice}</Text>}
                </View>
                <View style={styles.bottomRow}>
                  <Text style={[styles.eta, { color: colors.mutedForeground }]}>{p.eta}</Text>
                  <Pressable onPress={() => addItem(p)} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
                    <Feather name="plus" size={14} color={colors.primaryForeground} />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sortBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: spacing.pagePadding, paddingVertical: 10, borderBottomWidth: 1 },
  resultsCount: { fontFamily: "Inter_400Regular", fontSize: 13 },
  sortBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  sortText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  sortDropdown: { position: "absolute", top: 108, right: spacing.pagePadding, borderRadius: 16, zIndex: 100, minWidth: 180, overflow: "hidden" },
  sortOption: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14 },
  sortOptionText: { fontFamily: "Inter_400Regular", fontSize: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingHorizontal: spacing.pagePadding, paddingTop: 14 },
  emptyState: { flex: 1, alignItems: "center", paddingTop: 80, gap: 12, alignSelf: "center" },
  emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 18 },
  emptySub: { fontFamily: "Inter_400Regular", fontSize: 14 },
  card: { borderRadius: 18, overflow: "hidden" },
  imgWrap: { height: 120, alignItems: "center", justifyContent: "center", position: "relative" },
  emoji: { fontSize: 44 },
  saleBadge: { position: "absolute", top: 8, right: 8, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  saleText: { fontFamily: "Inter_700Bold", fontSize: 10, color: "#FFF" },
  info: { padding: 10, gap: 3 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 13, lineHeight: 16 },
  unit: { fontFamily: "Inter_400Regular", fontSize: 11 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 5 },
  price: { fontFamily: "Inter_700Bold", fontSize: 15 },
  origPrice: { fontFamily: "Inter_400Regular", fontSize: 11, textDecorationLine: "line-through" },
  bottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 2 },
  eta: { fontFamily: "Inter_400Regular", fontSize: 11 },
  addBtn: { width: 28, height: 28, borderRadius: 9, alignItems: "center", justifyContent: "center" },
});
