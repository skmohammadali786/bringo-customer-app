import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

export default function ManageAccountScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  type ManageItem = {
    label: string;
    icon: React.ComponentProps<typeof Feather>["name"];
    route?: string;
    action?: () => void;
    color?: string;
  };
  type ManageSection = { title: string; items: ManageItem[] };

  const SECTIONS: ManageSection[] = [
    {
      title: "Account",
      items: [
        { label: "Personal information", icon: "user", route: "/profile/personal" },
        { label: "Saved addresses", icon: "map-pin", route: "/profile/addresses" },
        { label: "Payment methods", icon: "credit-card", route: "/profile/payment-methods" },
        { label: "Linked devices", icon: "smartphone" },
      ],
    },
    {
      title: "Security",
      items: [
        { label: "Change phone number", icon: "phone" },
        { label: "Two-factor auth", icon: "shield" },
        { label: "Login history", icon: "clock" },
      ],
    },
    {
      title: "Data",
      items: [
        { label: "Download my data", icon: "download" },
        { label: "Privacy settings", icon: "eye", route: "/profile/privacy" },
      ],
    },
    {
      title: "Danger zone",
      items: [
        { label: "Sign out of all devices", icon: "log-out", color: colors.danger, action: logout },
        { label: "Delete account", icon: "trash-2", color: colors.danger, route: "/profile/delete" },
      ],
    },
  ];

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Manage account" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        <View style={[styles.profileRow, { backgroundColor: colors.card }, shadows.card]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarLetter, { color: colors.primaryForeground }]}>
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </Text>
          </View>
          <View>
            <Text style={[styles.userName, { color: colors.primary }]}>{user?.name ?? "User"}</Text>
            <Text style={[styles.userPhone, { color: colors.mutedForeground }]}>+91 {user?.phone ?? ""}</Text>
            <View style={[styles.verifiedBadge, { backgroundColor: colors.accentGreen + "18" }]}>
              <Feather name="check-circle" size={12} color={colors.accentGreen} />
              <Text style={[styles.verifiedText, { color: colors.accentGreen }]}>Verified</Text>
            </View>
          </View>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{section.title.toUpperCase()}</Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.card }, shadows.sm]}>
              {section.items.map((item, i) => (
                <View key={item.label}>
                  {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                  <Pressable style={styles.itemRow}
                    onPress={() => { if (item.action) item.action(); else if (item.route) router.push(item.route as any); }}>
                    <View style={[styles.itemIcon, { backgroundColor: item.color ? item.color + "15" : colors.muted }]}>
                      <Feather name={item.icon} size={16} color={item.color ?? colors.secondary} />
                    </View>
                    <Text style={[styles.itemLabel, { color: item.color ?? colors.primary }]}>{item.label}</Text>
                    <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 20 },
  profileRow: { borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  avatarLetter: { fontFamily: "Inter_700Bold", fontSize: 24 },
  userName: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5 },
  userPhone: { fontFamily: "Inter_400Regular", fontSize: 13 },
  verifiedBadge: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4, alignSelf: "flex-start" },
  verifiedText: { fontFamily: "Inter_500Medium", fontSize: 11 },
  section: { gap: 8 },
  sectionLabel: { fontFamily: "Inter_500Medium", fontSize: 11, letterSpacing: 1 },
  sectionCard: { borderRadius: 18, overflow: "hidden" },
  divider: { height: 1, marginHorizontal: 14 },
  itemRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  itemIcon: { width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  itemLabel: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 14 },
});
