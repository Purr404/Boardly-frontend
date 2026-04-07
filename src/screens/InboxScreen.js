import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function InboxScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/conversations');
      // Ensure we always set an array
      setConversations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchConversations);
    fetchConversations(); // initial load
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => navigation.navigate('Chat', { conversationId: item.id, name: item.partnerName })}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.partnerName?.charAt(0) || '?'}</Text>
            </View>
            <View style={styles.conversationInfo}>
              <Text style={styles.partnerName}>{item.partnerName}</Text>
              <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage || 'No messages yet'}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No conversations yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  conversationItem: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: 'white', fontWeight: 'bold', fontSize: 20 },
  conversationInfo: { flex: 1 },
  partnerName: { fontWeight: 'bold', fontSize: 16 },
  lastMessage: { color: '#666', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#666' },
});