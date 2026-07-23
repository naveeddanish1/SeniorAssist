import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  getSeniorHelpRequests,
  type HelpRequest,
} from "../../services/authService";

export default function SeniorDashboard() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setMessage("");

      const seniorRequests = await getSeniorHelpRequests();

      setRequests(seniorRequests);
    } catch (error: any) {
      setMessage(error.message || "Unable to load your requests.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, []),
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Senior Dashboard</Text>

      <Text style={styles.subtitle}>Welcome to SeniorAssist</Text>

      <TouchableOpacity
        style={styles.requestButton}
        onPress={() => router.push("/screens/RequestHelp")}
      >
        <Text style={styles.requestButtonText}>Request Help</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>My Requests</Text>

      {loading ? <ActivityIndicator size="large" /> : null}

      {message ? <Text style={styles.errorMessage}>{message}</Text> : null}

      {!loading && requests.length === 0 ? (
        <Text style={styles.emptyMessage}>
          You have not created any help requests yet.
        </Text>
      ) : null}

      {requests.map((request) => (
        <View key={request.id} style={styles.card}>
          <Text style={styles.requestType}>{request.requestType}</Text>

          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{request.description}</Text>

          <Text style={styles.label}>Preferred date</Text>
          <Text style={styles.value}>{request.preferredDate}</Text>

          <Text style={styles.label}>Preferred time</Text>
          <Text style={styles.value}>{request.preferredTime}</Text>

          <Text
            style={[
              styles.status,
              request.status === "Pending"
                ? styles.pendingStatus
                : request.status === "Accepted"
                  ? styles.acceptedStatus
                  : request.status === "In Progress"
                    ? styles.inProgressStatus
                    : styles.completedStatus,
            ]}
          >
            Status: {request.status}
          </Text>
        </View>
      ))}

      <TouchableOpacity style={styles.refreshButton} onPress={loadRequests}>
        <Text style={styles.refreshButtonText}>Refresh My Requests</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#f4f6f8",
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    color: "#555",
  },

  requestButton: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: "#1f6feb",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },

  requestButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },

  sectionTitle: {
    width: "100%",
    maxWidth: 600,
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 35,
    marginBottom: 16,
  },

  card: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 14,
    marginBottom: 18,
    elevation: 2,
  },

  requestType: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textTransform: "capitalize",
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginTop: 8,
  },

  value: {
    fontSize: 16,
    marginTop: 4,
  },

  status: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f6feb",
    marginTop: 16,
  },

  pendingStatus: {
    color: "#d97706",
  },

  acceptedStatus: {
    color: "#2563eb",
  },

  inProgressStatus: {
    color: "#9333ea",
  },

  completedStatus: {
    color: "#16a34a",
  },

  emptyMessage: {
    fontSize: 17,
    color: "#666",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 30,
  },

  errorMessage: {
    fontSize: 16,
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: 20,
  },

  refreshButton: {
    width: "100%",
    maxWidth: 600,
    borderWidth: 1,
    borderColor: "#1f6feb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  refreshButtonText: {
    color: "#1f6feb",
    fontSize: 16,
    fontWeight: "bold",
  },
});
