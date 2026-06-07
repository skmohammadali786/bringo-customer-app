import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OrderCard } from "@/components/home/OrderCard";
import { ProductCard } from "@/components/home/ProductCard";
import { SearchBar } from "@/components/home/SearchBar";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useColors } from "@/hooks/useColors";
import {
  ACTIVE_ORDERS,
  CATEGORIES,
  OFFERS,
  PRODUCTS,
} from "@/constants/mockData";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const { width } = Dimensions.get("window");

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 14) return "Good noon";
  if (h >= 14 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 20) return "Good evening";
  if (h >= 20 && h < 23) return "Good night";
  return "Good late night";
}

const GREETING = getGreeting();

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { addItem, itemCount } = useCart();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCat, setSelectedCat] = useState("All");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + spacing.tabBarHeight;

  const trending = PRODUCTS.filter((p) => p.isTrending);
  const recommended = PRODUCTS.filter((p) => p.isRecommended);

  const filteredTrending =
    selectedCat === "All"
      ? trending
      : trending.filter((p) => p.category === selectedCat);

  const filteredRecommended =
    selectedCat === "All"
      ? recommended
      : recommended.filter((p) => p.category === selectedCat);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: botPad }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    >
      {/* Header */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(0)}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <Pressable
          style={styles.locationBtn}
          onPress={() => router.push("/profile/addresses" as any)}
        >
          <Feather name="map-pin" size={14} color={colors.accentOrange} />
          <Text style={[styles.locationText, { color: colors.primary }]}>
            Koramangala, Bengaluru
          </Text>
          <Feather name="chevron-down" size={14} color={colors.primary} />
        </Pressable>

        <View style={styles.headerRight}>
          {itemCount > 0 && (
            <Pressable
              style={[styles.cartBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/order/summary" as any)}
            >
              <Feather name="shopping-bag" size={16} color={colors.primaryForeground} />
              <View style={[styles.cartBadge, { backgroundColor: colors.accentOrange }]}>
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
              </View>
            </Pressable>
          )}
          <Pressable
            style={[styles.iconBtn, { backgroundColor: colors.card }, shadows.sm]}
            onPress={() => router.push("/(tabs)/notifications" as any)}
          >
            <Feather name="bell" size={18} color={colors.primary} />
          </Pressable>
        </View>
      </Animated.View>

      {/* Greeting */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(80)}
        style={styles.greeting}
      >
        <Text style={[styles.greet, { color: colors.mutedForeground }]}>{GREETING}</Text>
        <Text style={[styles.name, { color: colors.primary }]}>
          {user?.name ?? "there"} 👋
        </Text>
        <Text style={[styles.sub, { color: colors.secondary }]}>
          What do you need today?
        </Text>
      </Animated.View>

      {/* Search */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(140)}
        style={styles.section}
      >
        <SearchBar
          onVoice={() => router.push({ pathname: "/search", params: { mode: "voice" } } as any)}
          onImage={() => router.push({ pathname: "/search", params: { mode: "image" } } as any)}
        />
      </Animated.View>

      {/* Categories */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(200)}
        style={[styles.section, { paddingHorizontal: 0 }]}
      >
        <View style={{ paddingHorizontal: spacing.pagePadding, marginBottom: 12 }}>
          <SectionHeader title="Categories" seeAllHref="/categories" />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          {["All", ...CATEGORIES.map((c) => c.name)].map((cat) => {
            const isSelected = selectedCat === cat;
            const catData = CATEGORIES.find((c) => c.name === cat);
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCat(cat)}
                style={[
                  styles.catPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                  shadows.sm,
                ]}
              >
                {catData && (
                  <View
                    style={[
                      styles.catDot,
                      { backgroundColor: isSelected ? colors.primaryForeground : catData.color },
                    ]}
                  />
                )}
                <Text
                  style={[
                    styles.catText,
                    { color: isSelected ? colors.primaryForeground : colors.primary },
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* Active Orders */}
      {ACTIVE_ORDERS.length > 0 && (
        <Animated.View
          entering={FadeInDown.duration(400).delay(260)}
          style={styles.section}
        >
          <SectionHeader title="Active Orders" seeAllHref="/(tabs)/orders" />
          {ACTIVE_ORDERS.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </Animated.View>
      )}

      {/* Trending */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(300)}
        style={[styles.section, { paddingHorizontal: 0 }]}
      >
        <View style={{ paddingHorizontal: spacing.pagePadding }}>
          <SectionHeader
            title="Trending Now"
            onSeeAll={() => router.push("/search/results?filter=trending" as any)}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productScroll}
        >
          {(filteredTrending.length > 0 ? filteredTrending : trending).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => router.push(`/product/${product.id}` as any)}
              onAdd={() => addItem(product)}
            />
          ))}
        </ScrollView>
      </Animated.View>

      {/* Offers */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(340)}
        style={[styles.section, { paddingHorizontal: 0 }]}
      >
        <View style={{ paddingHorizontal: spacing.pagePadding }}>
          <SectionHeader
            title="Offers for you"
            onSeeAll={() => router.push("/offers" as any)}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productScroll}
        >
          {OFFERS.map((offer) => (
            <Pressable
              key={offer.id}
              style={({ pressed }) => [
                styles.offerCard,
                { backgroundColor: offer.color, opacity: pressed ? 0.9 : 1 },
                shadows.md,
              ]}
              onPress={() => router.push(`/promo?code=${offer.code}` as any)}
            >
              <Badge label={offer.discount} variant="default" style={styles.offerBadge} />
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerSub}>{offer.subtitle}</Text>
              <View style={styles.codeRow}>
                <View style={styles.codeBadge}>
                  <Text style={styles.codeText}>{offer.code}</Text>
                </View>
              </View>
              <Text style={styles.expires}>Expires {offer.expiresAt}</Text>
              <View style={styles.offerArrow}>
                <Feather name="arrow-right" size={14} color="rgba(255,255,255,0.8)" />
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Recommended */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(380)}
        style={styles.section}
      >
        <SectionHeader title="Recommended" />
        <View style={styles.productGrid}>
          {(filteredRecommended.length > 0 ? filteredRecommended : recommended).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => router.push(`/product/${product.id}` as any)}
              width={(width - spacing.pagePadding * 2 - 12) / 2}
              onAdd={() => addItem(product)}
            />
          ))}
        </View>
      </Animated.View>

      {/* Request Banner */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(420)}
        style={styles.section}
      >
        <Pressable
          onPress={() => router.push("/request" as any)}
          style={[styles.requestBanner, { backgroundColor: colors.primary }, shadows.lg]}
        >
          <View style={styles.requestLeft}>
            <Text style={[styles.requestTitle, { color: colors.primaryForeground }]}>
              Can't find what you need?
            </Text>
            <Text style={[styles.requestSub, { color: "rgba(247,245,240,0.7)" }]}>
              Request any product — we'll source it for you.
            </Text>
          </View>
          <View style={[styles.requestIcon, { backgroundColor: colors.accentOrange }]}>
            <Feather name="plus" size={20} color="#FFFFFF" />
          </View>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.pagePadding,
    paddingBottom: 8,
  },
  locationBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
  locationText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    maxWidth: 180,
  },
  headerRight: { flexDirection: "row", gap: 10, alignItems: "center" },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: { color: "#FFF", fontSize: 9, fontFamily: "Inter_700Bold" },
  greeting: {
    paddingHorizontal: spacing.pagePadding,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 2,
  },
  greet: { ...typography.small, textTransform: "uppercase", letterSpacing: 1 },
  name: { fontSize: 36, fontFamily: "Inter_700Bold", letterSpacing: -1.5, lineHeight: 40 },
  sub: { ...typography.body, marginTop: 4 },
  section: { paddingHorizontal: spacing.pagePadding, marginTop: 28 },
  catScroll: { paddingHorizontal: spacing.pagePadding, gap: 8 },
  catPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  catText: { fontFamily: "Inter_500Medium", fontSize: 14 },
  productScroll: { paddingHorizontal: spacing.pagePadding, gap: 12 },
  productGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  offerCard: {
    width: 220,
    borderRadius: 24,
    padding: 20,
    gap: 6,
    position: "relative",
  },
  offerBadge: { backgroundColor: "rgba(255,255,255,0.25)", marginBottom: 4 },
  offerTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: "#FFF", letterSpacing: -0.5 },
  offerSub: { fontFamily: "Inter_400Regular", fontSize: 13, color: "rgba(255,255,255,0.8)" },
  codeRow: { marginTop: 8 },
  codeBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    borderStyle: "dashed",
  },
  codeText: { fontFamily: "Inter_700Bold", fontSize: 13, color: "#FFF", letterSpacing: 1.5 },
  expires: { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(255,255,255,0.6)" },
  offerArrow: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  requestBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 24,
    padding: 20,
  },
  requestLeft: { flex: 1, gap: 4 },
  requestTitle: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5 },
  requestSub: { fontFamily: "Inter_400Regular", fontSize: 13 },
  requestIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
