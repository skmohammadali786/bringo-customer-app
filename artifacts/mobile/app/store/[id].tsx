import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import { PRODUCTS } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";

const { width } = Dimensions.get("window");

const STORE_CATEGORIES = ["All", "Grocery", "Dairy", "Fruits", "Snacks", "Beverages"];

export default function StoreDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState("All");
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const cardWidth = (width - spacing.pagePadding * 2 - 12) / 2;

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Store" right={
        <Pressable hitSlop={8}>
          <Feather name="share-2" size={20} color={colors.primary} />
        </Pressable>
      } />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {/* Store Hero */}
        <View style={[styles.storeHero, { backgroundColor: colors.card }, shadows.card]}>
          <View style={[styles.storeIcon, { backgroundColor: colors.accentOrange + "18" }]}>
            <Text style={styles.storeEmoji}>🏪</Text>
          </View>
          <Text style={[styles.storeName, { color: colors.primary }]}>Fresh Mart</Text>
          <View style={styles.storeMeta}>
            <View style={styles.metaItem}>
              <Feather name="star" size={14} color={colors.accentOrange} />
              <Text style={[styles.metaText, { color: colors.secondary }]}>4.7</Text>
            </View>
            <View style={[styles.metaDot, { backgroundColor: colors.border }]} />
            <View style={styles.metaItem}>
              <Feather name="clock" size={14} color={colors.accentBlue} />
              <Text style={[styles.metaText, { color: colors.secondary }]}>12–25 min</Text>
            </View>
            <View style={[styles.metaDot, { backgroundColor: colors.border }]} />
            <View style={styles.metaItem}>
              <Feather name="map-pin" size={14} color={colors.accentGreen} />
              <Text style={[styles.metaText, { color: colors.secondary }]}>0.8 km</Text>
            </View>
          </View>
          <View style={styles.badgeRow}>
            <Badge label="Open" variant="success" size="sm" />
            <Badge label="Free delivery above ₹199" variant="default" size="sm" />
          </View>
        </View>

        {/* Category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {STORE_CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <Pressable key={cat} onPress={() => setActiveCategory(cat)}
                style={[styles.filterPill, { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border }]}>
                <Text style={[styles.filterText, { color: active ? colors.primaryForeground : colors.primary }]}>{cat}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Products grid */}
        <View style={styles.grid}>
          {PRODUCTS.map((p) => (
            <Pressable key={p.id} style={[styles.productCard, { backgroundColor: colors.card, width: cardWidth }, shadows.sm]}
              onPress={() => router.push(`/product/${p.id}` as any)}>
              <View style={[styles.productImg, { backgroundColor: colors.muted }]}>
                <Text style={styles.productEmoji}>
                  {p.category === "Groceries" ? "🥛" : p.category === "Pharmacy" ? "💊" : p.category === "Electronics" ? "⚡" : "📦"}
                </Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: colors.primary }]} numberOfLines={2}>{p.name}</Text>
                <Text style={[styles.productUnit, { color: colors.mutedForeground }]}>{p.unit}</Text>
                <View style={styles.productBottom}>
                  <Text style={[styles.productPrice, { color: colors.primary }]}>₹{p.price}</Text>
                  <Pressable onPress={() => addItem(p)} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
                    <Feather name="plus" size={14} color={colors.primaryForeground} />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 16 },
  storeHero: { borderRadius: 24, padding: 22, gap: 10, alignItems: "center" },
  storeIcon: { width: 72, height: 72, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  storeEmoji: { fontSize: 36 },
  storeName: { fontFamily: "Inter_700Bold", fontSize: 24, letterSpacing: -0.8 },
  storeMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontFamily: "Inter_400Regular", fontSize: 13 },
  metaDot: { width: 4, height: 4, borderRadius: 2 },
  badgeRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" },
  filterRow: { gap: 8, paddingBottom: 4 },
  filterPill: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9, borderWidth: 1.5 },
  filterText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  productCard: { borderRadius: 18, overflow: "hidden" },
  productImg: { height: 110, alignItems: "center", justifyContent: "center" },
  productEmoji: { fontSize: 44 },
  productInfo: { padding: 10, gap: 4 },
  productName: { fontFamily: "Inter_600SemiBold", fontSize: 13, lineHeight: 16 },
  productUnit: { fontFamily: "Inter_400Regular", fontSize: 11 },
  productBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  productPrice: { fontFamily: "Inter_700Bold", fontSize: 15 },
  addBtn: { width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center" },
});
