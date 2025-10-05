import * as SecureStore from "expo-secure-store";
import jwt from "jsonwebtoken";

// JWT secret - in production, this should be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || "skinster-secret-key";
const TOKEN_KEY = "skinster_auth_token";

export interface TokenPayload {
  userId: number;
  email: string;
}

// Token operations
export const tokenOperations = {
  // Generate JWT token
  generate: (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "14d",
    });
  },

  // Verify JWT token
  verify: (token: string): TokenPayload | null => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  },

  // Decode token without verification (for debugging)
  decode: (token: string): any => {
    return jwt.decode(token);
  },

  // Check if token is expired
  isExpired: (token: string): boolean => {
    try {
      jwt.verify(token, JWT_SECRET);
      return false;
    } catch (error: any) {
      return error.name === "TokenExpiredError";
    }
  },

  // Get token expiration date
  getExpiration: (token: string): Date | null => {
    try {
      const decoded = jwt.decode(token) as any;
      if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch {
      return null;
    }
  },

  // Refresh token (generate new token with same payload)
  refresh: (token: string): string | null => {
    const payload = tokenOperations.verify(token);
    if (payload) {
      return tokenOperations.generate(payload);
    }
    return null;
  },

  // SecureStore operations
  // Store auth token securely
  store: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error("Failed to store auth token:", error);
    }
  },

  // Get stored auth token
  getStored: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Failed to retrieve auth token:", error);
      return null;
    }
  },

  // Remove stored auth token
  removeStored: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Failed to remove auth token:", error);
    }
  },

  // Check if user is authenticated (has valid stored token)
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const token = await tokenOperations.getStored();
      if (!token) return false;

      const payload = tokenOperations.verify(token);
      return payload !== null;
    } catch (error) {
      console.error("Failed to check authentication:", error);
      return false;
    }
  },
};
