import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { spacing } from "@/constants/spacing";

const { width } = Dimensions.get("window");

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  image: number;
};

const SLIDES: Slide[] = [
  {
    id: "1",
    title: "Order anything\nnearby",
    subtitle:
      "From groceries to gadgets — we source products from local stores and deliver them to you.",
    image: require("@/assets/images/onboarding1.png"),
  },
  {
    id: "2",
    title: "Your personal\ndelivery agent",
    subtitle:
      "Our dedicated agents find, pick, and deliver your order in minutes — no store visits needed.",
    image: require("@/assets/images/onboarding2.png"),
  },
  {
    id: "3",
    title: "Fast, fresh,\nevery time",
    subtitle:
      "Track your order live and chat with your agent. Premium delivery, right to your door.",
    image: require("@/assets/images/onboarding3.png"),
  },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { markOnboardingSeen } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scale = useSharedValue(1);

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isLast = currentIndex === SLIDES.length - 1;

  const handleNext = async () => {
    scale.value = withSpring(0.95, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });
    if (isLast) {
      await markOnboardingSeen();
      router.replace("/(auth)/welcome");
    } else {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const handleSkip = async () => {
    await markOnboardingSeen();
    router.replace("/(auth)/welcome");
  };

  const renderItem: ListRenderItem<Slide> = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.illustration} resizeMode="contain" />
      <View style={styles.textWrap}>
        <Text style={[styles.title, { color: colors.primary }]}>{item.title}</Text>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>{item.subtitle}</Text>
      </View>
    </View>
  );

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingTop: topPad + 16 }]}>
        <View style={[styles.logoBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.logoLetter, { color: colors.primaryForeground }]}>B</Text>
        </View>
        {!isLast && (
          <Pressable onPress={handleSkip}>
            <Text style={[styles.skip, { color: colors.mutedForeground }]}>Skip</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={styles.flatList}
      />

      <View
        style={[
          styles.bottom,
          { paddingBottom: Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 32 },
        ]}
      >
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === currentIndex ? colors.primary : colors.muted,
                  width: i === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <Animated.View style={[styles.btnWrap, btnStyle]}>
          <Pressable
            onPress={handleNext}
            style={[styles.nextBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.nextText, { color: colors.primaryForeground }]}>
              {isLast ? "Get Started" : "Continue"}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.pagePadding,
    paddingBottom: 8,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: { fontSize: 20, fontFamily: "Inter_700Bold" },
  skip: { fontSize: 15, fontFamily: "Inter_500Medium" },
  flatList: { flex: 1 },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.pagePadding,
  },
  illustration: {
    width: width * 0.75,
    height: width * 0.75,
    marginBottom: 40,
  },
  textWrap: { alignItems: "center", gap: 14 },
  title: {
    fontSize: 38,
    fontFamily: "Inter_700Bold",
    letterSpacing: -1.5,
    textAlign: "center",
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  bottom: {
    paddingHorizontal: spacing.pagePadding,
    gap: 24,
    alignItems: "center",
  },
  dots: { flexDirection: "row", gap: 6, alignItems: "center" },
  dot: { height: 8, borderRadius: 4 },
  btnWrap: { width: "100%" },
  nextBtn: {
    height: 60,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  nextText: { fontSize: 17, fontFamily: "Inter_600SemiBold", letterSpacing: -0.2 },
});
