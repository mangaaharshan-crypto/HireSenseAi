import { View, Text, StyleSheet, ScrollView } from "react-native";
import { colors } from "../constants/theme";

export default function Privacy() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.updated}>Last updated: February 2026</Text>

      <Text style={styles.heading}>1. Information we collect</Text>
      <Text style={styles.body}>
        When you use HireSense AI, we collect the information you provide: account details (email, name), resume files
        you upload, and your interview answers. This data is used to run the assessment and generate your score.
      </Text>

      <Text style={styles.heading}>2. How we use your data</Text>
      <Text style={styles.body}>
        Your resume and answers are processed by our systems (including AI) to evaluate fit for the selected role and
        to produce technical, clarity, and authenticity scores. We do not sell your personal data to third parties.
      </Text>

      <Text style={styles.heading}>3. Data storage and security</Text>
      <Text style={styles.body}>
        Account and assessment data are stored securely. We use industry-standard measures to protect your
        information. Resume and interview data may be retained for the purpose of providing the service and improving
        our models, in accordance with applicable law.
      </Text>

      <Text style={styles.heading}>4. Your rights</Text>
      <Text style={styles.body}>
        You may request access to, correction of, or deletion of your personal data by contacting us. You can
        delete your account at any time from within the app or by contacting support.
      </Text>

      <Text style={styles.heading}>5. Contact</Text>
      <Text style={styles.body}>
        For privacy-related questions, contact us at: privacy@hiresense.ai
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
