import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { typography } from "@/constants/typography";
import { Button } from "@/components/ui/Button";

type EmptyStateProps = {
  title: string;
  message?: string;
  icon?: keyof typeof Feather.glyphMap;
  image?: "empty" | "success";
  actionLabel?: string;
  onAction?: () => void;
};

const IMAGES = {
  empty: require("@/assets/images/empty_state.png"),
  success: require("@/assets/images/success_state.png"),
};

export function EmptyState({
  title,
  message,
  icon = "inbox",
  image,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      {image ? (
        <Image source={IMAGES[image]} style={styles.image} resizeMode="contain" />
      ) : (
        <View style={[styles.iconContainer, { backgroundColor: colors.muted }]}>
          <Feather name={icon} size={32} color={colors.mutedForeground} />
        </View>
      )}
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      {message && (
        <Text style={[styles.message, { color: colors.mutedForeground }]}>{message}</Text>
      )}
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          onPress={onAction}
          style={styles.action}
          fullWidth={false}
          size="md"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 48,
    gap: 12,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 8,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    ...typography.h4,
    textAlign: "center",
  },
  message: {
    ...typography.body,
    textAlign: "center",
    lineHeight: 22,
  },
  action: {
    marginTop: 8,
    paddingHorizontal: 32,
  },
});
