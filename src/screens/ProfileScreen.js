import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

// Cloudinary configuration
const CLOUD_NAME = 'dpqplua14';
const UPLOAD_PRESET = 'boardly_avatars'; 

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.email?.replace('@phone.boardly', '') || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      Alert.alert('Debug', '1. Function called');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      Alert.alert('Debug', `2. Permission status: ${status}`);
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photos');
        return;
      }
      Alert.alert('Debug', '3. Launching image picker...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      Alert.alert('Debug', `4. Picker returned, canceled: ${result.canceled}`);
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        Alert.alert('Debug', `5. Image URI: ${imageUri}`);
        setUploading(true);
        const formData = new FormData();
        // @ts-ignore
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        });
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', 'boardly_avatars');
        Alert.alert('Debug', '6. Sending to Cloudinary...');
        const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const cloudinaryData = await cloudinaryResponse.json();
        Alert.alert('Debug', `7. Cloudinary response status: ${cloudinaryResponse.status}`);
        if (!cloudinaryResponse.ok) {
          throw new Error(cloudinaryData.error?.message || 'Cloudinary upload failed');
        }
        const imageUrl = cloudinaryData.secure_url;
        Alert.alert('Debug', `8. Uploaded URL: ${imageUrl}`);
        const profileResponse = await api.put('/user/profile', { avatar: imageUrl });
        Alert.alert('Debug', `9. Backend response status: ${profileResponse.status}`);
        if (!profileResponse.ok) throw new Error('Backend save failed');
        updateUser({ ...user, avatar: imageUrl });
        setAvatar(imageUrl);
        Alert.alert('Success', 'Profile picture updated');
      } else {
        Alert.alert('Cancelled', 'No image selected');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const response = await api.put('/user/profile', { name, phone });
      updateUser(response.data.user);
      Alert.alert('Success', 'Profile updated');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const cancelEdit = () => {
    setName(user?.name || '');
    setPhone(user?.email?.replace('@phone.boardly', '') || '');
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.avatarContainer} disabled={uploading}>
        {uploading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
          </View>
        )}
        <Text style={styles.changePhotoText}>Change Photo</Text>
      </TouchableOpacity>

      {!isEditing ? (
        <>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user?.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{phone}</Text>
          </View>
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelEdit}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  avatarContainer: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 40, color: 'white', fontWeight: 'bold' },
  changePhotoText: { marginTop: 8, color: '#4CAF50' },
  infoRow: { flexDirection: 'row', marginBottom: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontWeight: 'bold', width: 80, fontSize: 16 },
  value: { flex: 1, fontSize: 16, color: '#333' },
  editButton: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 25, padding: 12, marginBottom: 16, fontSize: 16 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  saveButton: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 8, flex: 0.48, alignItems: 'center' },
  cancelButton: { backgroundColor: '#f44336', padding: 12, borderRadius: 8, flex: 0.48, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  logoutButton: { marginTop: 30, alignItems: 'center' },
  logoutText: { color: '#f44336', fontSize: 16 },
});