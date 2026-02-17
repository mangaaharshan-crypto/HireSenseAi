import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "../constants/theme";

export default function Terms() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Terms & Conditions</Text>
      <Text style={styles.updated}>Last updated: February 2026</Text>

      <Text style={styles.heading}>1. Acceptance</Text>
      <Text style={styles.body}>
        By using HireSense AI you agree to these terms. If you do not agree, do not use the service.
      </Text>

      <Text style={styles.heading}>2. Service description</Text>
      <Text style={styles.body}>
        HireSense AI provides an AI-powered resume and interview assessment tool. We screen resumes, generate
        role-based questions, and analyze your answers to produce scores and recommendations. Results are for
        informational and assessment purposes.
      </Text>

      <Text style={styles.heading}>3. User obligations</Text>
      <Text style={styles.body}>
        You must provide accurate information and use the app in good faith. You may not misuse the service, attempt
        to circumvent security, or use it for any illegal purpose. You are responsible for the content you upload
        and the answers you submit.
      </Text>

      <Text style={styles.heading}>4. Intellectual property</Text>
      <Text style={styles.body}>
        The HireSense AI app, branding, and technology are owned by us or our licensors. You retain ownership of
        your resume and answers; you grant us a license to process them to provide the service.
      </Text>

      <Text style={styles.heading}>5. Limitation of liability</Text>
      <Text style={styles.body}>
        The service is provided "as is." We are not liable for decisions made by third parties (e.g. employers)
        based on assessment results. Our liability is limited to the extent permitted by law.
      </Text>

      <Text style={styles.heading}>6. Changes</Text>
      <Text style={styles.body}>
        We may update these terms from time to time. Continued use of the app after changes constitutes
        acceptance. We will notify you of material changes where required.
      </Text>

      <Text style={styles.heading}>7. Contact</Text>
      <Text style={styles.body}>
        For questions: support@hiresense.ai
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: "700", color: colors.text, marginBottom: 8 },
  updated: { color: colors.textSecondary, marginBottom: 24, fontSize: 14 },
  heading: { fontSize: 16, fontWeight: "600", color: colors.text, marginTop: 16, marginBottom: 8 },
  body: { color: colors.textSecondary, lineHeight: 22, marginBottom: 8 },
});
