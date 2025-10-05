import fs from "fs";
import path from "path";
import { tokenOperations } from "./token";

// File-based account storage for Skinster app
interface Account {
  id: number;
  email: string;
  password_hash: string;
  created_at: string;
}

interface AccountData {
  accounts: Account[];
  nextId: number;
}

const ACCOUNTS_FILE = path.join(process.cwd(), "data", "accounts.json");

// File storage helpers
const loadAccountData = (): AccountData => {
  try {
    if (!fs.existsSync(ACCOUNTS_FILE)) {
      return { accounts: [], nextId: 1 };
    }
    const data = fs.readFileSync(ACCOUNTS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading accounts:", error);
    return { accounts: [], nextId: 1 };
  }
};

const saveAccountData = (data: AccountData): void => {
  try {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving accounts:", error);
  }
};

// Account operations
export const accountOperations = {
  // Find user by email
  findByEmail: (email: string): Account | undefined => {
    const data = loadAccountData();
    return data.accounts.find((account: Account) => account.email === email);
  },

  // Create new account
  create: (email: string, password_hash: string): Account => {
    const data = loadAccountData();
    const newAccount: Account = {
      id: data.nextId++,
      email,
      password_hash,
      created_at: new Date().toISOString(),
    };
    data.accounts.push(newAccount);
    saveAccountData(data);
    return newAccount;
  },

  // Find user by ID
  findById: (id: number): Account | undefined => {
    const data = loadAccountData();
    return data.accounts.find((account: Account) => account.id === id);
  },

  // Get all accounts (for debugging)
  getAll: (): Account[] => {
    const data = loadAccountData();
    return [...data.accounts]; // Return copy to prevent mutations
  },

  // Update account email
  updateEmail: (id: number, newEmail: string): Account | null => {
    const data = loadAccountData();
    const account = data.accounts.find((acc: Account) => acc.id === id);
    if (account) {
      account.email = newEmail;
      saveAccountData(data);
      return account;
    }
    return null;
  },

  // Update account password
  updatePassword: (id: number, newPasswordHash: string): Account | null => {
    const data = loadAccountData();
    const account = data.accounts.find((acc: Account) => acc.id === id);
    if (account) {
      account.password_hash = newPasswordHash;
      saveAccountData(data);
      return account;
    }
    return null;
  },

  // Delete account
  delete: (id: number): boolean => {
    const data = loadAccountData();
    const index = data.accounts.findIndex((acc: Account) => acc.id === id);
    if (index !== -1) {
      data.accounts.splice(index, 1);
      saveAccountData(data);
      return true;
    }
    return false;
  },

  // Check if email exists
  emailExists: (email: string): boolean => {
    const data = loadAccountData();
    return data.accounts.some((account: Account) => account.email === email);
  },

  // Check if user is authenticated and get user data
  checkAuth: async (): Promise<{
    isAuthenticated: boolean;
    user?: Account;
  }> => {
    try {
      const token = await tokenOperations.getStored();
      if (!token) {
        return { isAuthenticated: false };
      }

      const payload = tokenOperations.verify(token);
      if (!payload) {
        return { isAuthenticated: false };
      }

      const user = accountOperations.findById(payload.userId);
      if (!user) {
        return { isAuthenticated: false };
      }

      return { isAuthenticated: true, user };
    } catch (error) {
      console.error("Auth check failed:", error);
      return { isAuthenticated: false };
    }
  },

  // Logout user (remove stored token)
  logout: async (): Promise<void> => {
    await tokenOperations.removeStored();
  },
};

export type { Account };
