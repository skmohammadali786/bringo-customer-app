import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import { PRODUCTS } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";

const { width } = Dimensions.get("window");

export default function TrendingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const trending = PRODUCTS.filter((p) => p.isTrending);
  const all = PRODUCTS;

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Trending now" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {/* Hero */}
        <View style={[styles.heroBanner, { backgroundColor: colors.primary }, shadows.card]}>
          <Feather name="trending-up" size={28} color={colors.accentOrange} />
          <Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>Trending in your area</Text>
          <Text style={[styles.heroSub, { color: "rgba(247,245,240,0.7)" }]}>
            {trending.length} items everyone is ordering right now
          </Text>
        </View>

        {/* Trending items with rank */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Most popular</Text>
        {trending.map((product, idx) => (
          <Pressable key={product.id} onPress={() => router.push(`/product/${product.id}` as any)}
            style={[styles.rankCard, { backgroundColor: colors.card }, shadows.sm]}>
            <View style={[styles.rankBadge, { backgroundColor: idx === 0 ? colors.accentOrange : idx === 1 ? colors.accentBlue : colors.muted }]}>
              <Text style={[styles.rankNum, { color: idx < 2 ? "#FFF" : colors.primary }]}>#{idx + 1}</Text>
            </View>
            <View style={[styles.productImg, { backgroundColor: colors.muted }]}>
              <Text style={styles.productEmoji}>
                {product.category === "Groceries" ? "🥛" : product.category === "Pharmacy" ? "💊" : product.category === "Electronics" ? "⚡" : "📦"}
              </Text>
            </View>
            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: colors.primary }]} numberOfLines={1}>{product.name}</Text>
              <Text style={[styles.productCat, { color: colors.mutedForeground }]}>{product.category}</Text>
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: colors.primary }]}>₹{product.price}</Text>
                <Text style={[styles.eta, { color: colors.mutedForeground }]}>· {product.eta}</Text>
              </View>
            </View>
            <Pressable onPress={() => addItem(product)} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
              <Feather name="plus" size={16} color={colors.primaryForeground} />
            </Pressable>
          </Pressable>
        ))}

        {/* Also popular */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Also popular</Text>
        <View style={styles.grid}>
          {all.slice(0, 6).map((p) => (
            <Pressable key={p.id} onPress={() => router.push(`/product/${p.id}` as any)}
              style={[styles.gridCard, { backgroundColor: colors.card, width: (width - spacing.pagePadding * 2 - 12) / 2 }, shadows.sm]}>
              <View style={[styles.gridImg, { backgroundColor: colors.muted }]}>
                <Text style={styles.gridEmoji}>
                  {p.category === "Groceries" ? "🥛" : p.category === "Pharmacy" ? "💊" : p.category === "Electronics" ? "⚡" : "📦"}
                </Text>
              </View>
              <View style={styles.gridInfo}>
                <Text style={[styles.gridName, { color: colors.primary }]} numberOfLines={2}>{p.name}</Text>
                <Text style={[styles.gridPrice, { color: colors.primary }]}>₹{p.price}</Text>
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
  heroBanner: { borderRadius: 24, padding: 22, gap: 8 },
  heroTitle: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: -0.8 },
  heroSub: { fontFamily: "Inter_400Regular", fontSize: 13 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: -0.5 },
  rankCard: { borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  rankBadge: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  rankNum: { fontFamily: "Inter_700Bold", fontSize: 14 },
  productImg: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  productEmoji: { fontSize: 28 },
  productInfo: { flex: 1, gap: 2 },
  productName: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  productCat: { fontFamily: "Inter_400Regular", fontSize: 12 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  price: { fontFamily: "Inter_700Bold", fontSize: 15 },
  eta: { fontFamily: "Inter_400Regular", fontSize: 12 },
  addBtn: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  gridCard: { borderRadius: 18, overflow: "hidden" },
  gridImg: { height: 100, alignItems: "center", justifyContent: "center" },
  gridEmoji: { fontSize: 40 },
  gridInfo: { padding: 10, gap: 4 },
  gridName: { fontFamily: "Inter_600SemiBold", fontSize: 13, lineHeight: 16 },
  gridPrice: { fontFamily: "Inter_700Bold", fontSize: 15 },
});
