import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please enter phone and password');
      return;
    }
    try {
      await login(phone, password);
      // If login succeeds, navigation will automatically go to MainTabs (AppNavigator handles it)
    } catch (error) {
      let errorMsg = 'Login failed';
      if (error.response) {
        // Server responded with a status other than 2xx
        errorMsg = `Server error (${error.response.status}): ${JSON.stringify(error.response.data)}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMsg = 'No response from server. Check your internet connection.';
      } else {
        // Something else happened
        errorMsg = error.message;
      }
      Alert.alert('Login Failed', errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏠 Boardly</Text>
      <Text style={styles.subtitle}>Verified boarding house rentals</Text>

      <TextInput
        style={styles.input}
        placeholder="Phone number"
        placeholderTextColor="#999"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#667eea' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8, color: 'white' },
  subtitle: { textAlign: 'center', color: 'rgba(255,255,255,0.8)', marginBottom: 40 },
  input: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 25, padding: 12, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#4CAF50', borderRadius: 25, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 20, color: 'white', textDecorationLine: 'underline' },
});