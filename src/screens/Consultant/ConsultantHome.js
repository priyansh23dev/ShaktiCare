import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default function HelpRequests() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth().currentUser;

  // For modal & scheduling
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      Alert.alert('Error', 'No authenticated user found');
      setLoading(false);
      return;
    }

    const unsubscribe = firestore()
      .collection('helpRequests')
      .where('assignedConsultant', '==', currentUser.uid)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          const requests = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setHelpRequests(requests);
          setLoading(false);
        },
        error => {
          Alert.alert('Error', 'Failed to load help requests');
          setLoading(false);
          console.error(error);
        }
      );

    return () => unsubscribe();
  }, [currentUser]);

  // Filter out accepted requests so they don't show here
  const pendingRequests = helpRequests.filter(req => req.status !== 'Accepted');

  const handleRespondPress = (request) => {
    setSelectedRequest(request);
    // Show alert with Accept / Reject options
    Alert.alert(
      'Respond to Request',
      'Do you want to accept or reject this request?',
      [
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => handleReject(request.id),
        },
        {
          text: 'Accept',
          onPress: () => setDatePickerVisible(true), // show date picker
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleReject = async (requestId) => {
    try {
      await firestore().collection('helpRequests').doc(requestId).update({
        status: 'Rejected',
      });
      Alert.alert('Success', 'Request rejected');
    } catch (e) {
      Alert.alert('Error', 'Failed to reject request');
    }
  };

  const handleConfirmDate = async (date) => {
    setDatePickerVisible(false);
    if (!selectedRequest) return;

    try {
      await firestore().collection('helpRequests').doc(selectedRequest.id).update({
        status: 'Accepted',
        scheduledAt: firestore.Timestamp.fromDate(date),
        // You can also save consultant's contact details here for victim reference
        consultantName: currentUser.displayName || 'Consultant',
        consultantEmail: currentUser.email || '',
        // Assuming phone is stored in user profile in Firestore, fetch and add if needed
      });
      Alert.alert(
        'Success',
        `Request accepted and scheduled for ${moment(date).format('MMM Do YYYY, h:mm A')}`
      );
      setSelectedRequest(null);
    } catch (e) {
      Alert.alert('Error', 'Failed to accept and schedule request');
      console.error(e);
    }
  };

  const handleCancelDatePicker = () => {
    setDatePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Consultant Dashboard</Text> */}

      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 30 }} />
      ) : pendingRequests.length === 0 ? (
        <Text style={styles.empty}>No requests to respond.</Text>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.sectionTitle}>Assigned Help Requests</Text>
          {pendingRequests.map((req) => (
            <View key={req.id} style={styles.card}>
              <Text style={styles.cardTitle}>{req.uname || 'Unnamed Victim'}</Text>
              <Text style={styles.cardSubtitle}>Type: {req.requestType}</Text>
              <Text style={styles.cardSubtitle}>Status: {req.status || 'Pending'}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleRespondPress(req)}
              >
                <Text style={styles.buttonText}>Respond</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirmDate}
        onCancel={handleCancelDatePicker}
        minimumDate={new Date()}
        is24Hour={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 26, fontWeight: 'bold', color: '#6C63FF', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 10, color: '#333' },
  card: {
    backgroundColor: '#F3F3FF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cardSubtitle: { fontSize: 14, color: '#555', marginBottom: 10 },
  button: {
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  empty: {
    color: '#555',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
});
