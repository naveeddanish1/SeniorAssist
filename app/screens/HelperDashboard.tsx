import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  acceptHelpRequest,
  completeHelpRequest,
  getAcceptedHelpRequests,
  getPendingHelpRequests,
  startHelpRequest,
} from "../../services/authService";

import type { HelpRequest } from "../../services/authService";

export default function HelperDashboard() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setMessage("");

      const pendingRequests = await getPendingHelpRequests();
      const helperAcceptedRequests = await getAcceptedHelpRequests();

      setRequests(pendingRequests);
      setAcceptedRequests(helperAcceptedRequests);
    } catch (error: any) {
      setMessage(error.message || "Unable to load requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      setMessage("");

      await acceptHelpRequest(requestId);

      await loadRequests();
    } catch (error: any) {
      setMessage(error.message || "Unable to accept the request.");
    }
  };

  const handleStartJob = async (requestId: string) => {
    try {
      setMessage("");

      await startHelpRequest(requestId);

      await loadRequests();
    } catch (error: any) {
      setMessage(error.message || "Unable to start the job.");
    }
  };

  const handleCompleteJob = async (requestId: string) => {
    try {
      setMessage("");

      await completeHelpRequest(requestId);

      await loadRequests();
    } catch (error: any) {
      setMessage(error.message || "Unable to complete the job.");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Helper Dashboard</Text>
      <Text style={styles.subtitle}>Available help requests</Text>

      {loading ? <ActivityIndicator size="large" /> : null}

      {message ? <Text style={styles.errorMessage}>{message}</Text> : null}

      {!loading && requests.length === 0 ? (
        <Text style={styles.emptyMessage}>
          There are no pending help requests.
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

          <Text style={styles.status}>Status: {request.status}</Text>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAcceptRequest(request.id)}
          >
            <Text style={styles.acceptButtonText}>Accept Request</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.sectionTitle}>My Assigned Jobs</Text>

      {!loading && acceptedRequests.length === 0 ? (
        <Text style={styles.emptyMessage}>
          You have not accepted any jobs yet.
        </Text>
      ) : null}

      {acceptedRequests.map((request) => (
        <View key={request.id} style={styles.card}>
          <Text style={styles.requestType}>{request.requestType}</Text>

          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{request.description}</Text>

          <Text style={styles.label}>Preferred date</Text>
          <Text style={styles.value}>{request.preferredDate}</Text>

          <Text style={styles.label}>Preferred time</Text>
          <Text style={styles.value}>{request.preferredTime}</Text>

          <Text style={styles.acceptedStatus}>Status: {request.status}</Text>

          {request.status === "Accepted" ? (
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => handleStartJob(request.id)}
            >
              <Text style={styles.startButtonText}>Start Job</Text>
            </TouchableOpacity>
          ) : request.status === "In Progress" ? (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={() => handleCompleteJob(request.id)}
            >
              <Text style={styles.startButtonText}>Complete Job</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.completedBox}>
              <Text style={styles.completedText}>✅ Job Completed</Text>
            </View>
          )}

          <Pressable
            style={styles.chatButton}
            onPress={() =>
              router.push({
                pathname: "/screens/ChatScreen",
                params: { requestId: request.id },
              })
            }
          >
            <Text style={styles.chatButtonText}>Open Chat</Text>
          </Pressable>
        </View>
      ))}

      <TouchableOpacity style={styles.refreshButton} onPress={loadRequests}>
        <Text style={styles.refreshButtonText}>Refresh Requests</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f4f6f8",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 17,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },

  card: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
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
    color: "#d97706",
    marginTop: 16,
    marginBottom: 16,
  },

  acceptButton: {
    backgroundColor: "#1f6feb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  acceptButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
  },

  refreshButton: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#1f6feb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
  },

  refreshButtonText: {
    color: "#1f6feb",
    fontSize: 16,
    fontWeight: "bold",
  },

  emptyMessage: {
    textAlign: "center",
    fontSize: 17,
    color: "#666",
    marginTop: 40,
    marginBottom: 30,
  },

  errorMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#d32f2f",
    marginBottom: 20,
  },

  acceptedStatus: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
    marginTop: 16,
    marginBottom: 8,
  },

  sectionTitle: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 16,
  },

  startButton: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },

  startButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
  },

  completeButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },

  completedBox: {
    backgroundColor: "#dcfce7",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },

  completedText: {
    color: "#15803d",
    fontWeight: "bold",
    fontSize: 17,
  },

  chatButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  chatButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
