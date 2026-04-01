import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('renter'); // renter, owner

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', { name, email, password, role });
      Alert.alert('Success', 'Registration successful. Please login.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === 'renter' && styles.activeRole]}
          onPress={() => setRole('renter')}
        >
          <Text>Renter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === 'owner' && styles.activeRole]}
          onPress={() => setRole('owner')}
        >
          <Text>Owner</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  roleButton: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, flex: 1, alignItems: 'center', marginHorizontal: 5 },
  activeRole: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  button: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  link: { textAlign: 'center', marginTop: 20, color: '#4CAF50' },
});