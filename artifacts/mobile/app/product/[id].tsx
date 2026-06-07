import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import { PRODUCTS } from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const { width } = Dimensions.get("window");

const REVIEWS = [
  { id: "r1", name: "Priya M.", rating: 5, text: "Excellent quality! Delivered in 12 minutes. Super fresh.", time: "2 days ago" },
  { id: "r2", name: "Arjun S.", rating: 4, text: "Good product, packaging was slightly damaged but contents fine.", time: "1 week ago" },
  { id: "r3", name: "Sneha P.", rating: 5, text: "Best quality I've found locally. Will definitely reorder.", time: "2 weeks ago" },
];

export default function ProductDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem, items } = useCart();
  const [qty, setQty] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  const product = PRODUCTS.find((p) => p.id === id) ?? PRODUCTS[0];
  const cartItem = items.find((i) => i.product.id === product.id);
  const cartQty = cartItem?.quantity ?? 0;

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  const handleAdd = () => {
    btnScale.value = withSpring(0.93, {}, () => { btnScale.value = withSpring(1); });
    addItem(product);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <BackHeader
        title={product.name}
        right={
          <Pressable onPress={() => setIsWishlisted((w) => !w)} hitSlop={8}>
            <Feather
              name="heart"
              size={22}
              color={isWishlisted ? colors.danger : colors.primary}
              style={isWishlisted ? { opacity: 1 } : { opacity: 0.5 }}
            />
          </Pressable>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: botPad + 90 }}>
        {/* Hero Image */}
        <View style={[styles.heroCard, { backgroundColor: colors.muted, marginHorizontal: spacing.pagePadding }]}>
          <View style={styles.heroContent}>
            <Text style={styles.heroEmoji}>
              {product.category === "Groceries" ? "🥛" :
               product.category === "Pharmacy" ? "💊" :
               product.category === "Electronics" ? "⚡" :
               product.category === "Bakery" ? "🍞" :
               product.category === "Personal Care" ? "🧴" : "📦"}
            </Text>
          </View>
          {discount > 0 && (
            <View style={[styles.discountTag, { backgroundColor: colors.danger }]}>
              <Text style={styles.discountTagText}>{discount}% OFF</Text>
            </View>
          )}
          <View style={[styles.etaTag, { backgroundColor: colors.primary }]}>
            <Feather name="clock" size={12} color={colors.primaryForeground} />
            <Text style={[styles.etaTagText, { color: colors.primaryForeground }]}>{product.eta}</Text>
          </View>
        </View>

        {/* Product Info */}
        <View style={[styles.section, { gap: 8 }]}>
          <View style={styles.categoryRow}>
            <Badge label={product.category} variant="default" size="sm" />
            {product.isTrending && <Badge label="Trending" variant="warning" size="sm" />}
          </View>
          <Text style={[styles.productName, { color: colors.primary }]}>{product.name}</Text>
          <Text style={[styles.unit, { color: colors.mutedForeground }]}>{product.unit}</Text>
          <Text style={[styles.description, { color: colors.secondary }]}>{product.description}</Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.primary }]}>₹{product.price}</Text>
            {product.originalPrice && (
              <Text style={[styles.originalPrice, { color: colors.mutedForeground }]}>
                ₹{product.originalPrice}
              </Text>
            )}
          </View>
        </View>

        {/* Quantity Selector */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>Quantity</Text>
          <View style={styles.qtyRow}>
            <Pressable
              onPress={() => setQty((q) => Math.max(1, q - 1))}
              style={[styles.qBtn, { backgroundColor: colors.muted }]}
            >
              <Feather name="minus" size={18} color={colors.primary} />
            </Pressable>
            <Text style={[styles.qty, { color: colors.primary }]}>{qty}</Text>
            <Pressable
              onPress={() => setQty((q) => q + 1)}
              style={[styles.qBtn, { backgroundColor: colors.primary }]}
            >
              <Feather name="plus" size={18} color={colors.primaryForeground} />
            </Pressable>
          </View>
        </View>

        {/* Delivery Info */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, marginHorizontal: spacing.pagePadding }, shadows.sm]}>
          {[
            { icon: "truck" as const, label: "Delivery", value: `In ${product.eta}` },
            { icon: "map-pin" as const, label: "Location", value: "Koramangala, Bengaluru" },
            { icon: "shield" as const, label: "Quality", value: "Freshness guaranteed" },
          ].map((item, i) => (
            <View key={item.label}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <View style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: colors.muted }]}>
                  <Feather name={item.icon} size={16} color={colors.accentOrange} />
                </View>
                <View style={styles.infoText}>
                  <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
                  <Text style={[styles.infoValue, { color: colors.primary }]}>{item.value}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={[styles.sectionLabel, { color: colors.primary }]}>Reviews</Text>
            <Pressable onPress={() => router.push(`/product/reviews?id=${product.id}` as any)}>
              <Text style={[styles.seeAll, { color: colors.accentOrange }]}>See all</Text>
            </Pressable>
          </View>
          {REVIEWS.slice(0, 2).map((review) => (
            <View key={review.id} style={[styles.reviewCard, { backgroundColor: colors.card }, shadows.sm]}>
              <View style={styles.reviewTop}>
                <View style={[styles.reviewAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.reviewInitial, { color: colors.primaryForeground }]}>
                    {review.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.reviewInfo}>
                  <Text style={[styles.reviewName, { color: colors.primary }]}>{review.name}</Text>
                  <Text style={[styles.reviewTime, { color: colors.mutedForeground }]}>{review.time}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Feather
                      key={i}
                      name="star"
                      size={12}
                      color={i < review.rating ? colors.accentOrange : colors.border}
                    />
                  ))}
                </View>
              </View>
              <Text style={[styles.reviewText, { color: colors.secondary }]}>{review.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <View style={styles.footerTotal}>
          <Text style={[styles.footerLabel, { color: colors.mutedForeground }]}>Total</Text>
          <Text style={[styles.footerPrice, { color: colors.primary }]}>₹{product.price * qty}</Text>
        </View>
        <Animated.View style={[styles.addBtn, btnStyle]}>
          <Button
            label={cartQty > 0 ? `Add more (${cartQty} in cart)` : "Add to Cart"}
            onPress={handleAdd}
            variant="primary"
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroCard: {
    height: 240,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    marginBottom: 4,
  },
  heroContent: { alignItems: "center", justifyContent: "center" },
  heroEmoji: { fontSize: 80 },
  discountTag: {
    position: "absolute",
    top: 16,
    left: 16,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  discountTagText: { fontFamily: "Inter_700Bold", fontSize: 12, color: "#FFF" },
  etaTag: {
    position: "absolute",
    bottom: 16,
    right: 16,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  etaTagText: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
  section: { paddingHorizontal: spacing.pagePadding, marginTop: 20 },
  categoryRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  productName: { fontSize: 26, fontFamily: "Inter_700Bold", letterSpacing: -1, lineHeight: 30 },
  unit: { fontFamily: "Inter_400Regular", fontSize: 14 },
  description: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 22 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 10, marginTop: 4 },
  price: { fontSize: 32, fontFamily: "Inter_700Bold", letterSpacing: -1 },
  originalPrice: { fontSize: 18, fontFamily: "Inter_400Regular", textDecorationLine: "line-through" },
  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5, marginBottom: 12 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 20 },
  qBtn: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  qty: { fontSize: 28, fontFamily: "Inter_700Bold", minWidth: 40, textAlign: "center" },
  infoCard: { borderRadius: 20, overflow: "hidden", marginTop: 20 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14 },
  infoIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  infoText: { flex: 1, gap: 2 },
  infoLabel: { fontFamily: "Inter_400Regular", fontSize: 12 },
  infoValue: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  divider: { height: 1, marginHorizontal: 14 },
  reviewsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  seeAll: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  reviewCard: { borderRadius: 20, padding: 16, marginBottom: 10, gap: 10 },
  reviewTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  reviewInitial: { fontFamily: "Inter_700Bold", fontSize: 16 },
  reviewInfo: { flex: 1, gap: 1 },
  reviewName: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  reviewTime: { fontFamily: "Inter_400Regular", fontSize: 12 },
  ratingBadge: { flexDirection: "row", gap: 2 },
  reviewText: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.pagePadding,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  footerTotal: { gap: 2 },
  footerLabel: { fontFamily: "Inter_400Regular", fontSize: 12 },
  footerPrice: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: -0.5 },
  addBtn: { flex: 1 },
});
