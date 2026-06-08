import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import { PRODUCTS } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";

const { width } = Dimensions.get("window");

const etaMin = (eta: string) => parseInt(eta.replace(/\D/g, "")) || 999;

export default function SearchResultsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;
  const cardWidth = (width - spacing.pagePadding * 2 - 12) / 2;

  const params = useLocalSearchParams<{
    q?: string;
    category?: string;
    sort?: string;
    delivery?: string;
    inStock?: string;
    onSale?: string;
  }>();

  const query = params.q ?? "";
  const categoryFilter = params.category ?? "All";
  const sortFilter = params.sort ?? "Relevance";
  const deliveryFilter = params.delivery ?? "Any";
  const onSaleFilter = params.onSale === "1";

  // Count active (non-default) filters for badge
  const activeFilterCount = [
    categoryFilter !== "All",
    sortFilter !== "Relevance",
    deliveryFilter !== "Any",
    onSaleFilter,
  ].filter(Boolean).length;

  // --- Apply filters ---
  let results = PRODUCTS.filter(
    (p) =>
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  if (categoryFilter !== "All") {
    results = results.filter((p) => p.category === categoryFilter);
  }

  if (onSaleFilter) {
    results = results.filter((p) => p.originalPrice !== undefined);
  }

  if (deliveryFilter !== "Any") {
    results = results.filter((p) => {
      const min = etaMin(p.eta);
      if (deliveryFilter === "Under 15 min") return min < 15;
      if (deliveryFilter === "15–30 min") return min >= 15 && min <= 30;
      if (deliveryFilter === "30–60 min") return min > 30 && min <= 60;
      return true;
    });
  }

  // --- Apply sort ---
  results = [...results];
  if (sortFilter === "Price: Low to High") {
    results.sort((a, b) => a.price - b.price);
  } else if (sortFilter === "Price: High to Low") {
    results.sort((a, b) => b.price - a.price);
  } else if (sortFilter === "Fastest delivery") {
    results.sort((a, b) => etaMin(a.eta) - etaMin(b.eta));
  } else if (sortFilter === "Rating") {
    results.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
  }

  const openFilters = () => {
    router.push({
      pathname: "/search/filters" as any,
      params: {
        q: query,
        category: categoryFilter,
        sort: sortFilter,
        delivery: deliveryFilter,
        inStock: params.inStock ?? "1",
        onSale: params.onSale ?? "0",
      },
    });
  };

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader
        title={query ? `"${query}"` : "Search results"}
        right={
          <Pressable onPress={openFilters} hitSlop={8} style={styles.filterBtn}>
            <Feather name="sliders" size={20} color={activeFilterCount > 0 ? colors.accentOrange : colors.primary} />
            {activeFilterCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.accentOrange }]}>
                <Text style={styles.badgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </Pressable>
        }
      />

      {/* Active filter chips strip */}
      {activeFilterCount > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterStrip}
        >
          {categoryFilter !== "All" && (
            <View style={[styles.activeChip, { backgroundColor: colors.primary }]}>
              <Text style={[styles.activeChipText, { color: colors.primaryForeground }]}>
                {categoryFilter}
              </Text>
              <Pressable
                hitSlop={8}
                onPress={() =>
                  router.replace({
                    pathname: "/search/results" as any,
                    params: { ...params, category: "All" },
                  })
                }
              >
                <Feather name="x" size={12} color={colors.primaryForeground} />
              </Pressable>
            </View>
          )}
          {sortFilter !== "Relevance" && (
            <View style={[styles.activeChip, { backgroundColor: colors.primary }]}>
              <Text style={[styles.activeChipText, { color: colors.primaryForeground }]}>
                {sortFilter}
              </Text>
              <Pressable
                hitSlop={8}
                onPress={() =>
                  router.replace({
                    pathname: "/search/results" as any,
                    params: { ...params, sort: "Relevance" },
                  })
                }
              >
                <Feather name="x" size={12} color={colors.primaryForeground} />
              </Pressable>
            </View>
          )}
          {deliveryFilter !== "Any" && (
            <View style={[styles.activeChip, { backgroundColor: colors.primary }]}>
              <Text style={[styles.activeChipText, { color: colors.primaryForeground }]}>
                {deliveryFilter}
              </Text>
              <Pressable
                hitSlop={8}
                onPress={() =>
                  router.replace({
                    pathname: "/search/results" as any,
                    params: { ...params, delivery: "Any" },
                  })
                }
              >
                <Feather name="x" size={12} color={colors.primaryForeground} />
              </Pressable>
            </View>
          )}
          {onSaleFilter && (
            <View style={[styles.activeChip, { backgroundColor: colors.danger }]}>
              <Text style={[styles.activeChipText, { color: "#FFF" }]}>On sale</Text>
              <Pressable
                hitSlop={8}
                onPress={() =>
                  router.replace({
                    pathname: "/search/results" as any,
                    params: { ...params, onSale: "0" },
                  })
                }
              >
                <Feather name="x" size={12} color="#FFF" />
              </Pressable>
            </View>
          )}
        </ScrollView>
      )}

      {/* Results count bar */}
      <View style={[styles.countBar, { borderBottomColor: colors.border }]}>
        <Text style={[styles.resultsCount, { color: colors.mutedForeground }]}>
          {results.length} result{results.length !== 1 ? "s" : ""}
        </Text>
        {sortFilter !== "Relevance" && (
          <Pressable onPress={openFilters} style={styles.sortPill}>
            <Feather name="chevrons-down" size={13} color={colors.secondary} />
            <Text style={[styles.sortPillText, { color: colors.secondary }]}>{sortFilter}</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.grid, { paddingBottom: botPad }]}
      >
        {results.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="search" size={44} color={colors.border} />
            <Text style={[styles.emptyTitle, { color: colors.primary }]}>No results found</Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
              Try adjusting your filters or search term
            </Text>
            <Pressable
              style={[styles.clearBtn, { backgroundColor: colors.muted }]}
              onPress={() =>
                router.replace({
                  pathname: "/search/results" as any,
                  params: { q: query },
                })
              }
            >
              <Text style={[styles.clearBtnText, { color: colors.primary }]}>Clear filters</Text>
            </Pressable>
          </View>
        ) : (
          results.map((p) => (
            <Pressable
              key={p.id}
              style={[styles.card, { backgroundColor: colors.card, width: cardWidth }, shadows.sm]}
              onPress={() => router.push(`/product/${p.id}` as any)}
            >
              <View style={[styles.imgWrap, { backgroundColor: colors.muted }]}>
                <Text style={styles.emoji}>
                  {p.category === "Groceries"
                    ? "🥛"
                    : p.category === "Pharmacy"
                    ? "💊"
                    : p.category === "Electronics"
                    ? "⚡"
                    : p.category === "Bakery"
                    ? "🍞"
                    : p.category === "Beverages"
                    ? "🥤"
                    : "📦"}
                </Text>
                {p.originalPrice && (
                  <View style={[styles.saleBadge, { backgroundColor: colors.danger }]}>
                    <Text style={styles.saleText}>SALE</Text>
                  </View>
                )}
              </View>
              <View style={styles.info}>
                <Text style={[styles.name, { color: colors.primary }]} numberOfLines={2}>
                  {p.name}
                </Text>
                <Text style={[styles.unit, { color: colors.mutedForeground }]}>{p.unit}</Text>
                <View style={styles.priceRow}>
                  <Text style={[styles.price, { color: colors.primary }]}>₹{p.price}</Text>
                  {p.originalPrice && (
                    <Text style={[styles.origPrice, { color: colors.mutedForeground }]}>
                      ₹{p.originalPrice}
                    </Text>
                  )}
                </View>
                <View style={styles.bottomRow}>
                  <View style={styles.etaRow}>
                    <Feather name="clock" size={10} color={colors.mutedForeground} />
                    <Text style={[styles.eta, { color: colors.mutedForeground }]}>{p.eta}</Text>
                  </View>
                  <Pressable
                    onPress={() => addItem(p)}
                    style={[styles.addBtn, { backgroundColor: colors.primary }]}
                  >
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
  filterBtn: { position: "relative", padding: 4 },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontFamily: "Inter_700Bold", fontSize: 9, color: "#FFF" },
  filterStrip: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: spacing.pagePadding,
    paddingVertical: 10,
  },
  activeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activeChipText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  countBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.pagePadding,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  resultsCount: { fontFamily: "Inter_400Regular", fontSize: 13 },
  sortPill: { flexDirection: "row", alignItems: "center", gap: 4 },
  sortPillText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingHorizontal: spacing.pagePadding,
    paddingTop: 14,
  },
  emptyState: {
    width: "100%",
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: { fontFamily: "Inter_600SemiBold", fontSize: 18 },
  emptySub: { fontFamily: "Inter_400Regular", fontSize: 14, textAlign: "center", maxWidth: 260 },
  clearBtn: { marginTop: 4, borderRadius: 999, paddingHorizontal: 24, paddingVertical: 12 },
  clearBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  card: { borderRadius: 18, overflow: "hidden" },
  imgWrap: { height: 120, alignItems: "center", justifyContent: "center", position: "relative" },
  emoji: { fontSize: 44 },
  saleBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  saleText: { fontFamily: "Inter_700Bold", fontSize: 10, color: "#FFF" },
  info: { padding: 10, gap: 3 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 13, lineHeight: 16 },
  unit: { fontFamily: "Inter_400Regular", fontSize: 11 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 5 },
  price: { fontFamily: "Inter_700Bold", fontSize: 15 },
  origPrice: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    textDecorationLine: "line-through",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  etaRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  eta: { fontFamily: "Inter_400Regular", fontSize: 11 },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
});
