import { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { colors } from "../constants/theme";

export default function Splash() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => {
      if (user) router.replace("/role");
      else router.replace("/login");
    }, 1500);
    return () => clearTimeout(t);
  }, [loading, user]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>HireSense</Text>
      <Text style={styles.sub}>AI</Text>
      <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 36,
    fontWeight: "700",
    color: colors.text,
  },
  sub: {
    fontSize: 18,
    color: colors.primary,
    marginTop: 4,
  },
  spinner: { marginTop: 32 },
});
