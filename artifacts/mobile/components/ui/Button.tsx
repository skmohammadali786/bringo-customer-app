import * as Haptics from "expo-haptics";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { typography } from "@/constants/typography";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "orange";

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  style?: ViewStyle;
  fullWidth?: boolean;
};

export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  size = "lg",
  style,
  fullWidth = true,
}: ButtonProps) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress();
  };

  const heights: Record<string, number> = { sm: 44, md: 52, lg: 60 };
  const fontSizes: Record<string, number> = { sm: 14, md: 15, lg: 17 };

  const bgColors: Record<Variant, string> = {
    primary: colors.primary,
    secondary: colors.muted,
    ghost: "transparent",
    danger: colors.danger,
    orange: colors.accentOrange,
  };

  const textColors: Record<Variant, string> = {
    primary: colors.primaryForeground,
    secondary: colors.foreground,
    ghost: colors.primary,
    danger: "#FFFFFF",
    orange: "#FFFFFF",
  };

  return (
    <Animated.View style={[animStyle, fullWidth && styles.fullWidth, style]}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          styles.button,
          {
            height: heights[size],
            backgroundColor: disabled ? colors.muted : bgColors[variant],
          },
          variant === "ghost" && styles.ghostBorder,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={textColors[variant]} size="small" />
        ) : (
          <Text
            style={[
              styles.label,
              {
                color: disabled ? colors.mutedForeground : textColors[variant],
                fontSize: fontSizes[size],
              },
            ]}
          >
            {label}
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullWidth: { width: "100%" },
  button: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    letterSpacing: -0.2,
  },
  ghostBorder: {
    borderWidth: 1.5,
    borderColor: "rgba(17,17,17,0.15)",
  },
});
