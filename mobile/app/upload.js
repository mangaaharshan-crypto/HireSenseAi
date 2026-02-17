import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useFlow } from "../context/FlowContext";
import { uploadResume, generateQuestions } from "../lib/api";
import { colors } from "../constants/theme";

const ALLOWED = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

export default function Upload() {
  const router = useRouter();
  const { selectedRole, setResumeData, setQuestions } = useFlow();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const pick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ALLOWED,
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const f = result.assets[0];
      setFile({ name: f.name, uri: f.uri, mimeType: f.mimeType || "application/pdf" });
    } catch (e) {
      Alert.alert("Error", "Could not pick file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Alert.alert("Error", "Please select a PDF or DOCX file.");
      return;
    }
    setLoading(true);
    try {
      const analysis = await uploadResume(file);
      setResumeData(analysis);
      const { questions: q } = await generateQuestions(selectedRole, {
        skills: analysis.skills,
        experience: analysis.experience,
        education: analysis.education,
        projects: analysis.projects,
      });
      setQuestions(q || []);
      router.push("/interview");
    } catch (e) {
      Alert.alert("Upload Failed", e.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Upload your resume</Text>
      <Text style={styles.subtitle}>PDF or DOCX, max 10 MB</Text>

      <TouchableOpacity onPress={pick} style={styles.pickCard} activeOpacity={0.8}>
        <Text style={styles.pickIcon}>📄</Text>
        <Text style={styles.pickText}>{file ? file.name : "Tap to choose file"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleUpload}
        disabled={loading || !file}
        style={styles.btnWrap}
        activeOpacity={0.8}
      >
        <LinearGradient colors={["#6366f1", "#8b5cf6"]} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>{file ? "Upload & Continue" : "Select a file first"}</Text>
          )}
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
  pickCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.border,
  },
  pickIcon: { fontSize: 48, marginBottom: 12 },
  pickText: { color: colors.text, fontSize: 16 },
  btnWrap: { borderRadius: 14, overflow: "hidden" },
  btn: { paddingVertical: 16, alignItems: "center", justifyContent: "center" },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "600" },
});
