import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProductCard } from "@/components/home/ProductCard";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import { PRODUCTS } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const SUGGESTIONS = [
  "Organic milk",
  "Paracetamol",
  "USB charger",
  "Bread",
  "Hand sanitizer",
  "Vitamin C",
  "Almond butter",
];

const RECENT = ["Organic milk", "USB charger", "Bread"];

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState("");
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const results = query.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const showEmpty = query.trim() && results.length === 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search header */}
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>
        <View style={[styles.inputWrap, { backgroundColor: colors.card }, shadows.sm]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            ref={inputRef}
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search for anything..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.primary, fontFamily: "Inter_400Regular" }]}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
        <Pressable style={[styles.voiceBtn, { backgroundColor: colors.card }, shadows.sm]}>
          <Feather name="mic" size={18} color={colors.primary} />
        </Pressable>
      </View>

      {/* Content */}
      {!query.trim() ? (
        <View style={styles.suggestions}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Recent</Text>
          <View style={styles.chips}>
            {RECENT.map((r) => (
              <Pressable
                key={r}
                onPress={() => setQuery(r)}
                style={[styles.chip, { backgroundColor: colors.muted }]}
              >
                <Feather name="clock" size={12} color={colors.mutedForeground} />
                <Text style={[styles.chipText, { color: colors.primary }]}>{r}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.primary, marginTop: 24 }]}>
            Popular searches
          </Text>
          <View style={styles.chips}>
            {SUGGESTIONS.map((s) => (
              <Pressable
                key={s}
                onPress={() => setQuery(s)}
                style={[styles.chip, { backgroundColor: colors.card }, shadows.sm]}
              >
                <Feather name="trending-up" size={12} color={colors.accentOrange} />
                <Text style={[styles.chipText, { color: colors.primary }]}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : showEmpty ? (
        <View style={styles.emptyWrap}>
          <Feather name="search" size={40} color={colors.muted} />
          <Text style={[styles.emptyTitle, { color: colors.primary }]}>
            No results for "{query}"
          </Text>
          <Text style={[styles.emptyDesc, { color: colors.mutedForeground }]}>
            Try a different term or request the product directly.
          </Text>
          <Pressable
            style={[styles.requestBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/request" as any)}
          >
            <Text style={[styles.requestText, { color: colors.primaryForeground }]}>
              Request this product
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.resultList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              width={(360 - spacing.pagePadding * 2 - 12) / 2}
              onAdd={() => addItem(item)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: spacing.pagePadding,
    paddingBottom: 16,
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
  },
  input: { flex: 1, fontSize: 16 },
  voiceBtn: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  suggestions: { paddingHorizontal: spacing.pagePadding, paddingTop: 8 },
  sectionTitle: { ...typography.sectionTitle, marginBottom: 12 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipText: { fontFamily: "Inter_400Regular", fontSize: 14 },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 12 },
  emptyTitle: { ...typography.h4, textAlign: "center" },
  emptyDesc: { ...typography.body, textAlign: "center" },
  requestBtn: {
    marginTop: 8,
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  requestText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  resultList: { paddingHorizontal: spacing.pagePadding, paddingBottom: 40, gap: 12 },
  row: { gap: 12 },
});
