import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  walletBalance: number;
  isNewUser: boolean;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
};

type AuthContextType = AuthState & {
  login: (phone: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  markOnboardingSeen: () => Promise<void>;
  updateWallet: (amount: number) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEYS = {
  USER: "@bringo_user",
  ONBOARDING: "@bringo_onboarding",
};

const DEFAULT_USER: User = {
  id: "user_001",
  name: "Alex",
  phone: "",
  walletBalance: 1514,
  isNewUser: false,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    hasSeenOnboarding: false,
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [userJson, onboardingDone] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING),
      ]);

      const user = userJson ? (JSON.parse(userJson) as User) : null;
      setState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
        hasSeenOnboarding: onboardingDone === "true",
      });
    } catch {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const login = useCallback(async (phone: string, name?: string) => {
    const user: User = {
      ...DEFAULT_USER,
      phone,
      name: name || DEFAULT_USER.name,
    };
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    setState((prev) => ({ ...prev, user, isAuthenticated: true }));
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    setState((prev) => ({ ...prev, user: null, isAuthenticated: false }));
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const updated = { ...prev.user, ...updates };
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return { ...prev, user: updated };
    });
  }, []);

  const markOnboardingSeen = useCallback(async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, "true");
    setState((prev) => ({ ...prev, hasSeenOnboarding: true }));
  }, []);

  const updateWallet = useCallback((amount: number) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const updated = { ...prev.user, walletBalance: prev.user.walletBalance + amount };
      AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return { ...prev, user: updated };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, updateUser, markOnboardingSeen, updateWallet }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
