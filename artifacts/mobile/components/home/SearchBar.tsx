import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { shadows } from "@/constants/spacing";
import { typography } from "@/constants/typography";

type SearchBarProps = {
  placeholder?: string;
  onVoice?: () => void;
  onImage?: () => void;
};

export function SearchBar({
  placeholder = "Search for anything...",
  onVoice,
  onImage,
}: SearchBarProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, shadows.card]}>
      <Pressable
        style={styles.searchArea}
        onPress={() => router.push("/search")}
      >
        <Feather name="search" size={20} color={colors.mutedForeground} />
        <Text style={[styles.placeholder, { color: colors.mutedForeground }]}>
          {placeholder}
        </Text>
      </Pressable>
      <View style={styles.actions}>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: colors.muted }]}
          onPress={onVoice}
        >
          <Feather name="mic" size={16} color={colors.secondary} />
        </Pressable>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: colors.muted }]}
          onPress={onImage}
        >
          <Feather name="camera" size={16} color={colors.secondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 14,
    gap: 12,
  },
  searchArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  placeholder: {
    ...typography.body,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
