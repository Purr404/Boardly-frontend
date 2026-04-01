import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import api from '../services/api';
import RoomCard from '../components/RoomCard';

export default function HomeScreen({ navigation }) {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchRooms();
  }, [filters]);

  const fetchRooms = async () => {
    try {
      const params = {};
      if (filters.province) params.province = filters.province;
      if (filters.city) params.city = filters.city;
      if (filters.barangay) params.barangay = filters.barangay;
      const response = await api.get('/rooms', { params });
      setRooms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.filterButton} onPress={() => navigation.navigate('LocationSelector', { onApply: setFilters })}>
        <Text>Filter by Location</Text>
      </TouchableOpacity>
      <FlatList
        data={rooms}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <RoomCard room={item} onPress={() => navigation.navigate('RoomDetails', { roomId: item.id })} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  filterButton: { padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 10, alignItems: 'center' },
});