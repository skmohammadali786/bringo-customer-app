import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { CATEGORIES } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - spacing.pagePadding * 2 - 12) / 2;

export default function CategoriesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 20;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.primary }]}>All Categories</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.grid, { paddingBottom: botPad }]}
        showsVerticalScrollIndicator={false}
      >
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat.id}
            onPress={() => router.push(`/categories/${cat.id}` as any)}
            style={[
              styles.catCard,
              { backgroundColor: colors.card, width: CARD_WIDTH },
              shadows.card,
            ]}
          >
            <View style={[styles.catIcon, { backgroundColor: `${cat.color}18` }]}>
              <Feather name={cat.icon as any} size={28} color={cat.color} />
            </View>
            <Text style={[styles.catName, { color: colors.primary }]}>{cat.name}</Text>
            <Text style={[styles.catCount, { color: colors.mutedForeground }]}>
              {cat.count} items
            </Text>
          </Pressable>
        ))}
      </ScrollView>
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
  title: { ...typography.h3 },
  grid: {
    paddingHorizontal: spacing.pagePadding,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  catCard: { borderRadius: 24, padding: 20, gap: 10 },
  catIcon: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  catName: { fontFamily: "Inter_600SemiBold", fontSize: 16, marginTop: 4 },
  catCount: { fontFamily: "Inter_400Regular", fontSize: 12 },
});
