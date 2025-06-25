import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function DonationHistory() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const donorId = auth().currentUser.uid;

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('donations')
      .where('donorId', '==', donorId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (snapshot) => {
          if (snapshot.empty) {
            console.log('No donations found for donor:', donorId);
          }
          const data = snapshot.docs.map((doc) => {
            const docData = doc.data();
            console.log('Donation doc:', doc.id, docData);
            return { id: doc.id, ...docData };
          });
          setDonations(data);
          setLoading(false);
        },
        (error) => {
          console.error('Error fetching donations:', error);
          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [donorId]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon
          name={item.recipientRole === 'NGO' ? 'business-outline' : 'person-outline'}
          size={28}
          color="#fff"
        />
        <Text style={styles.recipientName}>{item.recipientName || item.recipientRole || 'Recipient'}</Text>
      </View>
      <Text style={styles.amount}>₹ {item.amount?.toFixed(2)}</Text>
      {item.message ? <Text style={styles.message}>"{item.message}"</Text> : null}
      <Text style={styles.date}>
        {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString() : 'Date not available'}
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={['#6C63FF', '#3B33A1']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.header}>Your Donations</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 30 }} />
      ) : donations.length === 0 ? (
        <Text style={styles.emptyText}>You haven't made any donations yet.</Text>
      ) : (
        <FlatList
          data={donations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={donations.length === 0 && styles.emptyContainer}
          showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,

    color: '#fff',
    marginBottom: 25,
    fontFamily: 'System',
    fontFamily: 'Montserrat-Bold',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 18,
    width: width - 40,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recipientName: {
    marginLeft: 12,
    fontSize: 20,
    color: '#fff',
    letterSpacing: 0.3,
    fontFamily: 'Montserrat-Bold',
  },
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#9AFF99',
    marginBottom: 8,
  },
  message: {
    fontStyle: 'italic',
    color: '#E6E6E6',
    marginBottom: 10,
    fontSize: 16,
  },
  date: {
    color: '#D1D1D1',
    fontSize: 13,
    textAlign: 'right',
  },
  emptyContainer: { flexGrow: 1, justifyContent: 'center' },
  emptyText: {
    color: '#E0E0E0',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
});
