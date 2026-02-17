import React, { createContext, useContext, useState, useEffect } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { setToken } from "../lib/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "hiresense_token";
const USER_KEY = "hiresense_user";

// Web fallback for SecureStore
const storage = {
  async getItem(key) {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  async setItem(key, value) {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  async deleteItem(key) {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await storage.getItem(TOKEN_KEY);
        const u = await storage.getItem(USER_KEY);
        if (t && u) {
          setToken(t);
          setUser(JSON.parse(u));
        }
      } catch (e) {
        // ignore
      }
      setLoading(false);
    })();
  }, []);

  const signIn = async (token, userData) => {
    setToken(token);
    setUser(userData);
    await storage.setItem(TOKEN_KEY, token);
    await storage.setItem(USER_KEY, JSON.stringify(userData));
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    await storage.deleteItem(TOKEN_KEY);
    await storage.deleteItem(USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
