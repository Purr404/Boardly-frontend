import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import VerifiedBadge from './VerifiedBadge';

export default function RoomCard({ room, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {room.images && room.images[0] && (
        <Image source={{ uri: `${api.defaults.baseURL.replace('/api', '')}${room.images[0]}` }} style={styles.image} />
      )}
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.title}>{room.title}</Text>
          <VerifiedBadge verified={room.owner.verifiedOwner} />
        </View>
        <Text style={styles.price}>₱{room.price}/month</Text>
        <Text style={styles.location}>{room.barangay}, {room.city}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  price: { color: '#4CAF50', fontWeight: 'bold', marginTop: 4 },
  location: { fontSize: 12, color: '#666', marginTop: 4 },
});