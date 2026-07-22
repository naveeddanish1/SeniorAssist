import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getUserRole, loginUser } from "../../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setMessage("");
    setIsSuccess(false);

    if (!email.trim() || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const user = await loginUser(email, password);
      const role = await getUserRole(user.uid);

      setIsSuccess(true);
      setMessage(`Welcome back! ${user.email}`);

      if (role === "Senior") {
        router.replace("/screens/SeniorDashboard");
      } else if (role === "Helper") {
        router.replace("/screens/HelperDashboard");
      } else if (role === "Family") {
        router.replace("/screens/FamilyDashboard");
      } else {
        setIsSuccess(false);
        setMessage("Your account role is not recognized.");
      }
    } catch (error: any) {
      setIsSuccess(false);

      switch (error.code) {
        case "auth/invalid-email":
          setMessage("Please enter a valid email address.");
          break;

        case "auth/invalid-credential":
          setMessage("Incorrect email or password.");
          break;

        case "auth/too-many-requests":
          setMessage("Too many attempts. Please try again later.");
          break;

        case "auth/network-request-failed":
          setMessage("Network error. Please check your internet connection.");
          break;

        default:
          setMessage("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Welcome back to SeniorAssist</Text>

        {message ? (
          <Text style={isSuccess ? styles.successMessage : styles.errorMessage}>
            {message}
          </Text>
        ) : null}

        <Text style={styles.label}>Email address</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Password</Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />

          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.showButton}
          >
            <Text style={styles.showButtonText}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.optionsRow}>
          <Pressable
            style={styles.rememberContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View
              style={[styles.checkbox, rememberMe && styles.checkboxSelected]}
            >
              {rememberMe ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>

            <Text style={styles.rememberText}>Remember me</Text>
          </Pressable>

          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Don&apos;t have an account?</Text>

          <TouchableOpacity onPress={() => router.push("/screens/Register")}>
            <Text style={styles.registerLink}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f4f6f8",
  },

  card: {
    width: "100%",
    maxWidth: 450,
    backgroundColor: "white",
    padding: 25,
    borderRadius: 16,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 25,
    color: "#555",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    width: "100%",
    height: 52,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 18,
  },

  passwordContainer: {
    width: "100%",
    height: 52,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    fontSize: 16,
  },

  showButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  showButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  checkboxSelected: {
    backgroundColor: "#1f6feb",
    borderColor: "#1f6feb",
  },

  checkmark: {
    color: "white",
    fontWeight: "bold",
  },

  rememberText: {
    fontSize: 14,
  },

  forgotText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f6feb",
  },

  loginButton: {
    width: "100%",
    height: 54,
    backgroundColor: "#1f6feb",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },

  disabledButton: {
    opacity: 0.6,
  },

  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  registerText: {
    fontSize: 15,
    marginRight: 5,
  },

  registerLink: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1f6feb",
  },

  successMessage: {
    color: "green",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 18,
  },

  errorMessage: {
    color: "red",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 18,
  },
});
