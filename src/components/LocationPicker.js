import React from 'react';
import { View, Text, Picker, StyleSheet } from 'react-native';

export default function LocationPicker({ province, city, barangay, onProvinceChange, onCityChange, onBarangayChange }) {
  // Hardcoded test data
  const provinces = ['Zamboanga del Sur'];
  const cities = ['Pagadian City', 'Aurora', 'Bayog'];
  const barangays = ['Barangay 1', 'Barangay 2', 'Barangay 3'];

  return (
    <View>
      <Text style={styles.label}>Province</Text>
      <Picker selectedValue={province} onValueChange={onProvinceChange} style={styles.picker}>
        <Picker.Item label="Select Province" value="" />
        {provinces.map(p => <Picker.Item key={p} label={p} value={p} />)}
      </Picker>

      <Text style={styles.label}>City/Municipality</Text>
      <Picker selectedValue={city} onValueChange={onCityChange} style={styles.picker}>
        <Picker.Item label="Select City" value="" />
        {cities.map(c => <Picker.Item key={c} label={c} value={c} />)}
      </Picker>

      <Text style={styles.label}>Barangay</Text>
      <Picker selectedValue={barangay} onValueChange={onBarangayChange} style={styles.picker}>
        <Picker.Item label="Select Barangay" value="" />
        {barangays.map(b => <Picker.Item key={b} label={b} value={b} />)}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 8 },
});