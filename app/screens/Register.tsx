import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { registerUser } from "../../services/authService";

type UserRole = "Senior" | "Helper" | "Family";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCreateAccount = async () => {
    setMessage("");
    setIsSuccess(false);

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      setMessage("Please complete all fields and select your role.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!agreedToTerms) {
      setMessage("Please agree to the Terms and Conditions.");
      return;
    }

    try {
      await registerUser({
        name,
        email,
        phone,
        password,
        role,
      });

      setIsSuccess(true);
      setMessage("🎉 Account created successfully!");

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setRole(null);
      setAgreedToTerms(false);
    } catch (error: any) {
      setMessage(error.message);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.subtitle}>
          Join SeniorAssist to request or provide help.
        </Text>

        <Text style={styles.label}>Full name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#777"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

        <Text style={styles.label}>Email address</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#777"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Phone number</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          placeholderTextColor="#777"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Password</Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Minimum 6 characters"
            placeholderTextColor="#777"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />

          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.showText}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.label}>Confirm password</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter password again"
          placeholderTextColor="#777"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />

        <Text style={styles.label}>I am registering as:</Text>

        <View style={styles.roleContainer}>
          {(["Senior", "Helper", "Family"] as UserRole[]).map((item) => (
            <Pressable
              key={item}
              style={[styles.roleButton, role === item && styles.selectedRole]}
              onPress={() => setRole(item)}
            >
              <Text
                style={[
                  styles.roleText,
                  role === item && styles.selectedRoleText,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.termsRow}
          onPress={() => setAgreedToTerms(!agreedToTerms)}
        >
          <View
            style={[styles.checkbox, agreedToTerms && styles.checkboxSelected]}
          >
            {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>

          <Text style={styles.termsText}>
            I agree to the Terms and Conditions
          </Text>
        </Pressable>

        {message !== "" && (
          <Text style={isSuccess ? styles.successMessage : styles.errorMessage}>
            {message}
          </Text>
        )}

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateAccount}
        >
          <Text style={styles.createButtonText}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 70,
    paddingBottom: 50,
  },

  title: {
    color: "#111111",
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 8,
  },

  subtitle: {
    color: "#555555",
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 28,
  },

  label: {
    color: "#222222",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    width: "100%",
    height: 54,
    color: "#111111",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#b7b7b7",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 17,
    marginBottom: 20,
  },

  passwordContainer: {
    width: "100%",
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#b7b7b7",
    borderRadius: 10,
    marginBottom: 20,
    paddingRight: 15,
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    color: "#111111",
    paddingHorizontal: 15,
    fontSize: 17,
  },

  showText: {
    color: "#087ef5",
    fontSize: 16,
    fontWeight: "600",
  },

  roleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },

  roleButton: {
    flex: 1,
    minHeight: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#888888",
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },

  selectedRole: {
    backgroundColor: "#087ef5",
    borderColor: "#087ef5",
  },

  roleText: {
    color: "#222222",
    fontSize: 15,
    fontWeight: "600",
  },

  selectedRoleText: {
    color: "#ffffff",
  },

  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "#777777",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  checkboxSelected: {
    backgroundColor: "#087ef5",
    borderColor: "#087ef5",
  },

  checkmark: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  termsText: {
    color: "#222222",
    fontSize: 16,
    flex: 1,
  },

  errorMessage: {
    color: "#b00020",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },

  successMessage: {
    color: "#087a32",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 16,
  },

  createButton: {
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#087ef5",
    borderRadius: 10,
  },

  createButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
});
