import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

const PERMISSIONS = [
  {
    icon: "map-pin" as const,
    title: "Location",
    desc: "To find nearby stores and track your delivery",
    color: "#34C759",
  },
  {
    icon: "bell" as const,
    title: "Notifications",
    desc: "Get live updates on your order status",
    color: "#4A90E2",
  },
  {
    icon: "camera" as const,
    title: "Camera",
    desc: "Search products by photo or scan barcodes",
    color: "#FF9A3D",
  },
];

export default function PermissionsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0);

  const handleAllow = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    router.replace("/(tabs)");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.inner, { paddingTop: topPad + 32, paddingBottom: botPad + 32 }]}>
        <View style={styles.headline}>
          <View style={[styles.iconBadge, { backgroundColor: colors.primary }]}>
            <Feather name="shield" size={28} color={colors.primaryForeground} />
          </View>
          <Text style={[styles.title, { color: colors.primary }]}>
            {"A few quick\npermissions"}
          </Text>
          <Text style={[styles.sub, { color: colors.secondary }]}>
            Bringo needs these to deliver the best experience for you.
          </Text>
        </View>

        <View style={styles.perms}>
          {PERMISSIONS.map((p) => (
            <View
              key={p.icon}
              style={[styles.permCard, { backgroundColor: colors.card }, shadows.sm]}
            >
              <View style={[styles.permIcon, { backgroundColor: `${p.color}20` }]}>
                <Feather name={p.icon} size={20} color={p.color} />
              </View>
              <View style={styles.permText}>
                <Text style={[styles.permTitle, { color: colors.primary }]}>{p.title}</Text>
                <Text style={[styles.permDesc, { color: colors.secondary }]}>{p.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Button label="Allow & Continue" onPress={handleAllow} loading={loading} />
          <Button
            label="Skip for now"
            onPress={() => router.replace("/(tabs)")}
            variant="ghost"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: spacing.pagePadding, gap: 32, justifyContent: "center" },
  headline: { gap: 14, alignItems: "flex-start" },
  iconBadge: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: { fontSize: 36, fontFamily: "Inter_700Bold", letterSpacing: -1.5, lineHeight: 42 },
  sub: { ...typography.body },
  perms: { gap: 12 },
  permCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    gap: 16,
  },
  permIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  permText: { flex: 1, gap: 2 },
  permTitle: { ...typography.bodySemiBold },
  permDesc: { ...typography.small },
  actions: { gap: 12 },
});
