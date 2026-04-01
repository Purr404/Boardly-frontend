import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import api from '../services/api';
import LocationPicker from '../components/LocationPicker';

export default function PostListingScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [barangay, setBarangay] = useState('');
  const [images, setImages] = useState([]); // simplified – ignore file upload for now

  const handleSubmit = async () => {
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
        images,
      });
      Alert.alert('Success', 'Listing posted!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to post');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, { height: 100 }]} multiline value={description} onChangeText={setDescription} />

      <Text style={styles.label}>Monthly Rent (₱)</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={price} onChangeText={setPrice} />

      <LocationPicker
        province={province}
        city={city}
        barangay={barangay}
        onProvinceChange={setProvince}
        onCityChange={setCity}
        onBarangayChange={setBarangay}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Post Listing</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 8 },
  button: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});