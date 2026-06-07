import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const CATEGORIES = ["All", "Groceries", "Pharmacy", "Electronics", "Bakery", "Beverages", "Personal Care"];
const DELIVERY_TIMES = ["Any", "Under 15 min", "15–30 min", "30–60 min"];
const SORT_BY = ["Relevance", "Price: Low to High", "Price: High to Low", "Rating", "Fastest delivery"];

export default function FiltersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [category, setCategory] = useState("All");
  const [delivery, setDelivery] = useState("Any");
  const [sort, setSort] = useState("Relevance");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [inStock, setInStock] = useState(true);
  const [onSale, setOnSale] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const handleApply = () => router.back();
  const handleReset = () => {
    setCategory("All");
    setDelivery("Any");
    setSort("Relevance");
    setInStock(true);
    setOnSale(false);
  };

  const Toggle = ({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) => (
    <View style={styles.toggleRow}>
      <Text style={[styles.toggleLabel, { color: colors.primary }]}>{label}</Text>
      <Pressable onPress={onToggle} style={[styles.toggle, { backgroundColor: value ? colors.primary : colors.muted }]}>
        <View style={[styles.toggleDot, { left: value ? 20 : 2 }]} />
      </Pressable>
    </View>
  );

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Filters" right={
        <Pressable onPress={handleReset} hitSlop={8}>
          <Text style={[styles.resetText, { color: colors.accentOrange }]}>Reset</Text>
        </Pressable>
      } />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad + 80 }]}>
        {/* Sort by */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Sort by</Text>
          <View style={styles.chips}>
            {SORT_BY.map((s) => (
              <Pressable key={s} onPress={() => setSort(s)}
                style={[styles.chip, { backgroundColor: sort === s ? colors.primary : colors.card, borderColor: sort === s ? colors.primary : colors.border }]}>
                <Text style={[styles.chipText, { color: sort === s ? colors.primaryForeground : colors.primary }]}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Category</Text>
          <View style={styles.chips}>
            {CATEGORIES.map((c) => (
              <Pressable key={c} onPress={() => setCategory(c)}
                style={[styles.chip, { backgroundColor: category === c ? colors.primary : colors.card, borderColor: category === c ? colors.primary : colors.border }]}>
                <Text style={[styles.chipText, { color: category === c ? colors.primaryForeground : colors.primary }]}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Delivery time */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Delivery time</Text>
          <View style={styles.chips}>
            {DELIVERY_TIMES.map((d) => (
              <Pressable key={d} onPress={() => setDelivery(d)}
                style={[styles.chip, { backgroundColor: delivery === d ? colors.primary : colors.card, borderColor: delivery === d ? colors.primary : colors.border }]}>
                <Text style={[styles.chipText, { color: delivery === d ? colors.primaryForeground : colors.primary }]}>{d}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Toggles */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Options</Text>
          <View style={[styles.toggleCard, { backgroundColor: colors.card }, shadows.sm]}>
            <Toggle label="In stock only" value={inStock} onToggle={() => setInStock(!inStock)} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Toggle label="On sale" value={onSale} onToggle={() => setOnSale(!onSale)} />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <Button label="Show results" onPress={handleApply} variant="primary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 24 },
  section: { gap: 12 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 17, letterSpacing: -0.4 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9, borderWidth: 1.5 },
  chipText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  toggleCard: { borderRadius: 18, overflow: "hidden" },
  toggleRow: { flexDirection: "row", alignItems: "center", padding: 16 },
  toggleLabel: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 15 },
  toggle: { width: 44, height: 26, borderRadius: 13, justifyContent: "center", position: "relative" },
  toggleDot: { position: "absolute", width: 20, height: 20, borderRadius: 10, backgroundColor: "#FFF", top: 3 },
  divider: { height: 1, marginHorizontal: 16 },
  resetText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  footer: { paddingHorizontal: spacing.pagePadding, paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
});
