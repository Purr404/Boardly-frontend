import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';

export default function LocationPicker({ province, city, barangay, onProvinceChange, onCityChange, onBarangayChange }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [options, setOptions] = useState([]);

  // Hardcoded data for now (replace with locationData later)
  const provinces = ['Zamboanga del Sur'];
  const cities = ['Pagadian City', 'Aurora', 'Bayog', 'Dimataling', 'Dinas', 'Dumalinao', 'Dumingag', 'Guipos', 'Josefina', 'Kumalarang', 'Labangan', 'Lakewood', 'Lapuyan', 'Mahayag', 'Margosatubig', 'Midsalip', 'Molave', 'Pitogo', 'Ramon Magsaysay', 'San Miguel', 'San Pablo', 'Sominot', 'Tabina', 'Tambulig', 'Tigbao', 'Tukuran', 'Vincenzo A. Sagun'];
  const barangays = ['Barangay 1', 'Barangay 2', 'Barangay 3']; // Replace with full list later

  const openPicker = (field, data) => {
    setActiveField(field);
    setOptions(data);
    setModalVisible(true);
  };

  const selectOption = (value) => {
    if (activeField === 'province') {
      onProvinceChange(value);
      onCityChange(''); // reset city
      onBarangayChange(''); // reset barangay
    } else if (activeField === 'city') {
      onCityChange(value);
      onBarangayChange(''); // reset barangay
    } else if (activeField === 'barangay') {
      onBarangayChange(value);
    }
    setModalVisible(false);
    setActiveField(null);
  };

  return (
    <View>
      <Text style={styles.label}>Province</Text>
      <TouchableOpacity style={styles.pickerButton} onPress={() => openPicker('province', provinces)}>
        <Text style={styles.pickerButtonText}>{province || 'Select Province'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>City/Municipality</Text>
      <TouchableOpacity style={styles.pickerButton} onPress={() => province ? openPicker('city', cities) : null}>
        <Text style={styles.pickerButtonText}>{city || (province ? 'Select City' : 'Select province first')}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Barangay</Text>
      <TouchableOpacity style={styles.pickerButton} onPress={() => city ? openPicker('barangay', barangays) : null}>
        <Text style={styles.pickerButtonText}>{barangay || (city ? 'Select Barangay' : 'Select city first')}</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.optionItem} onPress={() => selectOption(item)}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  pickerButtonText: { fontSize: 16 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', borderRadius: 12, padding: 20, width: '80%', maxHeight: '70%' },
  optionItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  closeButton: { marginTop: 12, alignItems: 'center', padding: 12, backgroundColor: '#f0f0f0', borderRadius: 8 },
  closeButtonText: { fontWeight: 'bold' },
});