import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>SeniorAssist</Text>

      <Text style={styles.subtitle}>Helping seniors live independently</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/screens/Login")}
      >
        <Text style={styles.buttonText}>Request Help</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.push("/screens/Register")}
      >
        <Text style={styles.secondaryText}>Create Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 25,
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    width: 220,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },

  buttonText: {
    color: "purple",
    fontSize: 18,
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "purple",
    padding: 12,
    width: 220,
    borderRadius: 10,
    alignItems: "center",
  },

  secondaryText: {
    fontSize: 18,
    color: "purple",
  },
});
