import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { CATEGORIES, PRODUCTS } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";

const { width } = Dimensions.get("window");

const COLLECTIONS = [
  { id: "flash", title: "Flash Sale", subtitle: "Up to 60% off", color: "#FF4D4F", icon: "zap" as const, route: "/flash" },
  { id: "trending", title: "Trending Now", subtitle: "What everyone's ordering", color: "#4A90E2", icon: "trending-up" as const, route: "/trending" },
  { id: "new", title: "New Arrivals", subtitle: "Fresh this week", color: "#34C759", icon: "star" as const, route: "/new-arrivals" },
  { id: "prime", title: "Bringo Prime", subtitle: "Exclusive member deals", color: "#FF9A3D", icon: "award" as const, route: "/prime" },
];

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + spacing.tabBarHeight + 16;

  return (
    <ScrollView style={[{ flex: 1, backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: botPad }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.title, { color: colors.primary }]}>Explore</Text>
        <Pressable style={[styles.searchBtn, { backgroundColor: colors.card }, shadows.sm]}
          onPress={() => router.push("/search" as any)}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <Text style={[styles.searchText, { color: colors.mutedForeground }]}>Search products...</Text>
        </Pressable>
      </View>

      {/* Collections */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Collections</Text>
        <View style={styles.collectionsGrid}>
          {COLLECTIONS.map((col) => (
            <Pressable key={col.id} onPress={() => router.push(col.route as any)}
              style={[styles.collectionCard, { backgroundColor: col.color }, shadows.md]}>
              <View style={[styles.collectionIcon, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
                <Feather name={col.icon} size={24} color="#FFF" />
              </View>
              <Text style={styles.collectionTitle}>{col.title}</Text>
              <Text style={styles.collectionSub}>{col.subtitle}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* All Categories */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>All categories</Text>
        <View style={styles.catGrid}>
          {CATEGORIES.map((cat) => (
            <Pressable key={cat.id} onPress={() => router.push(`/categories/${cat.name.toLowerCase().replace(/\s+/g, "-")}` as any)}
              style={[styles.catCard, { backgroundColor: colors.card }, shadows.sm]}>
              <View style={[styles.catIcon, { backgroundColor: cat.color + "18" }]}>
                <Feather name={cat.icon as any} size={22} color={cat.color} />
              </View>
              <Text style={[styles.catName, { color: colors.primary }]} numberOfLines={1}>{cat.name}</Text>
              <Text style={[styles.catCount, { color: colors.mutedForeground }]}>{cat.count} items</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Featured Products */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Featured today</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
          {PRODUCTS.map((p) => (
            <Pressable key={p.id} onPress={() => router.push(`/product/${p.id}` as any)}
              style={[styles.productCard, { backgroundColor: colors.card }, shadows.sm]}>
              <View style={[styles.productImg, { backgroundColor: colors.muted }]}>
                <Text style={styles.productEmoji}>
                  {p.category === "Groceries" ? "🥛" : p.category === "Pharmacy" ? "💊" : p.category === "Electronics" ? "⚡" : "📦"}
                </Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={[styles.productName, { color: colors.primary }]} numberOfLines={2}>{p.name}</Text>
                <Text style={[styles.productPrice, { color: colors.primary }]}>₹{p.price}</Text>
                <Text style={[styles.productEta, { color: colors.mutedForeground }]}>{p.eta}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.pagePadding, gap: 16, paddingBottom: 8 },
  title: { fontSize: 36, fontFamily: "Inter_700Bold", letterSpacing: -1.5 },
  searchBtn: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 16, padding: 14 },
  searchText: { fontFamily: "Inter_400Regular", fontSize: 15, flex: 1 },
  section: { paddingHorizontal: spacing.pagePadding, marginTop: 28, gap: 14 },
  sectionTitle: { fontSize: 22, fontFamily: "Inter_700Bold", letterSpacing: -0.8 },
  collectionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  collectionCard: { width: (width - spacing.pagePadding * 2 - 12) / 2, borderRadius: 20, padding: 18, gap: 8 },
  collectionIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  collectionTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: "#FFF", letterSpacing: -0.5 },
  collectionSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,255,0.8)" },
  catGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  catCard: { width: (width - spacing.pagePadding * 2 - 12) / 2, borderRadius: 18, padding: 16, gap: 8 },
  catIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  catName: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  catCount: { fontFamily: "Inter_400Regular", fontSize: 12 },
  productScroll: { gap: 12 },
  productCard: { width: 160, borderRadius: 20, overflow: "hidden" },
  productImg: { height: 120, alignItems: "center", justifyContent: "center" },
  productEmoji: { fontSize: 48 },
  productInfo: { padding: 12, gap: 4 },
  productName: { fontFamily: "Inter_600SemiBold", fontSize: 13, lineHeight: 17 },
  productPrice: { fontFamily: "Inter_700Bold", fontSize: 16 },
  productEta: { fontFamily: "Inter_400Regular", fontSize: 11 },
});
