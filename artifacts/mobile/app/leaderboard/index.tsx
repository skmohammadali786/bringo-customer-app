import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

const LEADERS = [
  { rank: 1, name: "Priya M.", points: 4820, orders: 48, badge: "🥇" },
  { rank: 2, name: "Raj K.", points: 4210, orders: 42, badge: "🥈" },
  { rank: 3, name: "Anjali S.", points: 3940, orders: 39, badge: "🥉" },
  { rank: 4, name: "Vikram P.", points: 3120, orders: 31, badge: null },
  { rank: 5, name: "Neha R.", points: 2890, orders: 29, badge: null },
  { rank: 6, name: "Arjun T.", points: 2640, orders: 26, badge: null },
  { rank: 7, name: "You", points: 2450, orders: 24, badge: null, isMe: true },
  { rank: 8, name: "Kavya M.", points: 2100, orders: 21, badge: null },
];

const TABS = ["Weekly", "Monthly", "All time"];

export default function LeaderboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState(0);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 24;

  const top3 = LEADERS.slice(0, 3);
  const rest = LEADERS.slice(3);

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }]}>
      <BackHeader title="Leaderboard" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: botPad }]}>
        {/* Tabs */}
        <View style={[styles.tabsRow, { backgroundColor: colors.card }, shadows.sm]}>
          {TABS.map((t, i) => (
            <Pressable key={t} onPress={() => setTab(i)}
              style={[styles.tabBtn, tab === i && [styles.tabActive, { backgroundColor: colors.primary }]]}>
              <Text style={[styles.tabText, { color: tab === i ? colors.primaryForeground : colors.secondary }]}>{t}</Text>
            </Pressable>
          ))}
        </View>

        {/* Podium */}
        <View style={[styles.podium, { backgroundColor: colors.primary }, shadows.lg]}>
          <View style={styles.podiumRow}>
            {/* 2nd */}
            <View style={[styles.podiumSpot, { marginTop: 30 }]}>
              <Text style={styles.podiumBadge}>🥈</Text>
              <View style={[styles.podiumAvatar, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
                <Text style={styles.podiumInitial}>{top3[1]?.name.charAt(0)}</Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top3[1]?.name}</Text>
              <Text style={styles.podiumPoints}>{top3[1]?.points.toLocaleString("en-IN")}</Text>
              <View style={[styles.podiumBar, { height: 60, backgroundColor: "rgba(255,255,255,0.2)" }]} />
            </View>
            {/* 1st */}
            <View style={styles.podiumSpot}>
              <Text style={styles.podiumBadge}>🥇</Text>
              <View style={[styles.podiumAvatar, { backgroundColor: colors.accentOrange, width: 58, height: 58, borderRadius: 20 }]}>
                <Text style={[styles.podiumInitial, { fontSize: 26 }]}>{top3[0]?.name.charAt(0)}</Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top3[0]?.name}</Text>
              <Text style={styles.podiumPoints}>{top3[0]?.points.toLocaleString("en-IN")}</Text>
              <View style={[styles.podiumBar, { height: 80, backgroundColor: "rgba(255,255,255,0.2)" }]} />
            </View>
            {/* 3rd */}
            <View style={[styles.podiumSpot, { marginTop: 50 }]}>
              <Text style={styles.podiumBadge}>🥉</Text>
              <View style={[styles.podiumAvatar, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
                <Text style={styles.podiumInitial}>{top3[2]?.name.charAt(0)}</Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{top3[2]?.name}</Text>
              <Text style={styles.podiumPoints}>{top3[2]?.points.toLocaleString("en-IN")}</Text>
              <View style={[styles.podiumBar, { height: 40, backgroundColor: "rgba(255,255,255,0.2)" }]} />
            </View>
          </View>
        </View>

        {/* Rest of list */}
        {rest.map((leader) => (
          <View key={leader.rank}
            style={[styles.leaderRow, {
              backgroundColor: (leader as any).isMe ? colors.accentOrange + "15" : colors.card,
              borderColor: (leader as any).isMe ? colors.accentOrange : "transparent",
              borderWidth: (leader as any).isMe ? 2 : 0,
            }, shadows.sm]}>
            <Text style={[styles.rankNum, { color: colors.mutedForeground }]}>#{leader.rank}</Text>
            <View style={[styles.leaderAvatar, { backgroundColor: (leader as any).isMe ? colors.accentOrange : colors.muted }]}>
              <Text style={[styles.leaderInitial, { color: (leader as any).isMe ? "#FFF" : colors.primary }]}>{leader.name.charAt(0)}</Text>
            </View>
            <View style={styles.leaderInfo}>
              <Text style={[styles.leaderName, { color: colors.primary }]}>{leader.name}{(leader as any).isMe ? " (You)" : ""}</Text>
              <Text style={[styles.leaderOrders, { color: colors.mutedForeground }]}>{leader.orders} orders</Text>
            </View>
            <Text style={[styles.leaderPoints, { color: (leader as any).isMe ? colors.accentOrange : colors.primary }]}>
              {leader.points.toLocaleString("en-IN")} pts
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.pagePadding, gap: 14 },
  tabsRow: { flexDirection: "row", borderRadius: 14, padding: 4 },
  tabBtn: { flex: 1, borderRadius: 10, paddingVertical: 9, alignItems: "center" },
  tabActive: {},
  tabText: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
  podium: { borderRadius: 24, padding: 24, paddingBottom: 0, overflow: "hidden" },
  podiumRow: { flexDirection: "row", justifyContent: "space-around", alignItems: "flex-end" },
  podiumSpot: { alignItems: "center", gap: 4, width: 90 },
  podiumBadge: { fontSize: 28 },
  podiumAvatar: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  podiumInitial: { fontFamily: "Inter_700Bold", fontSize: 22, color: "#FFF" },
  podiumName: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: "#FFF", maxWidth: 80, textAlign: "center" },
  podiumPoints: { fontFamily: "Inter_700Bold", fontSize: 13, color: "rgba(247,245,240,0.8)" },
  podiumBar: { width: "100%", borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  leaderRow: { borderRadius: 16, padding: 12, flexDirection: "row", alignItems: "center", gap: 10 },
  rankNum: { fontFamily: "Inter_700Bold", fontSize: 14, minWidth: 24, textAlign: "center" },
  leaderAvatar: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  leaderInitial: { fontFamily: "Inter_700Bold", fontSize: 18 },
  leaderInfo: { flex: 1, gap: 2 },
  leaderName: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  leaderOrders: { fontFamily: "Inter_400Regular", fontSize: 12 },
  leaderPoints: { fontFamily: "Inter_700Bold", fontSize: 14 },
});
