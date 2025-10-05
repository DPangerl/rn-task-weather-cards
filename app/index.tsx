import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function WelcomePage() {
  const router = useRouter();
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");

  const handleLogin = () => {
    router.push("/signin");
  };

  const handleSignup = () => {
    router.push("/singup");
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Title Section */}
        <View style={styles.logoSection}>
          <ThemedText
            type="title"
            style={[styles.appTitle, { color: tintColor }]}
          >
            Skinster
          </ThemedText>
          <ThemedText type="subtitle" style={styles.tagline}>
            Health Environment Tracker
          </ThemedText>
          <ThemedText style={styles.description}>
            Understand how environmental conditions might impact your health
            activities
          </ThemedText>
        </View>

        {/* Action Buttons Section */}
        <View style={styles.actionSection}>
          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: tintColor }]}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <ThemedText
              style={[styles.loginButtonText, { color: backgroundColor }]}
            >
              Sign In
            </ThemedText>
          </TouchableOpacity>

          {/* Signup Button */}
          <TouchableOpacity
            style={[styles.signupButton, { borderColor: tintColor }]}
            onPress={handleSignup}
            activeOpacity={0.7}
          >
            <ThemedText style={[styles.signupButtonText, { color: tintColor }]}>
              Create Account
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: height * 0.12,
    paddingBottom: 60,
  },
  logoSection: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingTop: 20,
  },
  appTitle: {
    fontSize: 48,
    fontWeight: "bold",
    lineHeight: 56,
    marginTop: 10,
    marginBottom: 16,
    textAlign: "center",
  },
  tagline: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.8,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.7,
    maxWidth: width * 0.8,
  },
  actionSection: {
    width: "100%",
    alignItems: "center",
  },
  loginButton: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  signupButton: {
    width: "100%",
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
