import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BackHeader } from "@/components/ui/BackHeader";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";

type Message = { id: string; text: string; sender: "user" | "support"; time: string };

const INITIAL: Message[] = [
  { id: "1", text: "Hi! Welcome to Bringo support. How can I help you today? 😊", sender: "support", time: "Now" },
];

const BOT_REPLIES = [
  "I understand! Let me look into this for you.",
  "Thanks for the details. I'm checking on this right now.",
  "I've raised this with our team. You'll get a resolution within 2 hours.",
  "Is there anything else I can help you with?",
];

export default function SupportChatScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [text, setText] = useState("");
  const listRef = useRef<FlatList>(null);
  const botIdx = useRef(0);
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0);

  const send = () => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: text.trim(), sender: "user", time: "Now" };
    setMessages((m) => [...m, userMsg]);
    setText("");
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: BOT_REPLIES[botIdx.current % BOT_REPLIES.length],
        sender: "support",
        time: "Now",
      };
      botIdx.current++;
      setMessages((m) => [...m, reply]);
      listRef.current?.scrollToEnd({ animated: true });
    }, 1200);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView style={[{ flex: 1, backgroundColor: colors.background }]} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <BackHeader title="Support chat" right={
        <Pressable hitSlop={8}>
          <Feather name="more-vertical" size={20} color={colors.primary} />
        </Pressable>
      } />

      {/* Agent Status */}
      <View style={[styles.statusBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.agentAvatar, { backgroundColor: colors.accentBlue }]}>
          <Text style={styles.agentInitial}>S</Text>
        </View>
        <View>
          <Text style={[styles.agentName, { color: colors.primary }]}>Support Team</Text>
          <View style={styles.onlineRow}>
            <View style={[styles.onlineDot, { backgroundColor: colors.accentGreen }]} />
            <Text style={[styles.onlineText, { color: colors.accentGreen }]}>Online · Usually replies in &lt; 2 min</Text>
          </View>
        </View>
      </View>

      <FlatList ref={listRef} data={messages} keyExtractor={(m) => m.id}
        contentContainerStyle={[styles.messages, { paddingBottom: 16 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isUser = item.sender === "user";
          return (
            <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowSupport]}>
              {!isUser && (
                <View style={[styles.supportAvatar, { backgroundColor: colors.accentBlue }]}>
                  <Text style={styles.supportInitial}>S</Text>
                </View>
              )}
              <View style={[styles.bubble, isUser
                ? [styles.userBubble, { backgroundColor: colors.primary }]
                : [styles.supportBubble, { backgroundColor: colors.card }, shadows.sm]]}>
                <Text style={[styles.bubbleText, { color: isUser ? colors.primaryForeground : colors.primary }]}>{item.text}</Text>
                <Text style={[styles.bubbleTime, { color: isUser ? "rgba(247,245,240,0.5)" : colors.mutedForeground }]}>{item.time}</Text>
              </View>
            </View>
          );
        }}
      />

      <View style={[styles.inputBar, { backgroundColor: colors.card, paddingBottom: botPad + 8, borderTopColor: colors.border }]}>
        <TextInput value={text} onChangeText={setText} placeholder="Type a message..."
          placeholderTextColor={colors.mutedForeground} multiline maxLength={500}
          style={[styles.input, { color: colors.primary, backgroundColor: colors.muted }]}
          onSubmitEditing={send} returnKeyType="send" />
        <Pressable onPress={send} style={[styles.sendBtn, { backgroundColor: text.trim() ? colors.primary : colors.muted }]}>
          <Feather name="send" size={18} color={text.trim() ? colors.primaryForeground : colors.mutedForeground} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  statusBar: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderBottomWidth: 1 },
  agentAvatar: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  agentInitial: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#FFF" },
  agentName: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  onlineRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5 },
  onlineText: { fontFamily: "Inter_400Regular", fontSize: 12 },
  messages: { paddingHorizontal: spacing.pagePadding, paddingTop: 16, gap: 14 },
  msgRow: { flexDirection: "row", gap: 8, maxWidth: "85%" },
  msgRowUser: { alignSelf: "flex-end", flexDirection: "row-reverse" },
  msgRowSupport: { alignSelf: "flex-start" },
  supportAvatar: { width: 30, height: 30, borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 2 },
  supportInitial: { fontFamily: "Inter_700Bold", fontSize: 13, color: "#FFF" },
  bubble: { borderRadius: 18, padding: 12, maxWidth: "100%", gap: 4 },
  userBubble: { borderBottomRightRadius: 4 },
  supportBubble: { borderBottomLeftRadius: 4 },
  bubbleText: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 20 },
  bubbleTime: { fontFamily: "Inter_400Regular", fontSize: 10, alignSelf: "flex-end" },
  inputBar: { flexDirection: "row", alignItems: "flex-end", gap: 10, padding: 12, paddingTop: 10, borderTopWidth: 1 },
  input: { flex: 1, borderRadius: 16, padding: 12, fontFamily: "Inter_400Regular", fontSize: 14, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 16, alignItems: "center", justifyContent: "center" },
});
