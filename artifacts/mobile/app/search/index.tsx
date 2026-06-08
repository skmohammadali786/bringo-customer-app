import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated as RNAnimated,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
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
  "Green tea",
  "Yoga mat",
  "Dog food",
];

const RECENT = ["Organic milk", "USB charger", "Bread"];

type SearchMode = "text" | "voice" | "image";

export default function SearchScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("text");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  useEffect(() => {
    if (mode === "voice") {
      handleVoiceSearch();
    } else if (mode === "image") {
      handleImageSearch();
    }
  }, []);

  useEffect(() => {
    if (voiceActive) {
      const pulse = RNAnimated.loop(
        RNAnimated.sequence([
          RNAnimated.timing(pulseAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
          RNAnimated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      pulse.start();
      const timeout = setTimeout(() => {
        pulse.stop();
        setVoiceActive(false);
        setSearchMode("text");
        inputRef.current?.focus();
      }, 5000);
      return () => {
        pulse.stop();
        clearTimeout(timeout);
      };
    }
  }, [voiceActive]);

  const results = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const showEmpty = query.trim() && results.length === 0;

  const handleVoiceSearch = () => {
    setImageUri(null);
    setSearchMode("voice");
    setVoiceActive(true);
  };

  const handleImageSearch = async () => {
    if (Platform.OS === "web") {
      setSearchMode("text");
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      const libStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (libStatus.status !== "granted") return;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        setSearchMode("image");
        setTimeout(() => {
          setSearchMode("text");
          setImageUri(null);
          inputRef.current?.focus();
        }, 2500);
      }
    } else {
      const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
        setSearchMode("image");
        setTimeout(() => {
          setSearchMode("text");
          setImageUri(null);
          inputRef.current?.focus();
        }, 2500);
      }
    }
  };

  const handleBackToText = () => {
    setSearchMode("text");
    setVoiceActive(false);
    setImageUri(null);
    inputRef.current?.focus();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search header */}
      <Animated.View
        entering={FadeIn.duration(300)}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
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
          {query.length > 0 ? (
            <Pressable onPress={() => setQuery("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          ) : (
            <Pressable onPress={handleImageSearch} hitSlop={8}>
              <Feather name="camera" size={17} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
        <Pressable
          style={[
            styles.voiceBtn,
            { backgroundColor: voiceActive ? colors.danger : colors.card },
            shadows.sm,
          ]}
          onPress={voiceActive ? handleBackToText : handleVoiceSearch}
        >
          <RNAnimated.View style={{ transform: [{ scale: voiceActive ? pulseAnim : 1 }] }}>
            <Feather
              name="mic"
              size={18}
              color={voiceActive ? "#FFF" : colors.primary}
            />
          </RNAnimated.View>
        </Pressable>
      </Animated.View>

      {/* Voice overlay */}
      {searchMode === "voice" && voiceActive && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[styles.modeOverlay, { backgroundColor: colors.background }]}
        >
          <View style={[styles.voiceCircle, { backgroundColor: colors.danger + "18" }]}>
            <RNAnimated.View
              style={[
                styles.voicePulse,
                { backgroundColor: colors.danger + "30", transform: [{ scale: pulseAnim }] },
              ]}
            />
            <View style={[styles.voiceInner, { backgroundColor: colors.danger }]}>
              <Feather name="mic" size={32} color="#FFF" />
            </View>
          </View>
          <Text style={[styles.voiceTitle, { color: colors.primary }]}>Listening...</Text>
          <Text style={[styles.voiceSub, { color: colors.mutedForeground }]}>
            Speak the product name clearly
          </Text>
          <Pressable
            style={[styles.voiceCancelBtn, { backgroundColor: colors.muted }]}
            onPress={handleBackToText}
          >
            <Text style={[styles.voiceCancelText, { color: colors.primary }]}>Cancel</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Image search overlay */}
      {searchMode === "image" && imageUri && (
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[styles.modeOverlay, { backgroundColor: colors.background }]}
        >
          <View style={styles.imgPreviewWrap}>
            <Image source={{ uri: imageUri }} style={styles.imgPreview} resizeMode="cover" />
            <View style={[styles.imgScanLine, { backgroundColor: colors.accentOrange }]} />
          </View>
          <Text style={[styles.voiceTitle, { color: colors.primary }]}>Searching by image...</Text>
          <Text style={[styles.voiceSub, { color: colors.mutedForeground }]}>
            Identifying product from your photo
          </Text>
        </Animated.View>
      )}

      {/* Normal search UI */}
      {searchMode === "text" && (
        <>
          {query.trim().length > 0 && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <Pressable
                style={[styles.filterBar, { borderBottomColor: colors.border }]}
                onPress={() =>
                  router.push({
                    pathname: "/search/filters" as any,
                    params: { q: query },
                  })
                }
              >
                <Feather name="sliders" size={14} color={colors.accentOrange} />
                <Text style={[styles.filterText, { color: colors.accentOrange }]}>
                  Filters & sort
                </Text>
                <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </Text>
              </Pressable>
            </Animated.View>
          )}

          {!query.trim() ? (
            <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.suggestions}>
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
            </Animated.View>
          ) : showEmpty ? (
            <Animated.View entering={FadeInDown.duration(400)} style={styles.emptyWrap}>
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
            </Animated.View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.resultList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <Animated.View entering={FadeInDown.duration(300).delay(index * 50)}>
                  <ProductCard
                    product={item}
                    width={(360 - spacing.pagePadding * 2 - 12) / 2}
                    onPress={() => router.push(`/product/${item.id}` as any)}
                    onAdd={() => addItem(item)}
                  />
                </Animated.View>
              )}
            />
          )}
        </>
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
    flex: 1, flexDirection: "row", alignItems: "center",
    gap: 10, borderRadius: 16, paddingHorizontal: 14, height: 48,
  },
  input: { flex: 1, fontSize: 16 },
  voiceBtn: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  filterBar: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: spacing.pagePadding, paddingVertical: 10,
    borderBottomWidth: 1, gap: 6,
  },
  filterText: { fontFamily: "Inter_600SemiBold", fontSize: 13, flex: 1 },
  resultCount: { fontFamily: "Inter_400Regular", fontSize: 12 },
  suggestions: { paddingHorizontal: spacing.pagePadding, paddingTop: 8 },
  sectionTitle: { ...typography.sectionTitle, marginBottom: 12 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row", alignItems: "center",
    gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
  },
  chipText: { fontFamily: "Inter_400Regular", fontSize: 14 },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 12 },
  emptyTitle: { ...typography.h4, textAlign: "center" },
  emptyDesc: { ...typography.body, textAlign: "center" },
  requestBtn: { marginTop: 8, borderRadius: 999, paddingHorizontal: 24, paddingVertical: 14 },
  requestText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  resultList: { paddingHorizontal: spacing.pagePadding, paddingBottom: 40, gap: 12 },
  row: { gap: 12 },
  modeOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center", justifyContent: "center",
    gap: 20, zIndex: 10, paddingTop: 120,
  },
  voiceCircle: {
    width: 160, height: 160, borderRadius: 80,
    alignItems: "center", justifyContent: "center",
  },
  voicePulse: { position: "absolute", width: 130, height: 130, borderRadius: 65 },
  voiceInner: { width: 88, height: 88, borderRadius: 44, alignItems: "center", justifyContent: "center" },
  voiceTitle: { fontFamily: "Inter_700Bold", fontSize: 24, letterSpacing: -0.5 },
  voiceSub: { fontFamily: "Inter_400Regular", fontSize: 15, textAlign: "center", maxWidth: 260 },
  voiceCancelBtn: { marginTop: 12, borderRadius: 999, paddingHorizontal: 28, paddingVertical: 14 },
  voiceCancelText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  imgPreviewWrap: { width: 220, height: 220, borderRadius: 24, overflow: "hidden", position: "relative" },
  imgPreview: { width: "100%", height: "100%" },
  imgScanLine: { position: "absolute", left: 0, right: 0, height: 2, top: "50%", opacity: 0.8 },
});
