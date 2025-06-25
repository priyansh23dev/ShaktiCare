import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

export default function ScheduleScreen() {
  const [scheduledRequests, setScheduledRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth().currentUser;

  useEffect(() => {
    if (!currentUser) {
      Alert.alert('Error', 'No authenticated user found');
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection('helpRequests')
      .where('assignedConsultant', '==', currentUser.uid)
      .where('status', '==', 'Accepted')
      .orderBy('scheduledAt', 'asc')
      .onSnapshot(
        snapshot => {
          const requests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setScheduledRequests(requests);
          setLoading(false);
        },
        error => {
          console.error('Firestore Error:', error);
          Alert.alert('Error', 'Failed to load scheduled requests');
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <LinearGradient
      colors={['#6C63FF', '#3B33A1']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.header}>My Schedule</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 30 }} />
      ) : scheduledRequests.length === 0 ? (
        <Text style={styles.empty}>No scheduled help requests.</Text>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {scheduledRequests.map(req => (
            <View key={req.id} style={styles.card}>
              <Text style={styles.cardTitle}>{req.uname || 'Unnamed Victim'}</Text>
              <Text style={styles.cardSubtitle}>Type: {req.requestType}</Text>
              <Text style={styles.cardSubtitle}>
                Scheduled: {req.scheduledAt ? moment(req.scheduledAt.toDate()).format('MMM Do YYYY, h:mm A') : 'Not set'}
              </Text>
              <Text style={styles.cardSubtitle}>
                Contact: {req.victimPhone || 'N/A'}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: 'Montserrat-Bold',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    marginBottom: 8,
    fontFamily: 'Montserrat-Regular',
  },
  empty: {
    color: '#ccc',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 60,
    fontFamily: 'Montserrat-Medium',
  },
});
