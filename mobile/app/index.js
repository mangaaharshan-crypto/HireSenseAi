import { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { colors } from "../constants/theme";

export default function Splash() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => {
        if (user) {
          router.replace("/role");
        } else {
          router.replace("/login");
        }
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [user, loading, router]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
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
            <View style={[styles.circuitLine, { width: 40, height: 2 }]} />
            <View style={[styles.circuitLine, { width: 25, height: 2, top: 15 }]} />
            <View style={[styles.circuitNode, { top: -5, left: 45 }]} />
            <View style={[styles.circuitNode, { top: 10, left: 30 }]} />
          </View>
        </View>
      </View>
      <Text style={styles.logo}>HireSense</Text>
      <View style={styles.aiContainer}>
        <Text style={styles.sub}>AI</Text>
      </View>
      <ActivityIndicator size="large" color={colors.primary} style={styles.spinner} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 20,
  },
  headProfile: {
    width: 80,
    height: 80,
    position: "relative",
  },
  headMain: {
    width: 60,
    height: 60,
    borderRadius: 30,
    flexDirection: "row",
    overflow: "hidden",
    position: "absolute",
    top: 10,
    left: 10,
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
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 2,
    borderColor: "#000080",
    position: "absolute",
  },
  chakraSpokes: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 1,
    borderColor: "#000080",
    transform: [{ rotate: "45deg" }],
  },
  circuitBoard: {
    position: "absolute",
    top: 20,
    right: -5,
  },
  circuitLine: {
    backgroundColor: "#FF6B35",
    position: "absolute",
    right: 0,
  },
  circuitNode: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    borderWidth: 1,
    borderColor: "#138808",
  },
  logo: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  aiContainer: {
    backgroundColor: "#000080",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 20,
  },
  sub: {
    fontSize: 18,
    color: colors.text,
    fontWeight: "700",
  },
  spinner: { marginTop: 32 },
});
