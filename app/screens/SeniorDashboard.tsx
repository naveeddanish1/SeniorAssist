import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SeniorDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Senior Dashboard</Text>

      <Text style={styles.subtitle}>Welcome to SeniorAssist</Text>

      <TouchableOpacity
        style={styles.requestButton}
        onPress={() => router.push("/screens/RequestHelp")}
      >
        <Text style={styles.requestButtonText}>Request Help</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    color: "#555",
  },

  requestButton: {
    backgroundColor: "#1f6feb",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 25,
  },

  requestButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
