import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../context/AuthContext";
import { FlowProvider } from "../context/FlowContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <FlowProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#1a1a2e" },
            headerTintColor: "#f8fafc",
            headerTitleStyle: { fontWeight: "600" },
            contentStyle: { backgroundColor: "#0f0f1a" },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ title: "Sign In" }} />
          <Stack.Screen name="signup" options={{ title: "Create Account" }} />
          <Stack.Screen name="role" options={{ title: "Select Role" }} />
          <Stack.Screen name="upload" options={{ title: "Upload Resume" }} />
          <Stack.Screen name="interview" options={{ title: "Interview" }} />
          <Stack.Screen name="result" options={{ title: "Result", headerBackVisible: false }} />
          <Stack.Screen name="privacy" options={{ title: "Privacy Policy" }} />
          <Stack.Screen name="terms" options={{ title: "Terms & Conditions" }} />
        </Stack>
      </FlowProvider>
    </AuthProvider>
  );
}
