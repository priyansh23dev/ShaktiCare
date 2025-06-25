import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

export default function HelpRequests() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth().currentUser;

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

  const pendingRequests = helpRequests.filter(req => req.status !== 'Accepted');

  const handleRespondPress = (request) => {
    setSelectedRequest(request);
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
          onPress: () => setDatePickerVisible(true),
        },
        { text: 'Cancel', style: 'cancel' },
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
    } catch {
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
        consultantName: currentUser.displayName || 'Consultant',
        consultantEmail: currentUser.email || '',
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
    <LinearGradient
      colors={['#6C63FF', '#3B33A1']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.header}>Consultant Dashboard</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 30 }} />
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    fontSize: 28,
    
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: 'Montserrat-Bold',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    color: '#ddd',
    fontFamily: 'Montserrat-Medium',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
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
 
    color: '#fff',
    marginBottom: 8,
    fontFamily: 'Montserrat-Bold',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 12,
    fontFamily: 'Montserrat-Regular',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#6C63FF',

    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  empty: {
    color: '#ccc',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 60,
    fontFamily: 'Montserrat-SemiBold',
  },
});
