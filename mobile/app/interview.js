import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useFlow } from "../context/FlowContext";
import { analyzeAnswers } from "../lib/api";
import { colors } from "../constants/theme";

export default function Interview() {
  const router = useRouter();
  const { questions, answers, setAnswers, setResult, resumeData, selectedRole } = useFlow();
  const [current, setCurrent] = useState(0);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue(answers[current] ?? "");
  }, [current, answers]);

  const saveAndNext = () => {
    const next = [...answers];
    next[current] = value.trim();
    setAnswers(next);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setValue(next[current + 1] ?? "");
    } else {
      submitInterview(next);
    }
  };

  const submitInterview = async (finalAnswers) => {
    setLoading(true);
    try {
      const data = await analyzeAnswers(
        finalAnswers,
        questions,
        selectedRole,
        resumeData?.resume_score
      );
      setResult(data);
      setAnswers(finalAnswers);
      router.replace("/result");
    } catch (e) {
      Alert.alert("Error", e.message || "Could not submit answers.");
    } finally {
      setLoading(false);
    }
  };

  const onBack = () => {
    const next = [...answers];
    next[current] = value.trim();
    setAnswers(next);
    if (current > 0) {
      setCurrent(current - 1);
      setValue(answers[current - 1] ?? "");
    }
  };

  if (!questions?.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  const q = questions[current];
  const isLast = current === questions.length - 1;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.progress}>
          Question {current + 1} of {questions.length}
        </Text>
        <View style={styles.card}>
          <Text style={styles.question}>{q}</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder="Type your answer here..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        <View style={styles.row}>
          {current > 0 && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn} disabled={loading}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={saveAndNext}
            disabled={loading || !value.trim()}
            style={[styles.btnWrap, current === 0 && styles.btnFull]}
            activeOpacity={0.8}
          >
            <LinearGradient colors={["#6366f1", "#8b5cf6"]} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>{isLast ? "Submit" : "Next"}</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: 24, paddingBottom: 48 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  loadingText: { color: colors.textSecondary, marginTop: 12 },
  progress: { color: colors.textSecondary, marginBottom: 16, fontSize: 14 },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 20, marginBottom: 24 },
  question: { color: colors.text, fontSize: 18, fontWeight: "600", marginBottom: 16 },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    color: colors.text,
    fontSize: 16,
    minHeight: 140,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: { paddingVertical: 14, paddingHorizontal: 20 },
  backText: { color: colors.primary, fontSize: 16 },
  btnWrap: { flex: 1, borderRadius: 14, overflow: "hidden" },
  btnFull: { flex: 1 },
  btn: { paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "600" },
});
