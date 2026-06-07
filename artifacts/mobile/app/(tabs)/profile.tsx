import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

type MenuItem = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  subtitle?: string;
  route?: string;
  color?: string;
  action?: () => void;
};

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + spacing.tabBarHeight;

  const MENU_SECTIONS: { title: string; items: MenuItem[] }[] = [
    {
      title: "Account",
      items: [
        { icon: "user", label: "Personal Information", route: "/profile/personal" },
        { icon: "map-pin", label: "Saved Addresses", route: "/profile/addresses" },
        { icon: "credit-card", label: "Payment Methods", route: "/order/payment" },
        { icon: "bell", label: "Notification Preferences", subtitle: "All on", route: "/profile/personal" },
      ],
    },
    {
      title: "Rewards",
      items: [
        { icon: "award", label: "Rewards Dashboard", subtitle: "450 pts", color: colors.accentOrange, route: "/profile/rewards" },
        { icon: "users", label: "Invite Friends", subtitle: "Earn ₹200 per referral", route: "/profile/referral" },
        { icon: "gift", label: "Cashback History", route: "/profile/wallet-history" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: "help-circle", label: "Help Center", route: "/profile/help" },
        { icon: "message-circle", label: "Chat with Support", route: "/chat/support" },
        { icon: "file-text", label: "Terms & Privacy", route: "/profile/personal" },
      ],
    },
    {
      title: "",
      items: [
        { icon: "log-out", label: "Sign Out", color: colors.danger, action: logout },
      ],
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: botPad }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.title, { color: colors.primary }]}>Profile</Text>
        <Pressable
          style={[styles.settingsBtn, { backgroundColor: colors.card }, shadows.sm]}
          onPress={() => router.push("/profile/personal" as any)}
        >
          <Feather name="settings" size={18} color={colors.primary} />
        </Pressable>
      </View>

      {/* Profile Card */}
      <View style={styles.profileWrap}>
        <View style={[styles.profileCard, { backgroundColor: colors.card }, shadows.card]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarLetter, { color: colors.primaryForeground }]}>
              {user?.name?.charAt(0).toUpperCase() ?? "A"}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.primary }]}>
              {user?.name ?? "User"}
            </Text>
            <Text style={[styles.profilePhone, { color: colors.secondary }]}>
              +91 {user?.phone ?? ""}
            </Text>
          </View>
          <View style={[styles.walletMini, { backgroundColor: colors.muted }]}>
            <Feather name="credit-card" size={14} color={colors.accentOrange} />
            <Text style={[styles.walletAmt, { color: colors.primary }]}>
              ₹{user?.walletBalance?.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={[styles.statsRow, { paddingHorizontal: spacing.pagePadding }]}>
        {[
          { label: "Orders", value: "12" },
          { label: "Points", value: "450" },
          { label: "Referrals", value: "3" },
        ].map((s, i) => (
          <View
            key={s.label}
            style={[
              styles.statItem,
              { backgroundColor: colors.card },
              shadows.sm,
              i === 1 && { backgroundColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.statVal,
                { color: i === 1 ? colors.primaryForeground : colors.primary },
              ]}
            >
              {s.value}
            </Text>
            <Text
              style={[
                styles.statLbl,
                { color: i === 1 ? "rgba(247,245,240,0.6)" : colors.mutedForeground },
              ]}
            >
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      {MENU_SECTIONS.map((section) => (
        <View key={section.title || "danger"} style={styles.menuSection}>
          {section.title ? (
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
              {section.title}
            </Text>
          ) : null}
          <View style={[styles.menuCard, { backgroundColor: colors.card }, shadows.sm]}>
            {section.items.map((item, idx) => (
              <View key={item.label}>
                {idx > 0 && (
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                )}
                <Pressable
                  onPress={() => {
                    if (item.action) item.action();
                    else if (item.route) router.push(item.route as any);
                  }}
                  style={styles.menuItem}
                >
                  <View
                    style={[
                      styles.menuIcon,
                      { backgroundColor: item.color ? `${item.color}15` : colors.muted },
                    ]}
                  >
                    <Feather
                      name={item.icon}
                      size={17}
                      color={item.color ?? colors.secondary}
                    />
                  </View>
                  <View style={styles.menuText}>
                    <Text
                      style={[
                        styles.menuLabel,
                        { color: item.color ?? colors.primary },
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.subtitle && (
                      <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>
                        {item.subtitle}
                      </Text>
                    )}
                  </View>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      ))}

      <Text style={[styles.version, { color: colors.mutedForeground }]}>
        Bringo v1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.pagePadding,
    paddingBottom: 16,
  },
  title: { ...typography.h2 },
  settingsBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  profileWrap: { paddingHorizontal: spacing.pagePadding, marginBottom: 16 },
  profileCard: {
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: { fontSize: 28, fontFamily: "Inter_700Bold" },
  profileInfo: { flex: 1, gap: 2 },
  profileName: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: -0.5 },
  profilePhone: { fontFamily: "Inter_400Regular", fontSize: 14 },
  walletMini: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  walletAmt: { fontFamily: "Inter_700Bold", fontSize: 14 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  statItem: { flex: 1, borderRadius: 16, padding: 16, gap: 4, alignItems: "center" },
  statVal: { fontFamily: "Inter_700Bold", fontSize: 22 },
  statLbl: { fontFamily: "Inter_400Regular", fontSize: 11 },
  menuSection: { paddingHorizontal: spacing.pagePadding, marginBottom: 16 },
  sectionLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  menuCard: { borderRadius: 20, overflow: "hidden" },
  divider: { height: 1, marginHorizontal: 16 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 14,
  },
  menuIcon: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  menuText: { flex: 1, gap: 1 },
  menuLabel: { fontFamily: "Inter_500Medium", fontSize: 15 },
  menuSub: { fontFamily: "Inter_400Regular", fontSize: 12 },
  version: { textAlign: "center", fontFamily: "Inter_400Regular", fontSize: 12, marginVertical: 20 },
});
