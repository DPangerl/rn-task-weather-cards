import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  const handleWeatherLocations = () => {
    router.push("/(app)/weather-locations");
  };

  // iOS-style setting row component
  const SettingsRow: React.FC<{
    title: string;
    subtitle?: string;
    icon?: any;
    iconColor?: string;
    onPress?: () => void;
    isLast?: boolean;
    rightElement?: React.ReactNode;
  }> = ({
    title,
    subtitle,
    icon,
    iconColor,
    onPress,
    isLast,
    rightElement,
  }) => (
    <TouchableOpacity
      style={[styles.settingsRow, !isLast && styles.settingsRowBorder]}
      onPress={onPress}
      activeOpacity={0.3}
    >
      <View style={styles.rowContent}>
        {icon && (
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: iconColor || "#007AFF" },
            ]}
          >
            <IconSymbol name={icon} size={16} color="white" />
          </View>
        )}
        <View style={styles.textContent}>
          <ThemedText style={styles.rowTitle}>{title}</ThemedText>
          {subtitle && (
            <ThemedText style={styles.rowSubtitle}>{subtitle}</ThemedText>
          )}
        </View>
        <View style={styles.rightContent}>
          {rightElement}
          <IconSymbol name="chevron.right" size={13} color="#C7C7CC" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Settings
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Manage your account and preferences
          </ThemedText>
        </View>

        {/* Settings Groups */}
        <View style={styles.settingsGroup}>
          <SettingsRow
            title="Account"
            subtitle={user?.email || "No email"}
            icon="person.fill"
            iconColor="#007AFF"
            onPress={() =>
              Alert.alert("Account", "Profile settings coming soon")
            }
            isLast={true}
          />
        </View>

        <View style={styles.settingsGroup}>
          <SettingsRow
            title="Weather Locations"
            subtitle="Manage your saved locations"
            icon="location.fill"
            iconColor="#34C759"
            onPress={handleWeatherLocations}
            isLast={true}
          />
        </View>

        {/* Logout Button */}
        <View style={styles.logoutCard}>
          <Pressable
            style={styles.logoutButton}
            onPress={handleLogout}
            android_ripple={{ color: "rgba(255, 59, 48, 0.1)" }}
          >
            <ThemedText style={styles.logoutText}>Sign Out</ThemedText>
          </Pressable>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.6,
  },
  settingsGroup: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  settingsRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#C6C6C8",
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconWrapper: {
    width: 29,
    height: 29,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 17,
    fontWeight: "400",
    lineHeight: 22,
  },
  rowSubtitle: {
    fontSize: 15,
    opacity: 0.6,
    marginTop: 1,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  chevron: {
    fontSize: 16,
    opacity: 0.3,
    marginLeft: 8,
  },
  logoutCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 10,
    overflow: "hidden",
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    minHeight: 44,
  },
  logoutText: {
    fontSize: 17,
    fontWeight: "400",
    color: "#FF3B30",
  },
  bottomPadding: {
    height: 50,
  },
});
