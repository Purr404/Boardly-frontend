import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import api from '../services/api';

export default function BookingScreen({ route, navigation }) {
  const { slotId } = route.params;

  const confirmBooking = async () => {
    try {
      await api.post('/bookings', { slotId });
      Alert.alert('Success', 'Booking request sent. Awaiting owner confirmation.');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 20 }}>Confirm Booking</Text>
      <Button title="Book Slot" onPress={confirmBooking} />
    </View>
  );
}