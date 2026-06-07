import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";

export type ThemePreference = "light" | "dark" | "system";

type ThemeContextType = {
  preference: ThemePreference;
  resolved: "light" | "dark";
  setPreference: (pref: ThemePreference) => Promise<void>;
  accentColor: string;
  setAccentColor: (color: string) => Promise<void>;
};

const DEFAULT_ACCENT = "#FF9A3D";

const ThemeContext = createContext<ThemeContextType>({
  preference: "light",
  resolved: "light",
  setPreference: async () => {},
  accentColor: DEFAULT_ACCENT,
  setAccentColor: async () => {},
});

const STORAGE_KEY = "@bringo_theme";
const ACCENT_KEY = "@bringo_accent";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>("light");
  const [accentColor, setAccentState] = useState<string>(DEFAULT_ACCENT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_KEY),
      AsyncStorage.getItem(ACCENT_KEY),
    ]).then(([themeVal, accentVal]) => {
      if (themeVal === "light" || themeVal === "dark" || themeVal === "system") {
        setPreferenceState(themeVal);
      }
      if (accentVal) {
        setAccentState(accentVal);
      }
      setLoaded(true);
    });
  }, []);

  const resolved: "light" | "dark" =
    preference === "system"
      ? systemScheme === "dark"
        ? "dark"
        : "light"
      : preference;

  const setPreference = useCallback(async (pref: ThemePreference) => {
    setPreferenceState(pref);
    await AsyncStorage.setItem(STORAGE_KEY, pref);
  }, []);

  const setAccentColor = useCallback(async (color: string) => {
    setAccentState(color);
    await AsyncStorage.setItem(ACCENT_KEY, color);
  }, []);

  return (
    <ThemeContext.Provider value={{ preference, resolved, setPreference, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
