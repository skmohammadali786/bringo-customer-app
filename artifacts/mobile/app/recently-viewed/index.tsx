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

const RECENT = PRODUCTS.slice(0, 8).map((p, i) => ({
  ...p,
  viewedAt: i === 0 ? "Just now" : i < 3 ? `${i * 20} min ago` : `${i} hours ago`,
}));

export default function RecentlyViewedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const [items, setItems] = useState(RECENT);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const removeItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));
  const clearAll = () => setItems([]);

  if (items.length === 0) {
    return (
      <View style={[{ flex: 1, backgroundColor: colors.background }]}>
        <BackHeader title="Recently viewed" />
        <EmptyState title="Nothing here yet" message="Products you view will appear here." icon="clock" />
      </View>
    );
  }

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title={`Recently viewed (${items.length})`} right={
        <Pressable onPress={clearAll} hitSlop={8}>
          <Text style={[styles.clearText, { color: colors.danger }]}>Clear all</Text>
        </Pressable>
      } />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {items.map((p) => (
          <Pressable key={p.id} onPress={() => router.push(`/product/${p.id}` as any)}
            style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
            <View style={[styles.imgWrap, { backgroundColor: colors.muted }]}>
              <Text style={styles.emoji}>
                {p.category === "Groceries" ? "🥛" : p.category === "Pharmacy" ? "💊" : p.category === "Electronics" ? "⚡" : "📦"}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={[styles.name, { color: colors.primary }]} numberOfLines={1}>{p.name}</Text>
              <Text style={[styles.cat, { color: colors.mutedForeground }]}>{p.category}</Text>
              <View style={styles.bottom}>
                <Text style={[styles.price, { color: colors.primary }]}>₹{p.price}</Text>
                <Text style={[styles.viewed, { color: colors.mutedForeground }]}>{p.viewedAt}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <Pressable onPress={() => addItem(p)} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
                <Feather name="plus" size={16} color={colors.primaryForeground} />
              </Pressable>
              <Pressable onPress={() => removeItem(p.id)} hitSlop={8}>
                <Feather name="x" size={16} color={colors.mutedForeground} />
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 10 },
  card: { borderRadius: 18, padding: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  imgWrap: { width: 54, height: 54, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 26 },
  info: { flex: 1, gap: 2 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  cat: { fontFamily: "Inter_400Regular", fontSize: 12 },
  bottom: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 2 },
  price: { fontFamily: "Inter_700Bold", fontSize: 15 },
  viewed: { fontFamily: "Inter_400Regular", fontSize: 11 },
  actions: { gap: 8, alignItems: "center" },
  addBtn: { width: 34, height: 34, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  clearText: { fontFamily: "Inter_500Medium", fontSize: 14 },
});
