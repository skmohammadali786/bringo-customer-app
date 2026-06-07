import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import { PRODUCTS } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";

const { width } = Dimensions.get("window");
const cardWidth = (width - spacing.pagePadding * 2 - 12) / 2;

const WISHLIST_PRODUCTS = PRODUCTS.slice(0, 6);

export default function WishlistScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const [wishlist, setWishlist] = useState(WISHLIST_PRODUCTS.map((p) => p.id));
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const remove = (id: string) => setWishlist((w) => w.filter((x) => x !== id));
  const products = WISHLIST_PRODUCTS.filter((p) => wishlist.includes(p.id));

  if (products.length === 0) {
    return (
      <View style={[{ flex: 1, backgroundColor: colors.background }]}>
        <BackHeader title="Saved" />
        <EmptyState title="Nothing saved yet" message="Heart items to save them here for later." icon="heart"
          actionLabel="Browse products" onAction={() => router.push("/(tabs)" as any)} />
      </View>
    );
  }

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title={`Saved (${products.length})`} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.grid, { paddingBottom: botPad }]}>
        {products.map((p) => (
          <Pressable key={p.id} onPress={() => router.push(`/product/${p.id}` as any)}
            style={[styles.card, { backgroundColor: colors.card, width: cardWidth }, shadows.sm]}>
            <View style={[styles.imgWrap, { backgroundColor: colors.muted }]}>
              <Text style={styles.emoji}>
                {p.category === "Groceries" ? "🥛" : p.category === "Pharmacy" ? "💊" : p.category === "Electronics" ? "⚡" : "📦"}
              </Text>
              <Pressable style={[styles.heartBtn, { backgroundColor: colors.background }]} onPress={() => remove(p.id)}>
                <Feather name="heart" size={16} color={colors.danger} />
              </Pressable>
            </View>
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.primary }]} numberOfLines={2}>{p.name}</Text>
              <Text style={[styles.unit, { color: colors.mutedForeground }]}>{p.unit}</Text>
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: colors.primary }]}>₹{p.price}</Text>
                {p.originalPrice && <Text style={[styles.original, { color: colors.mutedForeground }]}>₹{p.originalPrice}</Text>}
              </View>
              <Pressable style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={() => addItem(p)}>
                <Feather name="plus" size={14} color={colors.primaryForeground} />
                <Text style={[styles.addText, { color: colors.primaryForeground }]}>Add</Text>
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingHorizontal: spacing.pagePadding },
  card: { borderRadius: 20, overflow: "hidden" },
  imgWrap: { height: 130, alignItems: "center", justifyContent: "center", position: "relative" },
  emoji: { fontSize: 48 },
  heartBtn: { position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  info: { padding: 12, gap: 4 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 13, lineHeight: 17 },
  unit: { fontFamily: "Inter_400Regular", fontSize: 11 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  price: { fontFamily: "Inter_700Bold", fontSize: 16 },
  original: { fontFamily: "Inter_400Regular", fontSize: 12, textDecorationLine: "line-through" },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, borderRadius: 10, paddingVertical: 8, marginTop: 4 },
  addText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
});
