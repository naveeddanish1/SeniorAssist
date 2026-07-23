import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { getAuth } from "firebase/auth";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    ChatMessage,
    getChatMessages,
    sendChatMessage,
} from "../../services/authService";

export default function ChatScreen() {
  const { requestId } = useLocalSearchParams<{ requestId: string }>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const currentUserId = getAuth().currentUser?.uid;

  const loadMessages = useCallback(async () => {
    if (!requestId) {
      setLoading(false);
      return;
    }

    try {
      const loadedMessages = await getChatMessages(requestId);
      setMessages(loadedMessages);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to load messages.";

      Alert.alert("Chat Error", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useFocusEffect(
    useCallback(() => {
      loadMessages();
    }, [loadMessages]),
  );

  async function handleSendMessage() {
    if (!requestId || !newMessage.trim()) {
      return;
    }

    try {
      setSending(true);

      await sendChatMessage(requestId, newMessage);

      setNewMessage("");
      await loadMessages();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to send message.";

      Alert.alert("Message Error", errorMessage);
    } finally {
      setSending(false);
    }
  }

  if (!requestId) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Help request was not found.</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <Text style={styles.title}>Request Chat</Text>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No messages yet. Send the first message.
            </Text>
          }
          renderItem={({ item }) => {
            const isMyMessage = item.senderId === currentUserId;

            return (
              <View
                style={[
                  styles.messageBubble,
                  isMyMessage
                    ? styles.myMessageBubble
                    : styles.otherMessageBubble,
                ]}
              >
                <Text style={styles.senderName}>
                  {isMyMessage ? "You" : item.senderName}
                </Text>

                <Text style={styles.messageText}>{item.message}</Text>
              </View>
            );
          }}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />

        <Pressable
          style={[
            styles.sendButton,
            (!newMessage.trim() || sending) && styles.disabledButton,
          ]}
          onPress={handleSendMessage}
          disabled={!newMessage.trim() || sending}
        >
          <Text style={styles.sendButtonText}>
            {sending ? "Sending..." : "Send"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 17,
    color: "#b00020",
  },
  messageList: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    flexGrow: 1,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 40,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  myMessageBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#d7f7d0",
  },
  otherMessageBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
  },
  senderName: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#444",
  },
  messageText: {
    fontSize: 16,
    color: "#222",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 110,
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  sendButton: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 10,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
