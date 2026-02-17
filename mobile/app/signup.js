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
import { signup } from "../lib/api";
import { colors } from "../constants/theme";

export default function Signup() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName.trim() || !email.trim() || !password) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await signup(email.trim(), password, fullName.trim());
      await signIn(res.access_token, { id: res.user_id, email: res.email });
      router.replace("/role");
    } catch (e) {
      Alert.alert("Sign Up Failed", e.message || "Could not create account.");
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
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Your name"
          placeholderTextColor={colors.textSecondary}
          editable={!loading}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        <Text style={styles.label}>Password (min 6)</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          editable={!loading}
        />
        <TouchableOpacity onPress={handleSignup} disabled={loading} style={styles.btnWrap} activeOpacity={0.8}>
          <LinearGradient colors={["#6366f1", "#8b5cf6"]} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create Account</Text>}
          </LinearGradient>
        </TouchableOpacity>
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </Link>
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
});
