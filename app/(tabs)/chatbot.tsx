import { globalStyles } from "@/styles/global-styles";
import { homeStyles } from "@/styles/home-styles";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { askAnemiaAssistant, ChatMessage } from "../../lib/anemiaChat";

const initialGreeting: ChatMessage = {
  role: "bot",
  text: "Hola, soy tu asistente sobre anemia. Pregúntame síntomas, prevención, estudios o dudas generales.",
};

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const reply = await askAnemiaAssistant(trimmed);
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al obtener respuesta.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";
    return (
      <View style={[styles.messageRow, isUser ? styles.rowEnd : styles.rowStart]}>
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={styles.author}>{isUser ? "Tú" : "Asistente"}</Text>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={homeStyles.screen}>   
      <Stack.Screen
        options={{
          title: "Chat sobre anemia",
          headerShown: false,
        }}
      />     
      <View style={globalStyles.headerContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#AAAAAA" />
          <Text style={[globalStyles.titleapp, { marginLeft: 10 }]}>
            Chat sobre anemia
          </Text>
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, index) => `msg-${index}`}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        style={styles.chatList}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={-80}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Escribe tu pregunta sobre anemia..."
              placeholderTextColor="#7A8194"
              multiline
              maxLength={500}
              autoCapitalize="sentences"
              autoCorrect={true}
              onFocus={() => {
                setTimeout(() => {
                  listRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
            />
            <TouchableOpacity
              style={[styles.sendButton, loading || !input.trim() ? styles.sendButtonDisabled : null]}
              onPress={sendMessage}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Ionicons name="send" size={22} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  chatList: {
    flex: 1,
  },
  listContent: {

  },
  messageRow: {
    marginVertical: 8,
    flexDirection: "row",
    paddingHorizontal: 4,
  },
  rowEnd: {
    justifyContent: "flex-end",
  },
  rowStart: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "75%",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userBubble: {
    backgroundColor: "#48BBAA",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "#2A3142",
    borderBottomLeftRadius: 4,
  },
  author: {
    fontSize: 11,
    color: "#A5F2E6",
    marginBottom: 4,
    fontFamily: "ArvoBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  messageText: {
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "ArvoRegular",
  },
  inputContainer: {
    backgroundColor: "#1E1E2C",
    paddingTop: 12,
    paddingBottom: 95,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#2F3A4A",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#262D3A",
    borderRadius: 28,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: "#3A4A5A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 100,
    color: "#ffffff",
    fontSize: 15,
    fontFamily: "ArvoRegular",
    paddingVertical: 10,
    paddingRight: 8,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#48BBAA",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    shadowColor: "#48BBAA",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  sendButtonDisabled: {
    opacity: 0.4,
    backgroundColor: "#3A4A5A",
    shadowOpacity: 0.2,
  },
  error: {
    color: "#FF6B6B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#2A1F1F",
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    fontFamily: "ArvoRegular",
    fontSize: 13,
  },
});
