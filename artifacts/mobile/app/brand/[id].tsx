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
const BRANDS = [
  { id: "amul", name: "Amul", emoji: "🐄", tagline: "The Taste of India", color: "#E74C3C" },
  { id: "nestlé", name: "Nestlé", emoji: "🍫", tagline: "Good Food, Good Life", color: "#4A90E2" },
  { id: "dabur", name: "Dabur", emoji: "🌿", tagline: "Science of Ayurveda", color: "#34C759" },
  { id: "samsung", name: "Samsung", emoji: "📱", tagline: "Imagine the Possibilities", color: "#1428A0" },
];

export default function BrandScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem } = useCart();
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const brand = BRANDS.find((b) => b.id === id) ?? BRANDS[0];
  const cardWidth = (width - spacing.pagePadding * 2 - 12) / 2;

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title={brand.name} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {/* Brand hero */}
        <View style={[styles.brandHero, { backgroundColor: brand.color }]}>
          <Text style={styles.brandEmoji}>{brand.emoji}</Text>
          <Text style={styles.brandName}>{brand.name}</Text>
          <Text style={styles.brandTagline}>{brand.tagline}</Text>
          <View style={styles.statsRow}>
            {[{ label: "Products", value: "48" }, { label: "Reviews", value: "2.4k" }, { label: "Rating", value: "4.7★" }].map((s) => (
              <View key={s.label} style={[styles.statItem, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Products</Text>
        <View style={styles.grid}>
          {PRODUCTS.map((p) => (
            <Pressable key={p.id} style={[styles.card, { backgroundColor: colors.card, width: cardWidth }, shadows.sm]}
              onPress={() => router.push(`/product/${p.id}` as any)}>
              <View style={[styles.imgWrap, { backgroundColor: colors.muted }]}>
                <Text style={styles.emoji}>
                  {p.category === "Groceries" ? "🥛" : p.category === "Pharmacy" ? "💊" : "📦"}
                </Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardName, { color: colors.primary }]} numberOfLines={2}>{p.name}</Text>
                <View style={styles.cardBottom}>
                  <Text style={[styles.cardPrice, { color: colors.primary }]}>₹{p.price}</Text>
                  <Pressable onPress={() => addItem(p)} style={[styles.addBtn, { backgroundColor: brand.color }]}>
                    <Feather name="plus" size={14} color="#FFF" />
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
  content: { gap: 16 },
  brandHero: { padding: 28, gap: 8, alignItems: "center" },
  brandEmoji: { fontSize: 56 },
  brandName: { fontFamily: "Inter_700Bold", fontSize: 28, color: "#FFF", letterSpacing: -1 },
  brandTagline: { fontFamily: "Inter_400Regular", fontSize: 14, color: "rgba(255,255,255,0.8)" },
  statsRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  statItem: { borderRadius: 12, padding: 12, alignItems: "center", minWidth: 80 },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#FFF" },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(255,255,255,0.7)" },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: -0.5, paddingHorizontal: spacing.pagePadding },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingHorizontal: spacing.pagePadding },
  card: { borderRadius: 18, overflow: "hidden" },
  imgWrap: { height: 110, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 44 },
  cardInfo: { padding: 10, gap: 6 },
  cardName: { fontFamily: "Inter_600SemiBold", fontSize: 13, lineHeight: 16 },
  cardBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardPrice: { fontFamily: "Inter_700Bold", fontSize: 15 },
  addBtn: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center" },
});
