import React from 'react';
import { View, Text, Picker, StyleSheet } from 'react-native';
import { locationData } from '../utils/locationData';

export default function LocationPicker({ province, city, barangay, onProvinceChange, onCityChange, onBarangayChange }) {
  const provinces = locationData?.provinces || [];
  const cities = (province && locationData?.cities?.[province]) || [];
  const barangays = (city && locationData?.barangays?.[city]) || [];

  return (
    <View>
      <Text style={styles.label}>Province</Text>
      <Picker selectedValue={province} onValueChange={onProvinceChange} style={styles.picker}>
        <Picker.Item label="Select Province" value="" />
        {provinces.map(p => <Picker.Item key={p} label={p} value={p} />)}
      </Picker>

      <Text style={styles.label}>City/Municipality</Text>
      <Picker selectedValue={city} onValueChange={onCityChange} style={styles.picker} enabled={!!province}>
        <Picker.Item label="Select City" value="" />
        {cities.map(c => <Picker.Item key={c} label={c} value={c} />)}
      </Picker>

      <Text style={styles.label}>Barangay</Text>
      <Picker selectedValue={barangay} onValueChange={onBarangayChange} style={styles.picker} enabled={!!city}>
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