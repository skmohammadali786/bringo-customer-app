import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProductCard } from "@/components/home/ProductCard";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import { CATEGORIES, PRODUCTS } from "@/constants/mockData";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

export default function CategoryDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { addItem } = useCart();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 20;

  const cat = CATEGORIES.find((c) => c.id === slug);
  const products = cat ? PRODUCTS.filter((p) => p.category === cat.name) : PRODUCTS;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.primary }]}>
            {cat?.name ?? "All Products"}
          </Text>
          <Text style={[styles.count, { color: colors.mutedForeground }]}>
            {products.length} items
          </Text>
        </View>
        <Pressable onPress={() => router.push("/search" as any)}>
          <Feather name="search" size={22} color={colors.primary} />
        </Pressable>
      </View>

      <FlatList
        data={products.length > 0 ? products : PRODUCTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, { paddingBottom: botPad }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            width={(360 - spacing.pagePadding * 2 - 12) / 2}
            onAdd={() => addItem(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No products found. Try requesting one!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.pagePadding,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  titleRow: { gap: 2 },
  title: { ...typography.h3 },
  count: { ...typography.small },
  list: { paddingHorizontal: spacing.pagePadding, gap: 12 },
  row: { gap: 12 },
  empty: { padding: 40, alignItems: "center" },
  emptyText: { ...typography.body, textAlign: "center" },
});
