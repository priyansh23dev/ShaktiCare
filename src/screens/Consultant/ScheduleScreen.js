// src/screens/Consultant/ScheduleScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ScheduleScreen() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth().currentUser.uid;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('consultations')
      .where('consultantId', '==', userId)
      .orderBy('scheduledAt', 'asc')
      .onSnapshot(querySnapshot => {
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSchedules(data);
        setLoading(false);
      }, error => {
        console.error(error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [userId]);

  const renderItem = ({ item }) => {
    const date = item.scheduledAt?.toDate?.().toLocaleString() || 'N/A';
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name="calendar-outline" size={24} color="#6C63FF" />
          <Text style={styles.title}>Consultation with Victim</Text>
        </View>
        <Text style={styles.details}>Date & Time: {date}</Text>
        <Text style={styles.details}>Request Type: {item.requestType}</Text>
        <Text style={styles.details}>Notes: {item.notes || 'None'}</Text>
      </View>
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#6C63FF" style={styles.loading} />;

  return (
    <View style={styles.container}>
      {schedules.length === 0 ? (
        <Text style={styles.emptyText}>No consultations scheduled.</Text>
      ) : (
        <FlatList
          data={schedules}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontWeight: 'bold', fontSize: 18, marginLeft: 8, color: '#333' },
  details: { color: '#555', marginBottom: 6 },
  loading: { flex: 1, justifyContent: 'center' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 16 },
});
