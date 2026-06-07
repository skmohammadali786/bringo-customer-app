import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";
import { shadows } from "@/constants/spacing";

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  radius?: number;
  shadow?: "none" | "sm" | "md" | "lg" | "card";
};

export function Card({
  children,
  style,
  padding = 20,
  radius,
  shadow = "card",
}: CardProps) {
  const colors = useColors();
  const borderRadius = radius ?? colors.radius;
  const shadowStyle = shadow !== "none" ? shadows[shadow] : {};

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderRadius, padding },
        shadowStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
});
