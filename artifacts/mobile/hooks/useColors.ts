import colors from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";

/**
 * Returns the design tokens for the current resolved color scheme.
 * Uses ThemeContext which defaults to light mode.
 * Users can override via Appearance settings (theme + accent color).
 */
export function useColors() {
  const { resolved, accentColor } = useTheme();
  const palette = resolved === "dark" ? colors.dark : colors.light;
  return {
    ...palette,
    accentOrange: accentColor,
    tint: accentColor,
    accent: accentColor,
    radius: colors.radius,
  };
}
