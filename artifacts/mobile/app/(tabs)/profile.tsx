import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
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
  const { user, logout, updateUser } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [signOutVisible, setSignOutVisible] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + spacing.tabBarHeight;

  const handleSignOut = () => {
    setSignOutVisible(true);
  };

  const confirmSignOut = async () => {
    setSignOutVisible(false);
    await logout();
    router.replace("/(auth)/welcome" as any);
  };

  const handlePhotoUpload = async () => {
    if (Platform.OS === "web") {
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setAvatar(uri);
      updateUser({ avatar: uri });
    }
  };

  const MENU_SECTIONS: { title: string; items: MenuItem[] }[] = [
    {
      title: "Account",
      items: [
        { icon: "user", label: "Personal Information", route: "/profile/personal" },
        { icon: "map-pin", label: "Saved Addresses", route: "/profile/addresses" },
        { icon: "credit-card", label: "Payment Methods", route: "/profile/payment-methods" },
        {
          icon: "bell",
          label: "Notification Preferences",
          subtitle: "All on",
          route: "/notifications/settings",
        },
      ],
    },
    {
      title: "Shopping",
      items: [
        {
          icon: "heart",
          label: "Saved / Wishlist",
          route: "/wishlist",
        },
        { icon: "clock", label: "Order History", route: "/(tabs)/orders" },
      ],
    },
    {
      title: "Appearance",
      items: [
        {
          icon: "sun",
          label: "Theme & Appearance",
          subtitle: "Light / Dark / System",
          route: "/profile/appearance",
        },
      ],
    },
    {
      title: "Rewards",
      items: [
        {
          icon: "award",
          label: "Rewards Dashboard",
          subtitle: "450 pts",
          route: "/profile/rewards",
        },
        {
          icon: "users",
          label: "Invite Friends",
          subtitle: "Earn ₹200 per referral",
          route: "/invite",
        },
        { icon: "gift", label: "Cashback History", route: "/profile/wallet-history" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: "help-circle", label: "Help Center", route: "/profile/help" },
        { icon: "message-circle", label: "Chat with Support", route: "/chat/support" },
        { icon: "file-text", label: "Terms of Service", route: "/profile/terms" },
        { icon: "shield", label: "Privacy & Data", route: "/profile/privacy" },
      ],
    },
    {
      title: "",
      items: [
        {
          icon: "log-out",
          label: "Sign Out",
          color: colors.danger,
          action: handleSignOut,
        },
      ],
    },
  ];

  const displayAvatar = avatar || user?.avatar;

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingBottom: botPad }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(400).delay(0)}
          style={[styles.header, { paddingTop: topPad + 16 }]}
        >
          <Text style={[styles.title, { color: colors.primary }]}>Profile</Text>
          <Pressable
            style={[styles.settingsBtn, { backgroundColor: colors.card }, shadows.sm]}
            onPress={() => router.push("/profile/settings" as any)}
          >
            <Feather name="settings" size={18} color={colors.primary} />
          </Pressable>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View entering={FadeInDown.duration(400).delay(80)} style={styles.profileWrap}>
          <View style={[styles.profileCard, { backgroundColor: colors.card }, shadows.card]}>
            <Pressable onPress={handlePhotoUpload} style={styles.avatarWrap}>
              {displayAvatar ? (
                <Image source={{ uri: displayAvatar }} style={styles.avatarImage} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.avatarLetter, { color: colors.primaryForeground }]}>
                    {user?.name?.charAt(0).toUpperCase() ?? "A"}
                  </Text>
                </View>
              )}
              <View style={[styles.cameraBadge, { backgroundColor: colors.accentOrange }]}>
                <Feather name="camera" size={11} color="#FFF" />
              </View>
            </Pressable>
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
        </Animated.View>

        {/* Stats */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(140)}
          style={[styles.statsRow, { paddingHorizontal: spacing.pagePadding }]}
        >
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
              ]}
            >
              <Text
                style={[
                  styles.statVal,
                  { color: colors.primary },
                ]}
              >
                {s.value}
              </Text>
              <Text
                style={[
                  styles.statLbl,
                  { color: colors.mutedForeground },
                ]}
              >
                {s.label}
              </Text>
            </View>
          ))}
        </Animated.View>

        {/* Menu */}
        {MENU_SECTIONS.map((section, sIdx) => (
          <Animated.View
            key={section.title || "danger"}
            entering={FadeInDown.duration(400).delay(200 + sIdx * 60)}
            style={styles.menuSection}
          >
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
                    style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.7 }]}
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
                        style={[styles.menuLabel, { color: item.color ?? colors.primary }]}
                      >
                        {item.label}
                      </Text>
                      {item.subtitle && (
                        <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                    {!item.action && (
                      <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                    )}
                  </Pressable>
                </View>
              ))}
            </View>
          </Animated.View>
        ))}

        <Text style={[styles.version, { color: colors.mutedForeground }]}>Bringo v1.0.0</Text>
      </ScrollView>

      {/* Custom Sign Out Modal */}
      <Modal
        visible={signOutVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setSignOutVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={[styles.modalCard, { backgroundColor: colors.card }]}
          >
            <View style={[styles.modalIcon, { backgroundColor: colors.danger + "15" }]}>
              <Feather name="log-out" size={28} color={colors.danger} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>Sign out?</Text>
            <Text style={[styles.modalSub, { color: colors.secondary }]}>
              You'll need to sign back in to access your account.
            </Text>
            <View style={styles.modalBtns}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: colors.muted }]}
                onPress={() => setSignOutVisible(false)}
              >
                <Text style={[styles.modalBtnText, { color: colors.primary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: colors.danger }]}
                onPress={confirmSignOut}
              >
                <Text style={[styles.modalBtnText, { color: "#FFF" }]}>Sign out</Text>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
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
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  profileWrap: { paddingHorizontal: spacing.pagePadding, marginBottom: 16 },
  profileCard: {
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatarWrap: { position: "relative" },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: { width: 56, height: 56, borderRadius: 20 },
  avatarLetter: { fontSize: 28, fontFamily: "Inter_700Bold" },
  cameraBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
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
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: { flex: 1, gap: 1 },
  menuLabel: { fontFamily: "Inter_500Medium", fontSize: 15 },
  menuSub: { fontFamily: "Inter_400Regular", fontSize: 12 },
  version: {
    textAlign: "center",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 40,
    paddingHorizontal: spacing.pagePadding,
  },
  modalCard: {
    width: "100%",
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  modalTitle: { fontFamily: "Inter_700Bold", fontSize: 22, letterSpacing: -0.5 },
  modalSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  modalBtns: { flexDirection: "row", gap: 12, marginTop: 8, width: "100%" },
  modalBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  modalBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
});
