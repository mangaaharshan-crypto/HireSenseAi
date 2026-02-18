import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useFlow } from "../context/FlowContext";
import { colors } from "../constants/theme";
import { useState } from "react";

const { width } = Dimensions.get("window");

function ScoreCircle({ score, label, size = 64 }) {
  const color = score >= 80 ? colors.success : score >= 60 ? colors.warning : colors.error;
  return (
    <View style={styles.scoreWrap}>
      <View style={[styles.circle, { borderColor: color, width: size, height: size }]}>
        <Text style={[styles.scoreNum, { color }]}>{Math.round(score)}</Text>
      </View>
      <Text style={styles.scoreLabel}>{label}</Text>
    </View>
  );
}

function ProgressBar({ score, label, color }) {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressScore}>{Math.round(score)}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${score}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function FeedbackCard({ title, children, icon }) {
  return (
    <View style={styles.feedbackCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIcon}>{icon}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export default function Result() {
  const router = useRouter();
  const { result, resetFlow } = useFlow();
  const [expandedSection, setExpandedSection] = useState(null);

  const startOver = () => {
    resetFlow();
    router.replace("/role");
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
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
    result.recommendation === "Hire"
      ? colors.success
      : result.recommendation === "Shortlist"
        ? colors.success
        : result.recommendation === "Consider"
          ? colors.warning
          : colors.error;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Interview Analysis</Text>

      <View style={styles.mainCard}>
        <View style={styles.scoreHeader}>
          <Text style={styles.bigScore}>{Math.round(result.final_score)}</Text>
          <Text style={styles.outOf}>out of 100</Text>
        </View>
        <View style={[styles.recBadge, { backgroundColor: recColor + "20" }]}>
          <Text style={[styles.recText, { color: recColor }]}>{result.recommendation}</Text>
        </View>
        {result.reasoning && (
          <Text style={styles.reasoning}>{result.reasoning}</Text>
        )}
      </View>

      <View style={styles.scoresRow}>
        <ScoreCircle score={result.technical_score} label="Technical" size={70} />
        <ScoreCircle score={result.clarity_score} label="Communication" size={70} />
        <ScoreCircle score={result.authenticity_score} label="Authenticity" size={70} />
      </View>

      {/* Overall Assessment */}
      {result.overall_assessment && (
        <FeedbackCard title="Overall Assessment" icon="📊">
          <ProgressBar 
            score={result.overall_assessment.technical_proficiency || 0} 
            label="Technical Proficiency" 
            color={colors.primary} 
          />
          <ProgressBar 
            score={result.overall_assessment.communication_skills || 0} 
            label="Communication Skills" 
            color={colors.success} 
          />
          <ProgressBar 
            score={result.overall_assessment.problem_solving_ability || 0} 
            label="Problem Solving" 
            color={colors.warning} 
          />
          <ProgressBar 
            score={result.overall_assessment.cultural_fit || 0} 
            label="Cultural Fit" 
            color={colors.accent} 
          />
          <ProgressBar 
            score={result.overall_assessment.leadership_potential || 0} 
            label="Leadership Potential" 
            color={colors.error} 
          />
        </FeedbackCard>
      )}

      {/* Detailed Feedback */}
      {result.detailed_feedback && (
        <>
          <FeedbackCard title="Strengths" icon="💪">
            {result.detailed_feedback.strengths?.map((strength, i) => (
              <Text key={i} style={styles.bulletPoint}>• {strength}</Text>
            ))}
          </FeedbackCard>

          <FeedbackCard title="Areas for Improvement" icon="🎯">
            {result.detailed_feedback.areas_for_improvement?.map((area, i) => (
              <Text key={i} style={styles.bulletPoint}>• {area}</Text>
            ))}
          </FeedbackCard>

          <FeedbackCard title="Recommendations" icon="💡">
            {result.detailed_feedback.recommendations?.map((rec, i) => (
              <Text key={i} style={styles.bulletPoint}>• {rec}</Text>
            ))}
          </FeedbackCard>

          <FeedbackCard title="Next Steps" icon="🚀">
            {result.detailed_feedback.next_steps?.map((step, i) => (
              <Text key={i} style={styles.bulletPoint}>• {step}</Text>
            ))}
          </FeedbackCard>
        </>
      )}

      {/* Per-question feedback */}
      {result.per_answer_scores?.length > 0 && (
        <FeedbackCard title="Question-by-Question Analysis" icon="📝">
          {result.per_answer_scores.map((score, i) => (
            <View key={i} style={styles.questionAnalysis}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>Question {i + 1}</Text>
                <View style={styles.miniScores}>
                  <Text style={styles.miniScore}>T: {Math.round(score.technical_score)}</Text>
                  <Text style={styles.miniScore}>C: {Math.round(score.clarity_score)}</Text>
                  <Text style={styles.miniScore}>A: {Math.round(score.authenticity_score)}</Text>
                </View>
              </View>
              <Text style={styles.feedbackText}>{score.feedback || "No feedback available."}</Text>
            </View>
          ))}
        </FeedbackCard>
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
  content: { padding: 20, paddingBottom: 48 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background },
  noResult: { color: colors.textSecondary },
  link: { color: colors.primary, marginTop: 12 },
  title: { fontSize: 28, fontWeight: "800", color: colors.text, marginBottom: 20, textAlign: "center" },
  mainCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  scoreHeader: { alignItems: "center", marginBottom: 16 },
  bigScore: { fontSize: 56, fontWeight: "800", color: colors.text },
  outOf: { color: colors.textSecondary, marginTop: 4, fontSize: 16 },
  recBadge: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  recText: { fontSize: 18, fontWeight: "700" },
  reasoning: { 
    color: colors.textSecondary, 
    marginTop: 12, 
    textAlign: "center", 
    fontSize: 14, 
    fontStyle: "italic",
    paddingHorizontal: 10 
  },
  scoresRow: { 
    flexDirection: "row", 
    justifyContent: "space-around", 
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  scoreWrap: { alignItems: "center" },
  circle: { 
    borderRadius: 35, 
    borderWidth: 4, 
    justifyContent: "center", 
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  scoreNum: { fontSize: 20, fontWeight: "700" },
  scoreLabel: { color: colors.textSecondary, marginTop: 8, fontSize: 13, fontWeight: "600" },
  
  // Feedback Card Styles
  feedbackCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardIcon: { fontSize: 20, marginRight: 12 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: colors.text },
  
  // Progress Bar Styles
  progressContainer: { marginBottom: 16 },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: { color: colors.text, fontSize: 14, fontWeight: "600" },
  progressScore: { color: colors.textSecondary, fontSize: 13, fontWeight: "600" },
  progressBar: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  
  // Bullet Points
  bulletPoint: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  
  // Question Analysis
  questionAnalysis: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  questionNumber: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  miniScores: {
    flexDirection: "row",
  },
  miniScore: {
    color: colors.textSecondary,
    fontSize: 11,
    marginLeft: 8,
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  feedbackText: { 
    color: colors.text, 
    fontSize: 14, 
    lineHeight: 20 
  },
  
  // Button Styles
  btnWrap: { 
    borderRadius: 16, 
    overflow: "hidden",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
  },
  btn: { 
    paddingVertical: 18, 
    alignItems: "center" 
  },
  btnText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "700" 
  },
});
