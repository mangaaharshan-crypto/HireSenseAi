import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useFlow } from "../context/FlowContext";
import { colors } from "../constants/theme";

function ScoreCircle({ score, label }) {
  const color = score >= 70 ? colors.success : score >= 40 ? colors.warning : colors.error;
  return (
    <View style={styles.scoreWrap}>
      <View style={[styles.circle, { borderColor: color }]}>
        <Text style={[styles.scoreNum, { color }]}>{Math.round(score)}</Text>
      </View>
      <Text style={styles.scoreLabel}>{label}</Text>
    </View>
  );
}

export default function Result() {
  const router = useRouter();
  const { result, resetFlow } = useFlow();

  const startOver = () => {
    resetFlow();
    router.replace("/role");
  };

  if (!result) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noResult}>No result data.</Text>
        <TouchableOpacity onPress={() => router.replace("/role")}>
          <Text style={styles.link}>Go to Role</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const recColor =
    result.recommendation === "Shortlist"
      ? colors.success
      : result.recommendation === "Consider"
        ? colors.warning
        : colors.error;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Result</Text>

      <View style={styles.mainCard}>
        <Text style={styles.bigScore}>{Math.round(result.final_score)}</Text>
        <Text style={styles.outOf}>out of 100</Text>
        <View style={[styles.recBadge, { backgroundColor: recColor + "30" }]}>
          <Text style={[styles.recText, { color: recColor }]}>{result.recommendation}</Text>
        </View>
      </View>

      <View style={styles.scoresRow}>
        <ScoreCircle score={result.technical_score} label="Technical" />
        <ScoreCircle score={result.clarity_score} label="Clarity" />
        <ScoreCircle score={result.authenticity_score} label="Authenticity" />
      </View>

      {result.per_answer_scores?.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Per-question feedback</Text>
          {result.per_answer_scores.map((s, i) => (
            <View key={i} style={styles.feedbackRow}>
              <Text style={styles.feedbackQ}>Q{i + 1}</Text>
              <Text style={styles.feedbackText}>{s.feedback || "—"}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity onPress={startOver} style={styles.btnWrap} activeOpacity={0.8}>
        <LinearGradient colors={["#6366f1", "#8b5cf6"]} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Text style={styles.btnText}>Start New Assessment</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 48 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  noResult: { color: colors.textSecondary },
  link: { color: colors.primary, marginTop: 12 },
  title: { fontSize: 22, fontWeight: "700", color: colors.text, marginBottom: 20 },
  mainCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
  },
  bigScore: { fontSize: 56, fontWeight: "800", color: colors.text },
  outOf: { color: colors.textSecondary, marginTop: 4 },
  recBadge: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  recText: { fontSize: 18, fontWeight: "700" },
  scoresRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 24 },
  scoreWrap: { alignItems: "center" },
  circle: { width: 64, height: 64, borderRadius: 32, borderWidth: 3, justifyContent: "center", alignItems: "center" },
  scoreNum: { fontSize: 20, fontWeight: "700" },
  scoreLabel: { color: colors.textSecondary, marginTop: 6, fontSize: 12 },
  card: { backgroundColor: colors.card, borderRadius: 20, padding: 20, marginBottom: 24 },
  cardTitle: { color: colors.text, fontWeight: "600", marginBottom: 12 },
  feedbackRow: { marginBottom: 10 },
  feedbackQ: { color: colors.primary, fontSize: 12, marginBottom: 2 },
  feedbackText: { color: colors.textSecondary, fontSize: 14 },
  btnWrap: { borderRadius: 14, overflow: "hidden" },
  btn: { paddingVertical: 16, alignItems: "center" },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "600" },
});
