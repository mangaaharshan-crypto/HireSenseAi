import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useFlow } from "../context/FlowContext";
import { colors } from "../constants/theme";

const ROLES = [
  "Software Engineer",
  "Data Analyst",
  "Product Manager",
  "Marketing Executive",
  "Customer Support",
  "Other (Custom Role)",
];

export default function Role() {
  const router = useRouter();
  const { setSelectedRole, selectedRole } = useFlow();
  const [customRole, setCustomRole] = useState("");
  const [loading, setLoading] = useState(false);

  const isOther = selectedRole === "Other (Custom Role)";

  const handleNext = () => {
    const role = isOther ? customRole.trim() : selectedRole;
    if (!role) {
      Alert.alert("Error", isOther ? "Enter your desired role." : "Please select a role.");
      return;
    }
    setSelectedRole(role);
    router.push("/upload");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Choose your target role</Text>
      <Text style={styles.subtitle}>We'll tailor questions to this role.</Text>

      {ROLES.map((r) => (
        <TouchableOpacity
          key={r}
          onPress={() => setSelectedRole(r)}
          style={[styles.roleCard, selectedRole === r && styles.roleCardSelected]}
          activeOpacity={0.7}
        >
          <Text style={[styles.roleText, selectedRole === r && styles.roleTextSelected]}>{r}</Text>
        </TouchableOpacity>
      ))}

      {isOther && (
        <View style={styles.customWrap}>
          <Text style={styles.label}>Enter your desired role</Text>
          <TextInput
            style={styles.input}
            value={customRole}
            onChangeText={setCustomRole}
            placeholder="e.g. Cybersecurity Analyst"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="words"
          />
        </View>
      )}

      <TouchableOpacity onPress={handleNext} disabled={loading} style={styles.btnWrap} activeOpacity={0.8}>
        <LinearGradient colors={["#6366f1", "#8b5cf6"]} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Continue</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: "700", color: colors.text, marginBottom: 6 },
  subtitle: { color: colors.textSecondary, marginBottom: 24 },
  roleCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  roleCardSelected: { borderColor: colors.primary },
  roleText: { color: colors.text, fontSize: 16 },
  roleTextSelected: { color: colors.primary, fontWeight: "600" },
  customWrap: { marginTop: 8, marginBottom: 16 },
  label: { color: colors.textSecondary, marginBottom: 8, fontWeight: "500" },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    color: colors.text,
    fontSize: 16,
  },
  btnWrap: { marginTop: 16, borderRadius: 14, overflow: "hidden" },
  btn: { paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "600" },
  logout: { marginTop: 24, alignItems: "center" },
  logoutText: { color: colors.textSecondary, fontSize: 14 },
  logout: { marginTop: 24, alignItems: "center" },
  logoutText: { color: colors.textSecondary, fontSize: 14 },
});
