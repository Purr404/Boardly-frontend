import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function RoomCard({ room }) {
  if (!room) return null;
  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.title}>{room.title || 'No title'}</Text>
      <Text style={styles.price}>₱{room.price || 0}/month</Text>
      <Text style={styles.location}>{room.barangay || ''}, {room.city || ''}, {room.province || ''}</Text>
      {room.boosted && <Text style={styles.boosted}>⚡ Boosted</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12, elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold' },
  price: { color: '#4CAF50', fontWeight: 'bold', marginVertical: 4 },
  location: { fontSize: 12, color: '#666' },
  boosted: { fontSize: 10, color: 'gold', fontWeight: 'bold', marginTop: 4 },
});