const pickImage = async () => {
  try {
    Alert.alert('Step 1', 'pickImage function called');
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    Alert.alert('Step 2', `Permission status: ${status}`);
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photos');
      return;
    }
    Alert.alert('Step 3', 'Launching image picker...');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    Alert.alert('Step 4', `Picker returned, canceled: ${result.canceled}`);
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      Alert.alert('Step 5', `Image selected: ${imageUri}`);
      setUploading(true);
      // Prepare FormData
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      });
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'boardly_avatars');
      Alert.alert('Step 6', 'Uploading to Cloudinary...');
      const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const cloudinaryData = await cloudinaryResponse.json();
      if (!cloudinaryResponse.ok) {
        throw new Error(cloudinaryData.error?.message || 'Cloudinary upload failed');
      }
      const imageUrl = cloudinaryData.secure_url;
      Alert.alert('Step 7', `Uploaded URL: ${imageUrl}`);
      // Save to backend
      const profileResponse = await api.put('/user/profile', { avatar: imageUrl });
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