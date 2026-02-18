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
  Animated,
  Dimensions,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import { signup } from "../lib/api";
import { colors, gradients } from "../constants/theme";
import { useEffect, useRef } from "react";

const { width, height } = Dimensions.get("window");

export default function Signup() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
    <View style={styles.container}>
      <LinearGradient
        colors={gradients.dark}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.logo}>
            <View style={styles.headProfile}>
              <View style={styles.headMain}>
                <View style={[styles.headSection, { backgroundColor: "#FF9933" }]} />
                <View style={[styles.headSection, { backgroundColor: "#FFFFFF", flex: 2 }]}>
                  <View style={styles.ashokaChakra}>
                    <View style={styles.chakraCircle} />
                    <View style={styles.chakraSpokes} />
                  </View>
                </View>
                <View style={[styles.headSection, { backgroundColor: "#138808" }]} />
              </View>
              <View style={styles.circuitBoard}>
                <View style={[styles.circuitLine, { width: 60, height: 2 }]} />
                <View style={[styles.circuitLine, { width: 40, height: 2, top: 20 }]} />
                <View style={[styles.circuitLine, { width: 30, height: 2, top: 40 }]} />
                <View style={[styles.circuitNode, { top: -5, left: 65 }]} />
                <View style={[styles.circuitNode, { top: 15, left: 45 }]} />
                <View style={[styles.circuitNode, { top: 35, left: 35 }]} />
              </View>
            </View>
          </View>
          <Text style={styles.logoText}>HireSense</Text>
          <View style={styles.aiContainer}>
            <Text style={styles.aiText}>AI</Text>
          </View>
          <Text style={styles.tagline}>Join the Smart Hiring Revolution</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your AI-powered hiring journey</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password (min 6 characters)</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1, border: "none" }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Create a strong password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Text style={styles.eyeText}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSignup}
            disabled={loading}
            style={styles.btnWrap}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={gradients.primary}
              style={styles.btn}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.btnText}>Create Account</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Link href="/login" asChild>
            <TouchableOpacity style={styles.link}>
              <Text style={styles.linkText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
          </Link>

          <View style={styles.legal}>
            <Link href="/privacy" asChild>
              <TouchableOpacity>
                <Text style={styles.legalText}>Privacy Policy</Text>
              </TouchableOpacity>
            </Link>
            <Text style={styles.legalDot}> • </Text>
            <Link href="/terms" asChild>
              <TouchableOpacity>
                <Text style={styles.legalText}>Terms of Service</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    marginBottom: 16,
  },
  headProfile: {
    width: 120,
    height: 120,
    position: "relative",
  },
  headMain: {
    width: 80,
    height: 80,
    borderRadius: 40,
    flexDirection: "row",
    overflow: "hidden",
    position: "absolute",
    top: 10,
    left: 20,
    borderWidth: 2,
    borderColor: colors.text,
  },
  headSection: {
    flex: 1,
  },
  ashokaChakra: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  chakraCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000080",
    position: "absolute",
  },
  chakraSpokes: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000080",
    transform: [{ rotate: "45deg" }],
  },
  circuitBoard: {
    position: "absolute",
    top: 30,
    right: -10,
  },
  circuitLine: {
    backgroundColor: "#FF6B35",
    position: "absolute",
    right: 0,
  },
  circuitNode: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    borderWidth: 1,
    borderColor: "#138808",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
    letterSpacing: 1,
  },
  aiContainer: {
    backgroundColor: "#000080",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  aiText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eyeIcon: {
    padding: 16,
  },
  eyeText: {
    fontSize: 18,
  },
  btnWrap: {
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btn: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textSecondary,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  link: {
    alignItems: "center",
    marginBottom: 16,
  },
  linkText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  legal: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  legalText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  legalDot: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
