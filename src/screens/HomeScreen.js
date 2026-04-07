import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';
import RoomCard from '../components/RoomCard';

export default function HomeScreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [barangay, setBarangay] = useState('');

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (province) params.province = province;
      if (city) params.city = city;
      if (barangay) params.barangay = barangay;
      const response = await api.get('/rooms', { params });
      setRooms(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [search, province, city, barangay]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title or location"
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.filterRow}>
        <TextInput style={styles.filterInput} placeholder="Province" value={province} onChangeText={setProvince} />
        <TextInput style={styles.filterInput} placeholder="City" value={city} onChangeText={setCity} />
        <TextInput style={styles.filterInput} placeholder="Barangay" value={barangay} onChangeText={setBarangay} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => <RoomCard room={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  searchInput: { backgroundColor: 'white', borderRadius: 25, padding: 12, marginBottom: 12, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  filterInput: { flex: 1, backgroundColor: 'white', borderRadius: 25, padding: 8, marginHorizontal: 4, borderWidth: 1, borderColor: '#ddd' },
});