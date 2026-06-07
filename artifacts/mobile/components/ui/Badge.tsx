import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "outline";

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  style?: ViewStyle;
};

export function Badge({ label, variant = "default", size = "sm", style }: BadgeProps) {
  const colors = useColors();

  const bgMap: Record<BadgeVariant, string> = {
    default: colors.muted,
    success: "rgba(52,199,89,0.15)",
    warning: "rgba(255,154,61,0.15)",
    error: "rgba(255,77,79,0.15)",
    info: "rgba(74,144,226,0.15)",
    outline: "transparent",
  };

  const textMap: Record<BadgeVariant, string> = {
    default: colors.secondary,
    success: colors.accentGreen,
    warning: colors.accentOrange,
    error: colors.danger,
    info: colors.accentBlue,
    outline: colors.primary,
  };

  const heights: Record<string, number> = { sm: 22, md: 28 };
  const fontSizes: Record<string, number> = { sm: 11, md: 13 };
  const paddings: Record<string, number> = { sm: 8, md: 12 };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bgMap[variant],
          height: heights[size],
          paddingHorizontal: paddings[size],
          borderWidth: variant === "outline" ? 1 : 0,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: textMap[variant], fontSize: fontSizes[size] },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.2,
  },
});
