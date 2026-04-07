import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';

export default function InboxScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const response = await api.get('/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchConversations);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return <ActivityIndicator size="large" color="#4CAF50" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={item => item.id.toString()}
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
              <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  conversationItem: { flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: 'white', fontWeight: 'bold', fontSize: 20 },
  conversationInfo: { flex: 1 },
  partnerName: { fontWeight: 'bold', fontSize: 16 },
  lastMessage: { color: '#666', marginTop: 4 },
});