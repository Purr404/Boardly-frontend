import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('renter');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userData, setUserData] = useState(null);

  const validatePhone = (phone) => phone.replace(/\D/g, '').length >= 10;
  const validatePassword = (pwd) => pwd.length >= 8 && /[a-zA-Z]/.test(pwd) && /[0-9]/.test(pwd);

  const requestOtp = () => {
    if (!name || !phone || !password || !validatePhone(phone) || !validatePassword(password)) {
      Alert.alert('Error', 'Please fill all fields correctly (name, valid phone, password 8+ chars with letters and numbers).');
      return;
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);
    Alert.alert('Demo OTP', `Your OTP is: ${otpCode}`, [{ text: 'OK' }]);
    setUserData({ name, phone, password, role });
    setStep(2);
  };

  const verifyAndRegister = async () => {
    if (otp !== generatedOtp) {
      Alert.alert('Error', 'Invalid OTP');
      return;
    }
    const email = phone.replace(/\D/g, '') + '@phone.boardly';
    try {
      await api.post('/auth/register', {
        name: userData.name,
        email,
        password: userData.password,
        role: userData.role,
      });
      Alert.alert('Success', 'Registration successful! Please log in.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Registration failed');
    }
  };

  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <View style={styles.roleContainer}>
          <TouchableOpacity style={[styles.roleButton, role === 'renter' && styles.activeRole]} onPress={() => setRole('renter')}>
            <Text>Renter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roleButton, role === 'owner' && styles.activeRole]} onPress={() => setRole('owner')}>
            <Text>Owner</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={requestOtp}>
          <Text style={styles.buttonText}>Continue with OTP</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Phone</Text>
      <Text style={styles.info}>We've sent a 6‑digit code to {phone}</Text>
      <TextInput style={styles.input} placeholder="Enter OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} />
      <TouchableOpacity style={styles.button} onPress={verifyAndRegister}>
        <Text style={styles.buttonText}>Verify & Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={requestOtp}>
        <Text style={styles.link}>Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#667eea' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: 'white', marginBottom: 20 },
  info: { textAlign: 'center', color: 'white', marginBottom: 20 },
  input: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 25, padding: 12, marginBottom: 16, fontSize: 16 },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  roleButton: { backgroundColor: 'rgba(255,255,255,0.3)', padding: 10, borderRadius: 25, flex: 0.45, alignItems: 'center' },
  activeRole: { backgroundColor: '#4CAF50' },
  button: { backgroundColor: '#4CAF50', borderRadius: 25, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 20, color: 'white', textDecorationLine: 'underline' },
});