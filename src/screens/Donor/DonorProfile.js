// src/screens/Donor/DonorProfile.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function DonorProfile({ navigation }) {
  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => navigation.replace('Login'))
      .catch(error => Alert.alert('Logout Error', error.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donor Profile</Text>
      <Text style={styles.info}>Email: {auth().currentUser?.email}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#6C63FF', marginBottom: 20, textAlign: 'center' },
  info: { fontSize: 16, color: '#333', marginBottom: 30, textAlign: 'center' },
  logoutButton: {
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
