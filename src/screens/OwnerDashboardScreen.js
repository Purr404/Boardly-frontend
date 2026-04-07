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
      setRooms(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setRooms([]);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/owner');
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setBookings([]);
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

  const pendingBookings = Array.isArray(bookings) ? bookings.filter(b => b.status === 'pending') : [];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('PostListing')}>
        <Text style={styles.buttonText}>+ Add New Listing</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>My Rooms</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => {
          if (!item) return null;
          return (
            <View style={styles.roomCard}>
              <Text style={styles.roomTitle}>{item.title}</Text>
              <Text>₱{item.price}/month</Text>
            </View>
          );
        }}
        ListEmptyComponent={<Text>No rooms posted yet.</Text>}
      />

      <Text style={styles.sectionTitle}>Pending Bookings</Text>
      <FlatList
        data={pendingBookings}
        keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => {
          if (!item) return null;
          return (
            <View style={styles.bookingCard}>
              <Text>Renter: {item.renter?.name || 'Unknown'}</Text>
              <Text>Room: {item.slot?.room?.title || 'Unknown'}</Text>
              <Text>Slot: {item.slot?.startTime ? new Date(item.slot.startTime).toLocaleString() : 'Unknown'}</Text>
              <TouchableOpacity style={styles.confirmButton} onPress={() => confirmBooking(item.id)}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={<Text>No pending bookings.</Text>}
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