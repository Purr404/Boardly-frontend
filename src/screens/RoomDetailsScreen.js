import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../services/api';
import VerifiedBadge from '../components/VerifiedBadge';

export default function RoomDetailsScreen({ route, navigation }) {
  const { roomId } = route.params;
  const [room, setRoom] = useState(null);

  useEffect(() => {
    fetchRoom();
  }, []);

  const fetchRoom = async () => {
    try {
      const response = await api.get(`/rooms/${roomId}`);
      setRoom(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load room details');
    }
  };

  if (!room) return <View><Text>Loading...</Text></View>;

  return (
    <ScrollView style={styles.container}>
      {room.images && room.images[0] && (
        <Image source={{ uri: `${api.defaults.baseURL.replace('/api', '')}${room.images[0]}` }} style={styles.image} />
      )}
      <View style={styles.header}>
        <Text style={styles.title}>{room.title}</Text>
        <VerifiedBadge verified={room.owner.verifiedOwner} />
      </View>
      <Text style={styles.price}>Monthly Rent: ₱{room.price}</Text>
      <Text style={styles.description}>{room.description}</Text>
      <Text style={styles.location}>📍 {room.barangay}, {room.city}, {room.province}</Text>

      <Text style={styles.sectionTitle}>Available Viewing Slots</Text>
      {room.timeSlots?.map(slot => (
        <TouchableOpacity
          key={slot.id}
          style={[styles.slot, slot.status !== 'available' && styles.slotUnavailable]}
          disabled={slot.status !== 'available'}
          onPress={() => navigation.navigate('Booking', { slotId: slot.id, roomId: room.id })}
        >
          <Text>{new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}</Text>
          <Text>{slot.status === 'available' ? 'Available' : slot.status === 'pending' ? 'Pending' : 'Booked'}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 24, fontWeight: 'bold', flex: 1 },
  price: { fontSize: 20, color: '#4CAF50', fontWeight: 'bold', marginVertical: 8 },
  description: { fontSize: 16, marginVertical: 8 },
  location: { fontSize: 14, color: '#666', marginVertical: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  slot: { padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginVertical: 4, flexDirection: 'row', justifyContent: 'space-between' },
  slotUnavailable: { backgroundColor: '#f0f0f0', opacity: 0.6 },
});