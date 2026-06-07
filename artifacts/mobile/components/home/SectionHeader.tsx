import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { typography } from "@/constants/typography";

type SectionHeaderProps = {
  title: string;
  seeAllHref?: string;
  onSeeAll?: () => void;
};

export function SectionHeader({ title, seeAllHref, onSeeAll }: SectionHeaderProps) {
  const colors = useColors();

  const handleSeeAll = () => {
    if (onSeeAll) {
      onSeeAll();
    } else if (seeAllHref) {
      router.push(seeAllHref as any);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      {(seeAllHref || onSeeAll) && (
        <Pressable onPress={handleSeeAll}>
          <Text style={[styles.seeAll, { color: colors.accentOrange }]}>See all</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    ...typography.sectionTitle,
  },
  seeAll: {
    ...typography.smallMedium,
    fontFamily: "Inter_600SemiBold",
  },
});
