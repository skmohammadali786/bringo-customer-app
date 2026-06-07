import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { spacing } from "@/constants/spacing";

export default function PrimeSuccessScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 32;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const PERKS = ["Free delivery forever", "Priority express delivery", "Member discounts activated", "2× cashback earned"];

  return (
    <View style={[styles.container, { backgroundColor: colors.primary, paddingBottom: botPad }]}>
      {/* Badge */}
      <Animated.View style={[styles.badgeWrap, { transform: [{ scale: scaleAnim }] }]}>
        <View style={[styles.outerRing, { borderColor: "rgba(255,154,61,0.3)" }]}>
          <View style={[styles.innerRing, { borderColor: "rgba(255,154,61,0.6)" }]}>
            <View style={[styles.badge, { backgroundColor: colors.accentOrange }]}>
              <Feather name="award" size={48} color="#FFF" />
            </View>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.content, { opacity: opacityAnim }]}>
        <Text style={[styles.heading, { color: colors.primaryForeground }]}>Welcome to Prime!</Text>
        <Text style={[styles.sub, { color: "rgba(247,245,240,0.7)" }]}>
          You now have access to exclusive benefits and the fastest deliveries.
        </Text>

        <View style={styles.perksList}>
          {PERKS.map((perk, i) => (
            <View key={perk} style={[styles.perkRow, { backgroundColor: "rgba(255,255,255,0.08)" }]}>
              <View style={[styles.perkNum, { backgroundColor: colors.accentOrange }]}>
                <Text style={styles.perkNumText}>{i + 1}</Text>
              </View>
              <Text style={[styles.perkText, { color: colors.primaryForeground }]}>{perk}</Text>
              <Feather name="check-circle" size={16} color={colors.accentGreen} />
            </View>
          ))}
        </View>

        <View style={styles.bottomActions}>
          <Button label="Start exploring" onPress={() => router.replace("/(tabs)" as any)} variant="primary"
            style={[styles.ctaBtn, { backgroundColor: colors.accentOrange }]} />
          <Button label="View Prime benefits" onPress={() => router.replace("/prime" as any)} variant="outline"
            style={styles.outlineBtn} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.pagePadding, gap: 36 },
  badgeWrap: { alignItems: "center", justifyContent: "center" },
  outerRing: { width: 180, height: 180, borderRadius: 90, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  innerRing: { width: 150, height: 150, borderRadius: 75, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  badge: { width: 116, height: 116, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  content: { alignItems: "center", gap: 20, width: "100%" },
  heading: { fontFamily: "Inter_700Bold", fontSize: 34, letterSpacing: -1.5, textAlign: "center" },
  sub: { fontFamily: "Inter_400Regular", fontSize: 15, textAlign: "center", lineHeight: 22 },
  perksList: { width: "100%", gap: 8 },
  perkRow: { borderRadius: 14, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  perkNum: { width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  perkNumText: { fontFamily: "Inter_700Bold", fontSize: 12, color: "#FFF" },
  perkText: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 14 },
  bottomActions: { width: "100%", gap: 10 },
  ctaBtn: { width: "100%" },
  outlineBtn: { width: "100%", borderColor: "rgba(247,245,240,0.3)" },
});
