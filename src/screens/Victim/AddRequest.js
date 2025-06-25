// src/screens/Victim/AddRequest.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient'; // to match login/signup UI

export default function AddRequest({ navigation }) {
  const [requestType, setRequestType] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Financial', value: 'Financial' },
    { label: 'Medical', value: 'Medical' },
    { label: 'Consultation', value: 'Consultation' },
    { label: 'Domestic Violence', value: 'Domestic Violence' },
    { label: 'Legal Aid', value: 'Legal Aid' },
    { label: 'Psychological Support', value: 'Psychological Support' },
    { label: 'Shelter Request', value: 'Shelter Request' },
    { label: 'Emergency Assistance', value: 'Emergency Assistance' },
    { label: 'Childcare Support', value: 'Childcare Support' },
  ]);
  
  const [userData, setUserData] = useState(null);
 
  const uid = auth().currentUser.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const doc = await firestore().collection('users').doc(uid).get();
        if (doc.exists) setUserData(doc.data());
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  const handleSubmit = async () => {
    if (!requestType || !description.trim()) {
      Alert.alert('Validation Error', 'Please select a request type and enter a description.');
      return;
    }

    setLoading(true);

    try {

      console.log(userData?.name)
      const uid = auth().currentUser.uid;



      await firestore().collection('helpRequests').add({
        victimId: uid,
        requestType,
        description: description.trim(),
        status: 'Pending',
        uname:userData?.name,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Your help request has been submitted.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#6C63FF', '#A084DC']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Text style={styles.title}>New Help Request</Text>

        <Text style={styles.label}>Request Type</Text>
        <DropDownPicker
          open={open}
          value={requestType}
          items={items}
          setOpen={setOpen}
          setValue={setRequestType}
          setItems={setItems}
          placeholder="Select type"
          containerStyle={{ marginBottom: 20 }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          listMode="SCROLLVIEW"
          placeholderStyle={{
            fontFamily: 'Montserrat-Medium',
          }}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Describe your need in detail"
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.buttonContent}>
              <Icon name="send-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Submit Request</Text>
            </View>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 26,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    marginBottom: 8,
    color: '#fff',
  },
  dropdown: {
    fontFamily: 'Montserrat-Medium',
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  dropdownList: {
    borderColor: '#ddd',
    backgroundColor: '#fff',
    fontFamily: 'Montserrat-Medium',
  },
  input: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    marginBottom: 30,
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    color: '#333',
  },
  button: {
    backgroundColor: '#5A4FCF',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 17,
  },
});
