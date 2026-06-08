import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { shadows } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import type { Product } from "@/constants/mockData";

const CATEGORY_COLORS: Record<string, string> = {
  Groceries: "#34C759",
  Pharmacy: "#FF4D4F",
  Electronics: "#4A90E2",
  "Personal Care": "#FF9A3D",
  "Home & Kitchen": "#8B4513",
  Bakery: "#FF6B6B",
  Sports: "#111111",
  "Pet Supplies": "#9B59B6",
  Stationery: "#3498DB",
  Beverages: "#1ABC9C",
};

type ProductCardProps = {
  product: Product;
  onPress?: () => void;
  onAdd?: () => void;
  width?: number;
};

export function ProductCard({ product, onPress, onAdd, width = 175 }: ProductCardProps) {
  const colors = useColors();
  const [added, setAdded] = useState(false);
  const scale = useSharedValue(1);
  const cardScale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleAdd = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    scale.value = withSpring(0.9, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });
    setAdded(true);
    onAdd?.();
    setTimeout(() => setAdded(false), 2000);
  };

  const accentColor = CATEGORY_COLORS[product.category] ?? colors.accentOrange;

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => { cardScale.value = withSpring(0.98, { damping: 15 }); }}
        onPressOut={() => { cardScale.value = withSpring(1, { damping: 15 }); }}
        style={[styles.card, { backgroundColor: colors.card, width, borderRadius: 24 }, shadows.card]}
      >
        {/* Image area with emoji */}
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: accentColor + "18" },
          ]}
        >
          <Text style={styles.emojiText}>{product.emoji ?? "📦"}</Text>
          <View style={[styles.etaBadge, { backgroundColor: colors.primary }]}>
            <Feather name="clock" size={9} color="#F7F5F0" />
            <Text style={styles.etaText}>{product.eta}</Text>
          </View>
          {product.originalPrice && (
            <View style={[styles.discountBadge, { backgroundColor: colors.danger }]}>
              <Text style={styles.discountText}>
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={[styles.unit, { color: colors.mutedForeground }]}>
            {product.unit}
          </Text>
          <View style={styles.priceRow}>
            <View>
              <Text style={[styles.price, { color: colors.primary }]}>
                ₹{product.price}
              </Text>
              {product.originalPrice && (
                <Text style={[styles.originalPrice, { color: colors.mutedForeground }]}>
                  ₹{product.originalPrice}
                </Text>
              )}
            </View>
            <Animated.View style={btnStyle}>
              <Pressable
                onPress={handleAdd}
                style={[
                  styles.addBtn,
                  { backgroundColor: added ? colors.accentGreen : accentColor },
                ]}
              >
                <Feather name={added ? "check" : "plus"} size={16} color="#FFF" />
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { overflow: "hidden" },
  imageContainer: {
    height: 130,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    margin: 8,
    marginBottom: 0,
    position: "relative",
  },
  emojiText: {
    fontSize: 56,
    lineHeight: 68,
  },
  etaBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  etaText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 9,
    color: "#F7F5F0",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  discountText: {
    fontFamily: "Inter_700Bold",
    fontSize: 9,
    color: "#FFF",
  },
  content: { padding: 12, gap: 2 },
  name: {
    ...typography.bodyMedium,
    fontSize: 14,
    lineHeight: 18,
  },
  unit: { ...typography.caption, marginTop: 2 },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  price: { ...typography.price, fontSize: 17 },
  originalPrice: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textDecorationLine: "line-through",
  },
  addBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
