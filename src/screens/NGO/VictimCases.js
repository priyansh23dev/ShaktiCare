// src/screens/NGO/VictimCases.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

export default function VictimCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const ngoId = auth().currentUser.uid;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('helpRequests')
      .where('ngoId', '==', ngoId)  // assuming NGO assigns helpRequests by ngoId field
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCases(data);
        setLoading(false);
      }, error => {
        console.error(error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [ngoId]);

  const renderItem = ({ item }) => {
    let iconName = 'help-circle-outline';
    if (item.requestType?.toLowerCase() === 'financial') iconName = 'cash-outline';
    else if (item.requestType?.toLowerCase() === 'medical') iconName = 'medkit-outline';
    else if (item.requestType?.toLowerCase() === 'consultation') iconName = 'people-outline';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name={iconName} size={24} color="#6C63FF" />
          <Text style={styles.title}>{item.requestType} Request</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
        <Text style={styles.details}>Victim ID: {item.victimId}</Text>
        {/* You can add buttons or actions here later for assigning consultants or updating status */}
      </View>
    );
  };

  if (loading) return <ActivityIndicator size="large" color="#6C63FF" style={{ flex: 1, justifyContent: 'center' }} />;

  return (
    <View style={styles.container}>
      {cases.length === 0 ? (
        <Text style={styles.emptyText}>No victim cases assigned yet.</Text>
      ) : (
        <FlatList
          data={cases}
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
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontWeight: 'bold', fontSize: 18, marginLeft: 8, color: '#333' },
  description: { color: '#555', marginBottom: 6 },
  status: { fontWeight: 'bold', marginBottom: 6 },
  details: { color: '#666', fontSize: 12 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 16 },
});
