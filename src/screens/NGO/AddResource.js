// src/screens/NGO/AddResource.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

export default function AddResource({ navigation }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !type.trim() || !contact.trim() || !location.trim()) {
      Alert.alert('Validation Error', 'Please fill all the fields.');
      return;
    }

    setLoading(true);

    try {
      await firestore().collection('resources').add({
        name: name.trim(),
        type: type.trim(),
        contact: contact.trim(),
        location: location.trim(),
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Success', 'Resource added successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add resource.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#6C63FF', '#A084DC']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <Text style={styles.title}>Add New Resource</Text>

          <Text style={styles.label}>Resource Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter resource name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Type (e.g. Shelter, Legal Aid)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter resource type"
            value={type}
            onChangeText={setType}
          />

          <Text style={styles.label}>Contact Info</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone or email"
            value={contact}
            onChangeText={setContact}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter location"
            value={location}
            onChangeText={setLocation}
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Adding...' : 'Add Resource'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#6C63FF',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
  },
});
