import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import { PRODUCTS } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";

const { width } = Dimensions.get("window");

const FLASH_ITEMS = PRODUCTS.map((p) => ({
  ...p,
  flashPrice: Math.round(p.price * 0.6),
  timeLeft: Math.floor(Math.random() * 3600) + 600,
}));

function Countdown({ seconds }: { seconds: number }) {
  const [s, setS] = useState(seconds);
  const colors = useColors();
  useEffect(() => {
    const t = setInterval(() => setS((x) => Math.max(0, x - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return (
    <View style={countdownStyles.row}>
      {[h, m, sec].map((val, i) => (
        <React.Fragment key={i}>
          {i > 0 && <Text style={[countdownStyles.sep, { color: "rgba(247,245,240,0.6)" }]}>:</Text>}
          <View style={countdownStyles.block}>
            <Text style={countdownStyles.val}>{String(val).padStart(2, "0")}</Text>
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

const countdownStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  block: { backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  val: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#FFF" },
  sep: { fontFamily: "Inter_700Bold", fontSize: 18 },
});

export default function FlashSaleScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;
  const cardWidth = (width - spacing.pagePadding * 2 - 12) / 2;

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="" transparent />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: colors.danger }]}>
          <View style={styles.heroTop}>
            <Feather name="zap" size={28} color="#FFF" />
            <Text style={styles.heroTitle}>Flash Sale</Text>
          </View>
          <Text style={styles.heroSub}>Up to 60% off for limited time only</Text>
          <View style={styles.countdownRow}>
            <Text style={styles.countdownLabel}>Ends in</Text>
            <Countdown seconds={3600 * 2 + 1847} />
          </View>
        </View>

        {/* Items */}
        <View style={styles.grid}>
          {FLASH_ITEMS.map((item) => {
            const discount = Math.round(((item.price - item.flashPrice) / item.price) * 100);
            return (
              <Pressable key={item.id} style={[styles.card, { backgroundColor: colors.card, width: cardWidth }, shadows.sm]}
                onPress={() => router.push(`/product/${item.id}` as any)}>
                <View style={[styles.imgWrap, { backgroundColor: colors.muted }]}>
                  <Text style={styles.emoji}>
                    {item.category === "Groceries" ? "🥛" : item.category === "Pharmacy" ? "💊" : item.category === "Electronics" ? "⚡" : "📦"}
                  </Text>
                  <View style={[styles.discountBadge, { backgroundColor: colors.danger }]}>
                    <Text style={styles.discountText}>{discount}% OFF</Text>
                  </View>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.name, { color: colors.primary }]} numberOfLines={2}>{item.name}</Text>
                  <View style={styles.priceRow}>
                    <Text style={[styles.flashPrice, { color: colors.danger }]}>₹{item.flashPrice}</Text>
                    <Text style={[styles.origPrice, { color: colors.mutedForeground }]}>₹{item.price}</Text>
                  </View>
                  <Pressable style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={() => addItem(item)}>
                    <Feather name="plus" size={14} color={colors.primaryForeground} />
                    <Text style={[styles.addText, { color: colors.primaryForeground }]}>Add</Text>
                  </Pressable>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: 20 },
  hero: { paddingTop: 80, paddingBottom: 28, paddingHorizontal: spacing.pagePadding, gap: 8 },
  heroTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  heroTitle: { fontFamily: "Inter_700Bold", fontSize: 32, color: "#FFF", letterSpacing: -1 },
  heroSub: { fontFamily: "Inter_400Regular", fontSize: 15, color: "rgba(255,255,255,0.8)" },
  countdownRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 6 },
  countdownLabel: { fontFamily: "Inter_500Medium", fontSize: 14, color: "rgba(255,255,255,0.7)" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingHorizontal: spacing.pagePadding },
  card: { borderRadius: 20, overflow: "hidden" },
  imgWrap: { height: 120, alignItems: "center", justifyContent: "center", position: "relative" },
  emoji: { fontSize: 44 },
  discountBadge: { position: "absolute", top: 8, right: 8, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  discountText: { fontFamily: "Inter_700Bold", fontSize: 11, color: "#FFF" },
  cardInfo: { padding: 12, gap: 6 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 13, lineHeight: 16 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  flashPrice: { fontFamily: "Inter_700Bold", fontSize: 17 },
  origPrice: { fontFamily: "Inter_400Regular", fontSize: 12, textDecorationLine: "line-through" },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, borderRadius: 10, paddingVertical: 8 },
  addText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
});
