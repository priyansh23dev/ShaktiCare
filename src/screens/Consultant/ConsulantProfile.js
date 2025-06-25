// src/screens/Common/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

export default function ConsultantProfile({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignedCount, setAssignedCount] = useState(0);
  const userId = auth().currentUser?.uid;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) return;
        const doc = await firestore().collection('users').doc(userId).get();
        if (doc.exists) setProfile(doc.data());

        const helpReqSnapshot = await firestore()
          .collection('helpRequests')
          .where('assignedConsultant', '==', userId)
          .where('status', 'in', ['Pending', 'Accepted'])
          .get();
        setAssignedCount(helpReqSnapshot.size);
      } catch (e) {
        console.error('Error fetching profile:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await auth().signOut();
              navigation.replace('Login'); // Adjust to your login screen name
            } catch (e) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );

  if (!profile)
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Profile data not found.</Text>
      </View>
    );

  return (
    <LinearGradient colors={['#6C63FF', '#A084DC']} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>My Profile</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{profile.name || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{profile.email || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Role</Text>
            <Text style={styles.value}>{profile.role || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Specialization</Text>
            <Text style={styles.value}>{profile.specialization || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{profile.phone || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Assigned Requests</Text>
            <Text style={styles.value}>{assignedCount}</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat-Bold',
    color: '#6C63FF',
    marginBottom: 25,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  label: {
    fontFamily: 'Montserrat-SemiBold',
    width: 130,
    color: '#444',
  },
  value: {
    flex: 1,
    fontFamily: 'Montserrat-Regular',
    color: '#666',
  },
  logoutButton: {
    marginTop: 35,
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6C63FF',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
});
