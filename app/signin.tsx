import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/hooks/useAuth";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

type SignInFormData = {
  email: string;
  password: string;
};

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "border");
  const surfaceColor = useThemeColor({}, "surface");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [apiError, setApiError] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onSubmit = async (data: SignInFormData) => {
    setApiError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Use the login method from useAuth hook
        if (result.token && result.user) {
          await login(result.token, result.user);
        }
        // Success - redirect to dashboard
        console.log("Sign in successful:", result);
        router.replace("/(app)/dashboard");
      } else {
        // Show error message
        setApiError(result.error || "Sign in failed");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setApiError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToSignUp = () => {
    router.replace("/singup");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleSection}>
              <ThemedText
                type="title"
                style={[styles.title, { color: tintColor }]}
              >
                Welcome Back
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Sign in to your Skinster account
              </ThemedText>
            </View>
          </View>

          {/* Form */}
          <View
            style={[styles.formContainer, { backgroundColor: surfaceColor }]}
          >
            {/* Email Field */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: errors.email ? "#E74C3C" : borderColor,
                        color: textColor,
                        backgroundColor: backgroundColor,
                      },
                    ]}
                    placeholder="Enter your email"
                    placeholderTextColor="#7A8B94"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                )}
              />
              {errors.email && (
                <ThemedText style={styles.errorText}>
                  {errors.email.message}
                </ThemedText>
              )}
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: errors.password ? "#E74C3C" : borderColor,
                        color: textColor,
                        backgroundColor: backgroundColor,
                      },
                    ]}
                    placeholder="Enter your password"
                    placeholderTextColor="#7A8B94"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    autoComplete="password"
                  />
                )}
              />
              {errors.password && (
                <ThemedText style={styles.errorText}>
                  {errors.password.message}
                </ThemedText>
              )}
            </View>

            {/* API Error Display */}
            {apiError && (
              <View style={styles.apiErrorContainer}>
                <ThemedText style={styles.apiErrorText}>{apiError}</ThemedText>
              </View>
            )}

            {/* Sign In Button */}
            <TouchableOpacity
              style={[
                styles.signInButton,
                {
                  backgroundColor: isLoading ? "#A0A0A0" : tintColor,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
              onPress={handleSubmit(onSubmit)}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <ThemedText
                style={[styles.signInButtonText, { color: backgroundColor }]}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <ThemedText style={styles.footerText}>
              Don&apos;t have an account?{" "}
            </ThemedText>
            <TouchableOpacity onPress={handleGoToSignUp}>
              <ThemedText style={[styles.linkText, { color: tintColor }]}>
                Sign Up
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: height * 0.08,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  titleSection: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
  },
  formContainer: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    color: "#E74C3C",
    fontSize: 14,
    marginTop: 4,
  },
  signInButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600",
  },
  apiErrorContainer: {
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#E74C3C",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  apiErrorText: {
    color: "#E74C3C",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
});
