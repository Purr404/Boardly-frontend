import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OwnerDashboardScreen() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [barangay, setBarangay] = useState('');

  useEffect(() => {
    fetchMyRooms();
  }, []);

  const fetchMyRooms = async () => {
    try {
      const response = await api.get('/rooms?owner=true');
      setRooms(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setRooms([]);
    }
  };

  const postRoom = async () => {
    if (!title || !description || !price || !province || !city || !barangay) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
      await api.post('/rooms', {
        title,
        description,
        price: parseFloat(price),
        province,
        city,
        barangay,
        images: [],
      });
      Alert.alert('Success', 'Room posted');
      setTitle('');
      setDescription('');
      setPrice('');
      setProvince('');
      setCity('');
      setBarangay('');
      fetchMyRooms();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to post');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Post a New Room</Text>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} multiline />
      <TextInput style={styles.input} placeholder="Monthly Rent (₱)" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Province" value={province} onChangeText={setProvince} />
      <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
      <TextInput style={styles.input} placeholder="Barangay" value={barangay} onChangeText={setBarangay} />
      <TouchableOpacity style={styles.postButton} onPress={postRoom}>
        <Text style={styles.buttonText}>Post Room</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>My Rooms</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <View style={styles.roomCard}>
            <Text style={styles.roomTitle}>{item.title}</Text>
            <Text>₱{item.price}/month</Text>
            <Text>{item.barangay}, {item.city}, {item.province}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No rooms posted yet.</Text>}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  postButton: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  roomCard: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 8 },
  roomTitle: { fontWeight: 'bold', fontSize: 16 },
});