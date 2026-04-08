import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';
import RoomCard from '../components/RoomCard';
import LocationPicker from '../components/LocationPicker';

export default function HomeScreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [barangay, setBarangay] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (province) params.province = province;
        if (city) params.city = city;
        if (barangay) params.barangay = barangay;
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
  }, [search, province, city, barangay]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by title or location"
        value={search}
        onChangeText={setSearch}
      />
      <LocationPicker
        province={province}
        city={city}
        barangay={barangay}
        onProvinceChange={setProvince}
        onCityChange={setCity}
        onBarangayChange={setBarangay}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
          renderItem={({ item }) => <RoomCard room={item} onPress={() => {}} />}
          ListEmptyComponent={<Text>No rooms found.</Text>}
        />
      )}
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