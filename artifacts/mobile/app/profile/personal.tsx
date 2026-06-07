import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";
import { shadows, spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";

export default function PersonalInfoScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [avatar, setAvatar] = useState<string | null>(user?.avatar ?? null);
  const [saving, setSaving] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 32;

  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    updateUser({ name, avatar: avatar ?? undefined });
    setSaving(false);
    router.back();
  };

  const handlePhotoUpload = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Photo upload", "Photo upload works on mobile devices.");
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to your photo library to upload a profile photo.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleCameraCapture = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Camera", "Camera works on mobile devices.");
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow camera access.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const showPhotoOptions = () => {
    Alert.alert("Profile Photo", "Choose how to update your photo", [
      { text: "Take Photo", onPress: handleCameraCapture },
      { text: "Choose from Library", onPress: handlePhotoUpload },
      avatar ? { text: "Remove Photo", style: "destructive", onPress: () => setAvatar(null) } : null,
      { text: "Cancel", style: "cancel" },
    ].filter(Boolean) as any[]);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.inner, { paddingTop: topPad + 16, paddingBottom: botPad }]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(400).delay(0)} style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.primary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.primary }]}>Personal Information</Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(80)} style={styles.avatarWrap}>
        <Pressable onPress={showPhotoOptions} style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[styles.avatarLetter, { color: colors.primaryForeground }]}>
                {name.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
          )}
          <View style={[styles.editAvatarBtn, { backgroundColor: colors.accentOrange }]}>
            <Feather name="camera" size={14} color="#FFF" />
          </View>
        </Pressable>
        <Text style={[styles.changePhotoText, { color: colors.accentOrange }]}>
          Change photo
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(160)} style={styles.fields}>
        {[
          { label: "Full Name", value: name, onChange: setName, type: "default" as const, editable: true },
          {
            label: "Phone Number",
            value: `+91 ${user?.phone ?? ""}`,
            onChange: () => {},
            type: "phone-pad" as const,
            editable: false,
          },
        ].map((field) => (
          <View key={field.label} style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.secondary }]}>{field.label}</Text>
            <View
              style={[
                styles.fieldInput,
                {
                  backgroundColor: colors.card,
                  borderColor: field.editable ? colors.border : "transparent",
                  borderWidth: field.editable ? 1.5 : 0,
                },
                shadows.sm,
              ]}
            >
              <TextInput
                value={field.value}
                onChangeText={field.onChange}
                keyboardType={field.type}
                editable={field.editable}
                style={[
                  styles.input,
                  { color: colors.primary, opacity: field.editable ? 1 : 0.5 },
                ]}
                placeholderTextColor={colors.mutedForeground}
              />
              {!field.editable && (
                <Feather name="lock" size={14} color={colors.mutedForeground} />
              )}
            </View>
          </View>
        ))}
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(220)}>
        <Button label="Save Changes" onPress={save} loading={saving} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { paddingHorizontal: spacing.pagePadding, gap: 28 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  title: { ...typography.h3 },
  avatarWrap: { alignItems: "center", gap: 10 },
  avatarContainer: { position: "relative" },
  avatar: { width: 96, height: 96, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  avatarImage: { width: 96, height: 96, borderRadius: 30 },
  avatarLetter: { fontSize: 44, fontFamily: "Inter_700Bold" },
  editAvatarBtn: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  changePhotoText: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  fields: { gap: 16 },
  fieldGroup: { gap: 8 },
  fieldLabel: { ...typography.label },
  fieldInput: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: { flex: 1, fontSize: 16, fontFamily: "Inter_400Regular" },
});
