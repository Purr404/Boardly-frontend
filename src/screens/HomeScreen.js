import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';
import RoomCard from '../components/RoomCard';

export default function HomeScreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        const response = await api.get('/rooms', { params });
        setRooms(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [search]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title or location"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={rooms}
        keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => <RoomCard room={item} onPress={() => {}} />}
        ListEmptyComponent={<Text>No rooms found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});