import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import LocationPicker from '../components/LocationPicker';

export default function LocationSelectorScreen({ route, navigation }) {
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [barangay, setBarangay] = useState('');

  const applyFilters = () => {
    const filters = {};
    if (province) filters.province = province;
    if (city) filters.city = city;
    if (barangay) filters.barangay = barangay;
    route.params?.onApply(filters);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Location</Text>
      <LocationPicker
        province={province}
        city={city}
        barangay={barangay}
        onProvinceChange={setProvince}
        onCityChange={setCity}
        onBarangayChange={setBarangay}
      />
      <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
        <Text style={styles.buttonText}>Apply Filters</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  applyButton: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});