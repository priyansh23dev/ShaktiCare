// src/screens/Common/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function ConsulantProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = auth().currentUser.uid;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const doc = await firestore().collection('users').doc(userId).get();
        if (doc.exists) setProfile(doc.data());
      } catch (e) {
        console.error('Error fetching profile:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) return <ActivityIndicator size="large" color="#6C63FF" style={styles.loading} />;

  if (!profile) return <Text style={styles.errorText}>Profile data not found.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{profile.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{profile.email}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{profile.role}</Text>
      </View>
      {/* Add more profile fields as needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#6C63FF', textAlign: 'center' },
  row: { flexDirection: 'row', marginBottom: 15 },
  label: { fontWeight: 'bold', width: 80, color: '#333' },
  value: { flex: 1, color: '#555' },
  loading: { flex: 1, justifyContent: 'center' },
  errorText: { flex: 1, textAlign: 'center', marginTop: 50, color: 'red' },
});
