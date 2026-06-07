import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

type Message = { id: string; text: string; from: "me" | "agent"; time: string };

const INITIAL_MESSAGES: Message[] = [
  { id: "1", text: "Hi! I'm Rahul, your delivery agent. I've received your order.", from: "agent", time: "2:30 PM" },
  { id: "2", text: "I'm at the store now sourcing your products.", from: "agent", time: "2:32 PM" },
  { id: "3", text: "Great! How long will it take?", from: "me", time: "2:33 PM" },
  { id: "4", text: "Should be with you in about 15 minutes.", from: "agent", time: "2:33 PM" },
];

export default function ChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [text, setText] = useState("");
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0);

  const send = () => {
    if (!text.trim()) return;
    const msg: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      from: "me",
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [msg, ...prev]);
    setText("");

    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Got it! I'll keep you updated.",
        from: "agent",
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [reply, ...prev]);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.header, { paddingTop: topPad + 16, backgroundColor: colors.card }, shadows.sm]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>
        <View style={styles.agentInfo}>
          <View style={[styles.agentDot, { backgroundColor: colors.accentGreen }]} />
          <View style={[styles.agentAvatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.agentInitial, { color: colors.primaryForeground }]}>R</Text>
          </View>
          <View>
            <Text style={[styles.agentName, { color: colors.primary }]}>Rahul K.</Text>
            <Text style={[styles.agentStatus, { color: colors.accentGreen }]}>Online · Your agent</Text>
          </View>
        </View>
        <Pressable style={[styles.callBtn, { backgroundColor: colors.muted }]}>
          <Feather name="phone" size={18} color={colors.primary} />
        </Pressable>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={[styles.msgList, { paddingBottom: 8 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.msgRow, item.from === "me" && styles.msgRowMe]}>
            {item.from === "agent" && (
              <View style={[styles.msgAvatar, { backgroundColor: colors.primary }]}>
                <Text style={{ color: colors.primaryForeground, fontSize: 10, fontFamily: "Inter_700Bold" }}>R</Text>
              </View>
            )}
            <View
              style={[
                styles.bubble,
                {
                  backgroundColor: item.from === "me" ? colors.primary : colors.card,
                  borderBottomLeftRadius: item.from === "agent" ? 4 : 20,
                  borderBottomRightRadius: item.from === "me" ? 4 : 20,
                },
                shadows.sm,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  { color: item.from === "me" ? colors.primaryForeground : colors.primary },
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.bubbleTime,
                  {
                    color:
                      item.from === "me" ? "rgba(247,245,240,0.6)" : colors.mutedForeground,
                  },
                ]}
              >
                {item.time}
              </Text>
            </View>
          </View>
        )}
      />

      <View
        style={[
          styles.inputRow,
          { backgroundColor: colors.card, paddingBottom: botPad + 12 },
          shadows.md,
        ]}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, { color: colors.primary, backgroundColor: colors.muted }]}
          onSubmitEditing={send}
        />
        <Pressable
          onPress={send}
          style={[styles.sendBtn, { backgroundColor: text.trim() ? colors.primary : colors.muted }]}
        >
          <Feather
            name="send"
            size={18}
            color={text.trim() ? colors.primaryForeground : colors.mutedForeground}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.pagePadding,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  agentInfo: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10, position: "relative" },
  agentDot: { position: "absolute", bottom: 0, left: 38, width: 10, height: 10, borderRadius: 5, zIndex: 1, borderWidth: 2, borderColor: "#FFF" },
  agentAvatar: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  agentInitial: { fontFamily: "Inter_700Bold", fontSize: 18 },
  agentName: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  agentStatus: { fontFamily: "Inter_400Regular", fontSize: 12 },
  callBtn: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  msgList: { padding: spacing.pagePadding, gap: 12 },
  msgRow: { flexDirection: "row", gap: 8, alignItems: "flex-end" },
  msgRowMe: { flexDirection: "row-reverse" },
  msgAvatar: { width: 28, height: 28, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  bubble: { maxWidth: "75%", borderRadius: 20, padding: 14, gap: 4 },
  bubbleText: { fontFamily: "Inter_400Regular", fontSize: 15, lineHeight: 21 },
  bubbleTime: { fontFamily: "Inter_400Regular", fontSize: 10, alignSelf: "flex-end" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: spacing.pagePadding,
    paddingTop: 12,
  },
  input: { flex: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, fontFamily: "Inter_400Regular" },
  sendBtn: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
});
