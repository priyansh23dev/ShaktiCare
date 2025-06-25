// src/screens/Consultant/HelpRequests.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HelpRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth().currentUser.uid;

  // Fetch all pending help requests (for consultants)
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('helpRequests')
      .where('status', '==', 'pending')
      .onSnapshot(
        (querySnapshot) => {
          const reqs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRequests(reqs);
          setLoading(false);
        },
        (error) => {
          console.error('[Firestore Error]', error);
          setLoading(false);
        }
      );

    return () => unsubscribe(); // clean up listener on unmount
  }, []);

  // Update request status when consultant responds
  const handleResponse = async (requestId, response) => {
    try {
      await firestore().collection('helpRequests').doc(requestId).update({
        status: response,
        consultantId: userId,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      Alert.alert('Success', `Request marked as ${response}`);
    } catch (error) {
      console.error('[Update Error]', error);
      Alert.alert('Error', 'Could not update request. Please try again.');
    }
  };

  // Render each request card
  const renderItem = ({ item }) => {
    let iconName = 'help-circle-outline';
    if (item.requestType.toLowerCase() === 'financial') iconName = 'cash-outline';
    else if (item.requestType.toLowerCase() === 'medical') iconName = 'medkit-outline';
    else if (item.requestType.toLowerCase() === 'consultation') iconName = 'people-outline';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Icon name={iconName} size={22} color="#6C63FF" />
          <Text style={styles.title}>{item.requestType} Request</Text>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.accept]}
            onPress={() => handleResponse(item.id, 'accepted')}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.reject]}
            onPress={() => handleResponse(item.id, 'rejected')}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Show loader while fetching
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {requests.length === 0 ? (
        <Text style={styles.emptyText}>No pending help requests.</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

// ✨ Modern, clean UI styled with Montserrat font
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#F9F9FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#ccc',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    marginLeft: 8,
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Montserrat-SemiBold',
    color: '#333',
  },
  description: {
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    color: '#555',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  accept: {
    backgroundColor: '#4CAF50',
  },
  reject: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },
});
