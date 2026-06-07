import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { spacing } from "@/constants/spacing";

type Props = {
  title: string;
  right?: React.ReactNode;
  onBack?: () => void;
  transparent?: boolean;
};

export function BackHeader({ title, right, onBack, transparent }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View
      style={[
        styles.header,
        { paddingTop: topPad + 16 },
        !transparent && { backgroundColor: colors.background },
      ]}
    >
      <Pressable
        onPress={onBack ?? (() => router.back())}
        style={[styles.backBtn, { backgroundColor: transparent ? "rgba(247,245,240,0.2)" : colors.card }]}
        hitSlop={8}
      >
        <Feather name="arrow-left" size={20} color={transparent ? "#FFF" : colors.primary} />
      </Pressable>
      <Text
        style={[styles.title, { color: transparent ? "#FFF" : colors.primary }]}
        numberOfLines={1}
      >
        {title}
      </Text>
      <View style={styles.right}>{right ?? <View style={{ width: 40 }} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.pagePadding,
    paddingBottom: 16,
    gap: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    letterSpacing: -0.3,
  },
  right: {
    alignItems: "flex-end",
    minWidth: 40,
  },
});
