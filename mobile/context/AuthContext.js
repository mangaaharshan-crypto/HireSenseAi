import React, { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { setToken } from "../lib/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "hiresense_token";
const USER_KEY = "hiresense_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const t = await SecureStore.getItemAsync(TOKEN_KEY);
        const u = await SecureStore.getItemAsync(USER_KEY);
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
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
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
