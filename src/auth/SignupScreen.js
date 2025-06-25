// src/screens/SignupScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

const roles = [
  { label: 'NGO', value: 'NGO' },
  { label: 'Donor', value: 'Donor' },
  { label: 'Victim', value: 'Victim' },
  { label: 'Consultant', value: 'Consultant' },
];

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(roles);
  const [loading, setLoading] = useState(false);

  // Additional role-specific fields
  const [ngoName, setNgoName] = useState('');
  const [donorOrg, setDonorOrg] = useState('');
  const [victimAge, setVictimAge] = useState('');
  const [consultantType, setConsultantType] = useState('');

  // Signup logic
  const handleSignup = async () => {
    if (!email || !password || !name || !role) {
      Alert.alert('Missing Fields', 'Please fill out all required information.');
      return;
    }

    setLoading(true);
    try {
      // Create user in Firebase Auth
      const userCredential = await auth().createUserWithEmailAndPassword(email.trim(), password);
      const uid = userCredential.user.uid;

      // Create Firestore profile based on role
      const profile = {
        name,
        email,
        role,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      if (role === 'NGO') profile.ngoName = ngoName;
      if (role === 'Donor') profile.organization = donorOrg;
      if (role === 'Victim') profile.age = victimAge;
      if (role === 'Consultant') profile.specialization = consultantType;

      await firestore().collection('users').doc(uid).set(profile);

      Alert.alert('Success', 'Your account has been created!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      console.error('[SIGNUP ERROR]', error);
      let message = 'Something went wrong. Please try again.';

      // Friendly Firebase error messages
      if (error.code === 'auth/email-already-in-use') message = 'This email is already in use.';
      else if (error.code === 'auth/invalid-email') message = 'Invalid email address.';
      else if (error.code === 'auth/weak-password') message = 'Password must be at least 6 characters.';

      Alert.alert('Signup Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#6C63FF", "#A084DC"]} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Register on ShaktiCare</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <DropDownPicker
          open={open}
          value={role}
          items={items}
          
          setOpen={setOpen}
          setValue={setRole}
          setItems={setItems}
          placeholder="Select your role"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={1000}
          placeholderStyle={{
            fontFamily: 'Montserrat-Regular',
          }}
        />

        {role === 'NGO' && (
          <TextInput
            style={styles.input}
            placeholder="NGO Name"
            value={ngoName}
            onChangeText={setNgoName}
          />
        )}
        {role === 'Donor' && (
          <TextInput
            style={styles.input}
            placeholder="Organization (Optional)"
            value={donorOrg}
            onChangeText={setDonorOrg}
          />
        )}
        {role === 'Victim' && (
          <TextInput
            style={styles.input}
            placeholder="Your Age"
            keyboardType="numeric"
            value={victimAge}
            onChangeText={setVictimAge}
          />
        )}
        {role === 'Consultant' && (
          <TextInput
            style={styles.input}
            placeholder="Specialization (Doctor, Lawyer, etc.)"
            value={consultantType}
            onChangeText={setConsultantType}
          />
        )}

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Login
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    // fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#333',
    fontFamily: 'Montserrat-Regular',
    fontSize: 15,
  },
  dropdown: {
    borderRadius: 10,
    borderColor: '#ddd',
    marginBottom: 15,
    fontFamily: 'Montserrat-Regular',
  },
  dropdownContainer: {
    borderColor: '#ccc',
    fontFamily: 'Montserrat-Regular',
  },
  button: {
    backgroundColor: '#5A4FCF',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
  },
  loginText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
  },
  link: {
    color: '#FFD6E8',
    fontFamily: 'Montserrat-Bold',
    // fontWeight: 'bold',
  },
});
