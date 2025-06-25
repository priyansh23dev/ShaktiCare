// src/screens/Victim/VictimHome.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

export default function VictimHome({ navigation }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const userId = auth().currentUser.uid;

  // Fetch victim's help requests once
  const fetchRequests = async () => {
    try {
      const snapshot = await firestore()
        .collection('helpRequests')
        .where('victimId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const reqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(reqs);
    } catch (error) {
      console.error('[Fetch Error]', error);
    }
  };

  // Realtime updates using onSnapshot
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('helpRequests')
      .where('victimId', '==', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          const reqs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRequests(reqs);
          setLoading(false);
          setRefreshing(false);
        },
        error => {
          console.error('[Snapshot Error]', error);
          setLoading(false);
          setRefreshing(false);
        }
      );

    return () => unsubscribe(); // Clean up listener
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests().then(() => setRefreshing(false));
  };

  // Render each request card
  const renderItem = ({ item }) => {
    let iconName = 'help-circle-outline';
    if (item.requestType.toLowerCase() === 'financial') iconName = 'cash-outline';
    else if (item.requestType.toLowerCase() === 'medical') iconName = 'medkit-outline';
    else if (item.requestType.toLowerCase() === 'consultation') iconName = 'people-outline';

    let statusColor = '#FFA500'; // Default for "pending"
    if (item.status.toLowerCase() === 'accepted') statusColor = '#4CAF50';
    else if (item.status.toLowerCase() === 'rejected') statusColor = '#F44336';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name={iconName} size={22} color="#6C63FF" />
          <Text style={styles.title}>{item.requestType} Request</Text>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.statusRow}>
          <Text style={[styles.status, { color: statusColor }]}>
            Status: {item.status}
          </Text>
          {item.status.toLowerCase() === 'accepted' && (
            <Text style={styles.verifiedText}>✅ Verified</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#6C63FF', '#A084DC']} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.header}>Your Help Requests</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddRequest')}>
            <Icon name="add-circle" size={34} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <FlatList
            data={requests}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No requests found.</Text>
            }
            contentContainerStyle={requests.length === 0 && styles.emptyContainer}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
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
    padding: 20,
    marginTop:60
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
  card: {
    backgroundColor: '#F9F9FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 1, height: 1 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    marginLeft: 8,
    fontSize: 17,
    fontFamily: 'Montserrat-SemiBold',
    color: '#333',
  },
  description: {
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    color: '#555',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
  },
  verifiedText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
    color: '#4CAF50',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#eee',
  },
});
