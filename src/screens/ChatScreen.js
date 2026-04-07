import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../services/api';

export default function ChatScreen({ route }) {
  const { conversationId, name } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/messages/${conversationId}`);
      setMessages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;
    try {
      await api.post('/messages', { conversationId, content: inputText });
      setInputText('');
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // poll every 3s – replace with WebSocket for real‑time
    return () => clearInterval(interval);
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, item.senderId === 'me' ? styles.sent : styles.received]}>
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
        )}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  messageBubble: { maxWidth: '80%', padding: 10, borderRadius: 20, marginVertical: 5, marginHorizontal: 10 },
  sent: { alignSelf: 'flex-end', backgroundColor: '#4CAF50' },
  received: { alignSelf: 'flex-start', backgroundColor: '#e5e5e5' },
  messageText: { fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 25, padding: 10, marginRight: 10 },
  sendButton: { backgroundColor: '#4CAF50', borderRadius: 25, paddingHorizontal: 20, justifyContent: 'center' },
  sendButtonText: { color: 'white', fontWeight: 'bold' },
});