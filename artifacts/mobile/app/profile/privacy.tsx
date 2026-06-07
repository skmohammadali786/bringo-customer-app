import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const PRIVACY_SETTINGS = [
  { id: "analytics", title: "Usage analytics", desc: "Help us improve Bringo by sharing anonymous usage data", default: true },
  { id: "marketing", title: "Marketing communications", desc: "Receive personalized offers and promotions", default: true },
  { id: "location", title: "Precise location", desc: "Allow background location for better delivery tracking", default: false },
  { id: "contacts", title: "Contacts access", desc: "Invite friends to Bringo easily", default: false },
];

export default function PrivacyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState<Record<string, boolean>>(
    Object.fromEntries(PRIVACY_SETTINGS.map((s) => [s.id, s.default]))
  );
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const toggle = (id: string) => setSettings((s) => ({ ...s, [id]: !s[id] }));

  const POLICY_SECTIONS = [
    { title: "Data we collect", content: "We collect your phone number, location, order history, and device info to provide the Bringo service. All data is encrypted in transit and at rest." },
    { title: "How we use your data", content: "Your data is used to process orders, improve our service, prevent fraud, and (with your consent) send you relevant offers. We never sell your personal data." },
    { title: "Data retention", content: "We retain your data for as long as your account is active. You can request deletion at any time from Account Settings." },
    { title: "Third parties", content: "We share minimal data with delivery partners and payment processors. All third parties are contractually bound to our privacy standards." },
  ];

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Privacy & data" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {/* Privacy controls */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Privacy controls</Text>
        <View style={[styles.card, { backgroundColor: colors.card }, shadows.sm]}>
          {PRIVACY_SETTINGS.map((s, i) => (
            <View key={s.id}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingTitle, { color: colors.primary }]}>{s.title}</Text>
                  <Text style={[styles.settingDesc, { color: colors.secondary }]}>{s.desc}</Text>
                </View>
                <Pressable onPress={() => toggle(s.id)}
                  style={[styles.toggle, { backgroundColor: settings[s.id] ? colors.primary : colors.muted }]}>
                  <View style={[styles.toggleDot, { left: settings[s.id] ? 20 : 2 }]} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Policy sections */}
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Privacy policy</Text>
        {POLICY_SECTIONS.map((section) => (
          <View key={section.title} style={[styles.policyCard, { backgroundColor: colors.card }, shadows.sm]}>
            <Text style={[styles.policyTitle, { color: colors.primary }]}>{section.title}</Text>
            <Text style={[styles.policyText, { color: colors.secondary }]}>{section.content}</Text>
          </View>
        ))}

        <View style={[styles.updateNote, { backgroundColor: colors.muted }]}>
          <Text style={[styles.updateText, { color: colors.mutedForeground }]}>Last updated: December 2024 · v2.1</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 14 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 20, letterSpacing: -0.5 },
  card: { borderRadius: 20, overflow: "hidden" },
  settingRow: { flexDirection: "row", alignItems: "flex-start", padding: 16, gap: 12 },
  settingInfo: { flex: 1, gap: 3 },
  settingTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  settingDesc: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 17 },
  toggle: { width: 44, height: 26, borderRadius: 13, justifyContent: "center", position: "relative" },
  toggleDot: { position: "absolute", width: 20, height: 20, borderRadius: 10, backgroundColor: "#FFF", top: 3 },
  divider: { height: 1, marginHorizontal: 16 },
  policyCard: { borderRadius: 18, padding: 16, gap: 8 },
  policyTitle: { fontFamily: "Inter_700Bold", fontSize: 15 },
  policyText: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 20 },
  updateNote: { borderRadius: 12, padding: 12, alignItems: "center" },
  updateText: { fontFamily: "Inter_400Regular", fontSize: 12 },
});
