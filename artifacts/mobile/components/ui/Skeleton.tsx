import React, { useEffect } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";

type SkeletonProps = {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function Skeleton({ width = "100%", height = 16, borderRadius = 8, style }: SkeletonProps) {
  const colors = useColors();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.shimmer1,
        },
        animStyle,
        style,
      ]}
    />
  );
}

export function ProductCardSkeleton() {
  const colors = useColors();
  return (
    <Animated.View style={[styles.productCard, { backgroundColor: colors.card }]}>
      <Skeleton height={120} borderRadius={16} />
      <Skeleton width="70%" height={14} style={{ marginTop: 12 }} />
      <Skeleton width="40%" height={12} style={{ marginTop: 6 }} />
      <Skeleton height={36} borderRadius={999} style={{ marginTop: 12 }} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  skeleton: {},
  productCard: {
    width: 160,
    borderRadius: 24,
    padding: 16,
    marginRight: 12,
  },
});
