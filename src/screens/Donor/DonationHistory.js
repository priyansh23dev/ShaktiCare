import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

export default function DonationHistory() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const donorId = auth().currentUser.uid;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('donations')
      .where('donorId', '==', donorId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDonations(data);
        setLoading(false);
      }, error => {
        console.error(error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [donorId]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon
          name={item.recipientRole === 'NGO' ? 'business-outline' : 'person-outline'}
          size={24}
          color="#6C63FF"
        />
        <Text style={styles.recipientName}>{item.recipientName || 'Recipient'}</Text>
      </View>
      <Text style={styles.amount}>₹ {item.amount.toFixed(2)}</Text>
      {item.message ? <Text style={styles.message}>"{item.message}"</Text> : null}
      <Text style={styles.date}>
        {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : ''}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Donations</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" />
      ) : donations.length === 0 ? (
        <Text style={styles.emptyText}>You haven't made any donations yet.</Text>
      ) : (
        <FlatList
          data={donations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={donations.length === 0 && styles.emptyContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#6C63FF', textAlign: 'center' },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  recipientName: { marginLeft: 8, fontWeight: 'bold', fontSize: 16, color: '#333' },
  amount: { fontSize: 18, fontWeight: 'bold', color: '#4CAF50' },
  message: { fontStyle: 'italic', color: '#555', marginTop: 5 },
  date: { color: '#999', marginTop: 8, fontSize: 12 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center' },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#999' },
});
