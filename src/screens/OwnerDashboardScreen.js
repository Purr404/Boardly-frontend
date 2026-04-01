import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OwnerDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user?.role === 'owner') {
      fetchRooms();
      fetchBookings();
    }
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get('/rooms?owner=true');
      setRooms(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/owner');
      setBookings(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmBooking = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/confirm`);
      Alert.alert('Success', 'Booking confirmed');
      fetchBookings();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to confirm');
    }
  };

  if (!user?.verifiedOwner) {
    return (
      <View style={styles.container}>
        <Text>You are not a verified owner. Please upload your documents for verification.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UploadDocuments')}>
          <Text style={styles.buttonText}>Upload Documents</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('PostListing')}>
        <Text style={styles.buttonText}>+ Add New Listing</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>My Rooms</Text>
      <FlatList
        data={rooms}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.roomCard}>
            <Text style={styles.roomTitle}>{item.title}</Text>
            <Text>₱{item.price}/month</Text>
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>Pending Bookings</Text>
      <FlatList
        data={bookings.filter(b => b.status === 'pending')}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookingCard}>
            <Text>Renter: {item.renter.name}</Text>
            <Text>Room: {item.slot.room.title}</Text>
            <Text>Slot: {new Date(item.slot.startTime).toLocaleString()}</Text>
            <TouchableOpacity style={styles.confirmButton} onPress={() => confirmBooking(item.id)}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  addButton: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  roomCard: { padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 8 },
  roomTitle: { fontWeight: 'bold', fontSize: 16 },
  bookingCard: { padding: 12, borderWidth: 1, borderColor: '#ff9800', borderRadius: 8, marginBottom: 8 },
  confirmButton: { backgroundColor: '#2196F3', padding: 8, borderRadius: 4, marginTop: 8, alignItems: 'center' },
});