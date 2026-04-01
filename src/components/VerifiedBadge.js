import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VerifiedBadge({ verified }) {
  if (!verified) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>✓ Verified</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { backgroundColor: '#4CAF50', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  text: { color: 'white', fontSize: 10, fontWeight: 'bold' },
});