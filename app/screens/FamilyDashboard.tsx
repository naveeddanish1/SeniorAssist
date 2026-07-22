import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { logoutUser } from "../../services/authService";

export default function FamilyDashboard() {
  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/screens/Login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👨‍👩‍👧 Family Dashboard</Text>
      <Text style={styles.subtitle}>Welcome to SeniorAssist</Text>

      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>📍 My Senior</Text>
        <Text style={styles.cardText}>
          View your loved one&apos;s information.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>💬 Messages</Text>
        <Text style={styles.cardText}>Chat with seniors and helpers.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>🔔 Notifications</Text>
        <Text style={styles.cardText}>View recent updates.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardTitle}>👤 Profile</Text>
        <Text style={styles.cardText}>Update your personal information.</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    padding: 20,
    justifyContent: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },

  cardText: {
    color: "#555",
  },

  logoutButton: {
    backgroundColor: "#d32f2f",
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
  },

  logoutText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});
