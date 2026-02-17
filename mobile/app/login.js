import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import { login, setToken } from "../lib/api";
import { colors } from "../constants/theme";

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      setToken(res.access_token);
      await signIn(res.access_token, { id: res.user_id, email: res.email });
      router.replace("/role");
    } catch (e) {
      Alert.alert("Login Failed", e.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          editable={!loading}
        />
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={styles.btnWrap}
          activeOpacity={0.8}
        >
          <LinearGradient colors={["#6366f1", "#8b5cf6"]} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Sign In</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
        <Link href="/signup" asChild>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </Link>
        <View style={styles.legal}>
          <Link href="/privacy" asChild><TouchableOpacity><Text style={styles.legalText}>Privacy</Text></TouchableOpacity></Link>
          <Text style={styles.legalDot}> · </Text>
          <Link href="/terms" asChild><TouchableOpacity><Text style={styles.legalText}>Terms</Text></TouchableOpacity></Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: "center", padding: 24 },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 24 },
  label: { color: colors.textSecondary, marginBottom: 6, fontWeight: "500" },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    color: colors.text,
    marginBottom: 16,
    fontSize: 16,
  },
  btnWrap: { marginTop: 8, borderRadius: 14, overflow: "hidden" },
  btn: { paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "600" },
  link: { marginTop: 20, alignItems: "center" },
  linkText: { color: colors.primary, fontSize: 15 },
  legal: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
  legalText: { color: colors.textSecondary, fontSize: 13 },
  legalDot: { color: colors.textSecondary, fontSize: 13 },
});
