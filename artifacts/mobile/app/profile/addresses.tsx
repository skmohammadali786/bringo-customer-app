import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
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
import { formatAddress, useAddresses } from "@/context/AddressContext";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

export default function AddressesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { addresses, removeAddress, setDefault } = useAddresses();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const confirmDelete = () => {
    if (deleteTarget) {
      removeAddress(deleteTarget);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Animated.View
          entering={FadeInDown.duration(400).delay(0)}
          style={[styles.header, { paddingTop: topPad + 16 }]}
        >
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={colors.primary} />
          </Pressable>
          <Text style={[styles.title, { color: colors.primary }]}>Saved Addresses</Text>
          <View style={{ width: 40 }} />
        </Animated.View>

        <ScrollView
          contentContainerStyle={[styles.list, { paddingBottom: botPad }]}
          showsVerticalScrollIndicator={false}
        >
          {addresses.map((addr, i) => (
            <Animated.View
              key={addr.id}
              entering={FadeInDown.duration(400).delay(80 + i * 80)}
            >
              <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
                <View
                  style={[
                    styles.addrIcon,
                    { backgroundColor: addr.isDefault ? colors.accentOrange + "18" : colors.muted },
                  ]}
                >
                  <Feather
                    name={addr.icon}
                    size={20}
                    color={addr.isDefault ? colors.accentOrange : colors.secondary}
                  />
                </View>
                <View style={styles.addrInfo}>
                  <View style={styles.labelRow}>
                    <Text style={[styles.addrLabel, { color: colors.primary }]}>
                      {addr.label.charAt(0).toUpperCase() + addr.label.slice(1)}
                    </Text>
                    {addr.isDefault && (
                      <View style={[styles.defaultBadge, { backgroundColor: colors.accentGreen + "20" }]}>
                        <Text style={[styles.defaultText, { color: colors.accentGreen }]}>
                          Default
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.addrText, { color: colors.secondary }]}>
                    {formatAddress(addr)}
                  </Text>
                  <View style={styles.actions}>
                    {!addr.isDefault && (
                      <Pressable onPress={() => setDefault(addr.id)}>
                        <Text style={[styles.actionText, { color: colors.accentOrange }]}>
                          Set as default
                        </Text>
                      </Pressable>
                    )}
                    <Pressable onPress={() => setDeleteTarget(addr.id)}>
                      <Text style={[styles.actionText, { color: colors.danger }]}>Remove</Text>
                    </Pressable>
                  </View>
                </View>
                <Pressable
                  style={styles.editBtn}
                  onPress={() => router.push(`/address/edit?id=${addr.id}` as any)}
                >
                  <Feather name="edit-2" size={16} color={colors.mutedForeground} />
                </Pressable>
              </View>
            </Animated.View>
          ))}

          <Animated.View entering={FadeInDown.duration(400).delay(80 + addresses.length * 80)}>
            <Pressable
              style={[styles.addCard, { borderColor: colors.border }]}
              onPress={() => router.push("/address/add" as any)}
            >
              <Feather name="plus-circle" size={22} color={colors.accentOrange} />
              <Text style={[styles.addText, { color: colors.primary }]}>Add New Address</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </View>

      {/* Remove confirmation modal */}
      <Modal
        visible={deleteTarget !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setDeleteTarget(null)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={FadeInDown.duration(300)}
            style={[styles.modalCard, { backgroundColor: colors.card }]}
          >
            <View style={[styles.modalIcon, { backgroundColor: colors.danger + "15" }]}>
              <Feather name="map-pin" size={28} color={colors.danger} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>Remove address?</Text>
            <Text style={[styles.modalSub, { color: colors.secondary }]}>
              This address will be permanently removed from your saved addresses.
            </Text>
            <View style={styles.modalBtns}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: colors.muted }]}
                onPress={() => setDeleteTarget(null)}
              >
                <Text style={[styles.modalBtnText, { color: colors.primary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: colors.danger }]}
                onPress={confirmDelete}
              >
                <Text style={[styles.modalBtnText, { color: "#FFF" }]}>Remove</Text>
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
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { ...typography.h3 },
  list: { paddingHorizontal: spacing.pagePadding, gap: 12 },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    padding: 16,
    borderRadius: 20,
  },
  addrIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  addrInfo: { flex: 1, gap: 6 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  addrLabel: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  defaultBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  defaultText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  addrText: { ...typography.small, lineHeight: 18 },
  actions: { flexDirection: "row", gap: 14 },
  actionText: { fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 2 },
  editBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  addCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  addText: { fontFamily: "Inter_500Medium", fontSize: 15 },
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
