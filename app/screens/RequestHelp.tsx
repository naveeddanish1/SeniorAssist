import { router } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { createHelpRequest } from "../../services/authService";

export default function RequestHelp() {
  const [requestType, setRequestType] = useState("");
  const [description, setDescription] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    setMessage("");

    if (
      !requestType.trim() ||
      !description.trim() ||
      !preferredDate.trim() ||
      !preferredTime.trim()
    ) {
      setMessage("Please complete all fields.");
      return;
    }

    try {
      await createHelpRequest({
        requestType,
        description,
        preferredDate,
        preferredTime,
      });

      setMessage("Your help request was submitted successfully.");

      setRequestType("");
      setDescription("");
      setPreferredDate("");
      setPreferredTime("");

      setTimeout(() => {
        router.replace("/screens/SeniorDashboard");
      }, 1200);
    } catch (error: any) {
      setMessage(error.message || "Unable to submit the request.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.title}>Request Help</Text>

        <Text style={styles.subtitle}>Tell us what kind of help you need.</Text>

        {message ? <Text style={styles.message}>{message}</Text> : null}

        <Text style={styles.label}>Type of help</Text>

        <TextInput
          style={styles.input}
          placeholder="Example: Grocery shopping"
          value={requestType}
          onChangeText={setRequestType}
        />

        <Text style={styles.label}>Description</Text>

        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Describe what you need help with"
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.label}>Preferred date</Text>

        <TextInput
          style={styles.input}
          placeholder="Example: July 25, 2026"
          value={preferredDate}
          onChangeText={setPreferredDate}
        />

        <Text style={styles.label}>Preferred time</Text>

        <TextInput
          style={styles.input}
          placeholder="Example: 2:00 PM"
          value={preferredTime}
          onChangeText={setPreferredTime}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Request</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f6f8",
  },

  card: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 16,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },

  message: {
    color: "#d32f2f",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 18,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    width: "100%",
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 18,
  },

  descriptionInput: {
    minHeight: 120,
  },

  submitButton: {
    backgroundColor: "#1f6feb",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },

  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
