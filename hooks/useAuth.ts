import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
}

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

export const useAuth = () => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
  });

  const checkAuth = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const token = await SecureStore.getItemAsync("skinster_auth_token");

      if (!token) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
        });
        return;
      }

      // Verify token with auth API
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user: result.user,
        });
      } else {
        // Token is invalid, remove it
        await SecureStore.deleteItemAsync("skinster_auth_token");
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      // On error, remove potentially corrupted token
      await SecureStore.deleteItemAsync("skinster_auth_token");
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("skinster_auth_token");
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      router.replace("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const login = async (token: string, user: User) => {
    try {
      await SecureStore.setItemAsync("skinster_auth_token", token);
      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        user,
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    ...authState,
    checkAuth,
    logout,
    login,
  };
};
