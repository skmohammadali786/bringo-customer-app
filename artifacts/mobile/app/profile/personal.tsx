import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Modal,
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

const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export default function PersonalInfoScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [avatar, setAvatar] = useState<string | null>(user?.avatar ?? null);
  const [saving, setSaving] = useState(false);
  const [genderModalVisible, setGenderModalVisible] = useState(false);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Math.max(insets.bottom, Platform.OS === "web" ? 34 : 0) + 32;

  const formatDob = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  };

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
    <>
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
          {/* Full Name */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.secondary }]}>Full Name</Text>
            <View
              style={[
                styles.fieldInput,
                { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1.5 },
                shadows.sm,
              ]}
            >
              <TextInput
                value={name}
                onChangeText={setName}
                keyboardType="default"
                editable
                style={[styles.input, { color: colors.primary }]}
                placeholderTextColor={colors.mutedForeground}
                placeholder="Your full name"
              />
            </View>
          </View>

          {/* Phone Number */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: colors.secondary }]}>Phone Number</Text>
            <View
              style={[
                styles.fieldInput,
                { backgroundColor: colors.card, borderColor: "transparent", borderWidth: 0 },
                shadows.sm,
              ]}
            >
              <TextInput
                value={`+91 ${user?.phone ?? ""}`}
                onChangeText={() => {}}
                keyboardType="phone-pad"
                editable={false}
                style={[styles.input, { color: colors.primary, opacity: 0.5 }]}
                placeholderTextColor={colors.mutedForeground}
              />
              <Feather name="lock" size={14} color={colors.mutedForeground} />
            </View>
          </View>

          {/* Date of Birth — optional */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.fieldLabel, { color: colors.secondary }]}>Date of Birth</Text>
              <Text style={[styles.optionalTag, { color: colors.mutedForeground }]}>Optional</Text>
            </View>
            <View
              style={[
                styles.fieldInput,
                { backgroundColor: colors.card, borderColor: dob ? colors.border : colors.border, borderWidth: 1.5 },
                shadows.sm,
              ]}
            >
              <Feather name="calendar" size={16} color={colors.mutedForeground} style={{ marginRight: 4 }} />
              <TextInput
                value={dob}
                onChangeText={(t) => setDob(formatDob(t))}
                keyboardType="number-pad"
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.input, { color: colors.primary }]}
                maxLength={10}
              />
            </View>
          </View>

          {/* Gender — optional */}
          <View style={styles.fieldGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.fieldLabel, { color: colors.secondary }]}>Gender</Text>
              <Text style={[styles.optionalTag, { color: colors.mutedForeground }]}>Optional</Text>
            </View>
            <Pressable
              onPress={() => setGenderModalVisible(true)}
              style={[
                styles.fieldInput,
                { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1.5 },
                shadows.sm,
              ]}
            >
              <Feather name="users" size={16} color={colors.mutedForeground} style={{ marginRight: 4 }} />
              <Text style={[styles.input, { color: gender ? colors.primary : colors.mutedForeground }]}>
                {gender || "Select gender"}
              </Text>
              <Feather name="chevron-down" size={16} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(220)}>
          <Button label="Save Changes" onPress={save} loading={saving} />
        </Animated.View>
      </ScrollView>

      {/* Gender picker modal */}
      <Modal
        visible={genderModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setGenderModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setGenderModalVisible(false)}>
          <Animated.View
            entering={FadeInDown.duration(280)}
            style={[styles.modalCard, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.modalTitle, { color: colors.primary }]}>Select Gender</Text>
            {GENDERS.map((g, i) => (
              <View key={g}>
                {i > 0 && <View style={[styles.modalDivider, { backgroundColor: colors.border }]} />}
                <Pressable
                  style={[styles.modalOption, gender === g && { backgroundColor: colors.muted }]}
                  onPress={() => { setGender(g); setGenderModalVisible(false); }}
                >
                  <Text style={[styles.modalOptionText, { color: colors.primary }]}>{g}</Text>
                  {gender === g && <Feather name="check" size={16} color={colors.accentOrange} />}
                </Pressable>
              </View>
            ))}
            <Pressable
              style={[styles.modalCancel, { backgroundColor: colors.muted }]}
              onPress={() => setGenderModalVisible(false)}
            >
              <Text style={[styles.modalCancelText, { color: colors.secondary }]}>Cancel</Text>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
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
  labelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  fieldLabel: { ...typography.label },
  optionalTag: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    fontStyle: "italic",
  },
  fieldInput: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  input: { flex: 1, fontSize: 16, fontFamily: "Inter_400Regular" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.pagePadding,
    paddingBottom: 40,
  },
  modalCard: {
    borderRadius: 24,
    overflow: "hidden",
    padding: 8,
  },
  modalTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    textAlign: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  modalDivider: { height: 1, marginHorizontal: 16 },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  modalOptionText: { fontFamily: "Inter_500Medium", fontSize: 16 },
  modalCancel: {
    marginTop: 8,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  modalCancelText: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
});
