import React, { forwardRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { typography } from "@/constants/typography";
import { shadows } from "@/constants/spacing";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  floating?: boolean;
};

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerStyle, prefix, suffix, floating, style, ...props }, ref) => {
    const colors = useColors();
    const [isFocused, setIsFocused] = useState(false);

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Text style={[styles.label, { color: colors.secondary }]}>{label}</Text>
        )}
        <View
          style={[
            styles.inputWrapper,
            {
              backgroundColor: floating ? colors.card : colors.input,
              borderRadius: 16,
              borderColor: isFocused
                ? colors.primary
                : error
                ? colors.danger
                : "transparent",
              borderWidth: isFocused || error ? 1.5 : 0,
            },
            floating && shadows.card,
          ]}
        >
          {prefix && <View style={styles.prefix}>{prefix}</View>}
          <TextInput
            ref={ref}
            {...props}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            style={[
              styles.input,
              {
                color: colors.foreground,
                fontFamily: "Inter_400Regular",
              },
              prefix && styles.inputWithPrefix,
              suffix && styles.inputWithSuffix,
              style,
            ]}
            placeholderTextColor={colors.mutedForeground}
          />
          {suffix && <View style={styles.suffix}>{suffix}</View>}
        </View>
        {error && (
          <Text style={[styles.error, { color: colors.danger }]}>{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  container: { gap: 8 },
  label: {
    ...typography.label,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
  },
  inputWithPrefix: { paddingLeft: 8 },
  inputWithSuffix: { paddingRight: 8 },
  prefix: { marginRight: 4 },
  suffix: { marginLeft: 4 },
  error: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});
