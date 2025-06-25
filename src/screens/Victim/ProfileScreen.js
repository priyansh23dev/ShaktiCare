// src/screens/Victim/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const uid = auth().currentUser.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const doc = await firestore().collection('users').doc(uid).get();
        if (doc.exists) setUserData(doc.data());
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.replace('Login'); // Reset navigation to Login screen after logout
      })
      .catch(error => {
        Alert.alert('Logout Error', 'Failed to logout. Please try again.');
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#6C63FF', '#A084DC']} style={styles.container}>
      <View style={styles.profileBox}>
        <Text style={styles.name}>{userData?.name || 'No Name'}</Text>
        <Text style={styles.infoLabel}>Email</Text>
        <Text style={styles.infoText}>{userData?.email || '-'}</Text>

        <Text style={styles.infoLabel}>Age</Text>
        <Text style={styles.infoText}>{userData?.age || '-'}</Text>

        {/* Add more fields if needed */}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30 },
  profileBox: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  name: {
    fontSize: 28,
    // fontWeight: '700',
    color: '#6C63FF',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 10,
  },
  infoText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    fontFamily: 'Montserrat-Medium',
    marginBottom: 8,
  },
  logoutBtn: {
    marginTop: 35,
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    // fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
