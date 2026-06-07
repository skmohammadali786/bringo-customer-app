import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import { PRODUCTS } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";

const { width } = Dimensions.get("window");

const NEW_PRODUCTS = PRODUCTS.map((p, i) => ({
  ...p,
  isNew: i < 4,
  addedDays: i + 1,
}));

export default function NewArrivalsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="New arrivals" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        <View style={[styles.banner, { backgroundColor: colors.accentGreen }, shadows.card]}>
          <Feather name="star" size={28} color="#FFF" />
          <Text style={styles.bannerTitle}>Fresh this week</Text>
          <Text style={styles.bannerSub}>{NEW_PRODUCTS.length} new items added</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Just added</Text>
        {NEW_PRODUCTS.map((p) => (
          <Pressable key={p.id} onPress={() => router.push(`/product/${p.id}` as any)}
            style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
            <View style={[styles.imgWrap, { backgroundColor: colors.muted }]}>
              <Text style={styles.emoji}>
                {p.category === "Groceries" ? "🥛" : p.category === "Pharmacy" ? "💊" : p.category === "Electronics" ? "⚡" : "📦"}
              </Text>
            </View>
            <View style={styles.info}>
              <View style={styles.infoTop}>
                <Badge label="NEW" variant="success" size="sm" />
                <Text style={[styles.days, { color: colors.mutedForeground }]}>{p.addedDays}d ago</Text>
              </View>
              <Text style={[styles.name, { color: colors.primary }]} numberOfLines={1}>{p.name}</Text>
              <Text style={[styles.cat, { color: colors.mutedForeground }]}>{p.category} · {p.unit}</Text>
              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: colors.primary }]}>₹{p.price}</Text>
                <Text style={[styles.eta, { color: colors.accentGreen }]}>⚡ {p.eta}</Text>
              </View>
            </View>
            <Pressable onPress={() => addItem(p)} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
              <Feather name="plus" size={18} color={colors.primaryForeground} />
            </Pressable>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 14 },
  banner: { borderRadius: 24, padding: 22, gap: 6 },
  bannerTitle: { fontFamily: "Inter_700Bold", fontSize: 24, color: "#FFF", letterSpacing: -0.8 },
  bannerSub: { fontFamily: "Inter_400Regular", fontSize: 14, color: "rgba(255,255,255,0.8)" },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: -0.5 },
  card: { borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  imgWrap: { width: 60, height: 60, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 28 },
  info: { flex: 1, gap: 3 },
  infoTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  days: { fontFamily: "Inter_400Regular", fontSize: 11 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  cat: { fontFamily: "Inter_400Regular", fontSize: 12 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  price: { fontFamily: "Inter_700Bold", fontSize: 16 },
  eta: { fontFamily: "Inter_500Medium", fontSize: 12 },
  addBtn: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
});
