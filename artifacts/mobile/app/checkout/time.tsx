import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { Button } from "@/components/ui/Button";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const DELIVERY_OPTIONS = [
  { id: "express", label: "Express", time: "15–25 min", desc: "Our fastest delivery", icon: "zap" as const, extra: null, color: "#FF9A3D" },
  { id: "standard", label: "Standard", time: "30–45 min", desc: "On-time guarantee", icon: "clock" as const, extra: null, color: "#4A90E2" },
  { id: "scheduled", label: "Schedule", time: "Pick a time", desc: "Plan ahead", icon: "calendar" as const, extra: null, color: "#34C759" },
];

const SCHEDULE_SLOTS = ["Today, 6:00 PM", "Today, 7:00 PM", "Today, 8:00 PM", "Tomorrow, 9:00 AM", "Tomorrow, 10:00 AM", "Tomorrow, 11:00 AM"];

export default function CheckoutTimeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [option, setOption] = useState("express");
  const [slot, setSlot] = useState(SCHEDULE_SLOTS[0]);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 16;

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Delivery time" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad + 80 }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Choose delivery type</Text>
        {DELIVERY_OPTIONS.map((opt) => {
          const active = option === opt.id;
          return (
            <Pressable key={opt.id} onPress={() => setOption(opt.id)}
              style={[styles.optionCard, {
                backgroundColor: active ? colors.primary : colors.card,
                borderColor: active ? colors.primary : "transparent",
                borderWidth: active ? 0 : 0,
              }, active ? shadows.lg : shadows.sm]}>
              <View style={[styles.optIcon, { backgroundColor: active ? "rgba(255,255,255,0.15)" : opt.color + "18" }]}>
                <Feather name={opt.icon} size={22} color={active ? "#FFF" : opt.color} />
              </View>
              <View style={styles.optInfo}>
                <Text style={[styles.optLabel, { color: active ? colors.primaryForeground : colors.primary }]}>{opt.label}</Text>
                <Text style={[styles.optTime, { color: active ? colors.accentOrange : opt.color, fontFamily: "Inter_700Bold" }]}>{opt.time}</Text>
                <Text style={[styles.optDesc, { color: active ? "rgba(247,245,240,0.7)" : colors.mutedForeground }]}>{opt.desc}</Text>
              </View>
              <View style={[styles.radio, { borderColor: active ? colors.primaryForeground : colors.border }]}>
                {active && <View style={[styles.radioDot, { backgroundColor: colors.primaryForeground }]} />}
              </View>
            </Pressable>
          );
        })}

        {option === "scheduled" && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Choose a time slot</Text>
            <View style={styles.slotsGrid}>
              {SCHEDULE_SLOTS.map((s) => {
                const active = slot === s;
                return (
                  <Pressable key={s} onPress={() => setSlot(s)}
                    style={[styles.slotPill, { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border }]}>
                    <Text style={[styles.slotText, { color: active ? colors.primaryForeground : colors.primary }]}>{s}</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        <View style={[styles.noteCard, { backgroundColor: colors.muted }]}>
          <Feather name="info" size={14} color={colors.mutedForeground} />
          <Text style={[styles.noteText, { color: colors.secondary }]}>
            Express delivery available until 10 PM. Scheduled slots available up to 3 days in advance.
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: botPad }]}>
        <Button label="Confirm" onPress={() => router.back()} variant="primary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 14 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 18, letterSpacing: -0.5 },
  optionCard: { borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 14 },
  optIcon: { width: 52, height: 52, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  optInfo: { flex: 1, gap: 2 },
  optLabel: { fontFamily: "Inter_700Bold", fontSize: 16, letterSpacing: -0.3 },
  optTime: { fontSize: 14 },
  optDesc: { fontFamily: "Inter_400Regular", fontSize: 13 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  slotsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slotPill: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1.5 },
  slotText: { fontFamily: "Inter_500Medium", fontSize: 13 },
  noteCard: { borderRadius: 14, padding: 12, flexDirection: "row", gap: 8, alignItems: "flex-start" },
  noteText: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 12, lineHeight: 17 },
  footer: { paddingHorizontal: spacing.pagePadding, paddingTop: 14, borderTopWidth: 1, borderTopColor: "rgba(0,0,0,0.06)" },
});
