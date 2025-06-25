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
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      // Here using the firebase store to authenticate the user, using email and password
      const userCredential = await auth().signInWithEmailAndPassword(email.trim(), password);
      const uid = userCredential.user.uid;

      // Fetch user data from Firestore for the users collection
      const userDoc = await firestore().collection('users').doc(uid).get();
      if (!userDoc.exists) throw new Error('User profile not found');

      const userData = userDoc.data();
      const userRole = userData.role;

      // Navigate based on role
      switch (userRole) {
        case 'NGO':
          navigation.replace('NGOHome');
          break;
        case 'Donor':
          navigation.replace('DonorHome');
          break;
        case 'Victim':
          navigation.replace('VictimHome');
          break;
        case 'Consultant':
          navigation.replace('ConsultantHome');
          break;
        default:
          Alert.alert('Login Error', 'Unknown role. Please contact support.');
      }
    } catch (error) {
      console.error('[LOGIN ERROR]', error);
      let message = 'Something went wrong. Please try again.';

      // Show friendly messages based on Firebase error codes
      if (error.code === 'auth/user-not-found') message = 'User not found.';
      else if (error.code === 'auth/wrong-password') message = 'Incorrect password.';
      else if (error.code === 'auth/invalid-email') message = 'Invalid email address.';

      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#6C63FF", "#A084DC"]} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to ShaktiCare</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don’t have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
            Register
          </Text>
        </Text>
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
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    // fontWeight: '700',
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#5A4FCF',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Montserrat-Medium',
    color: '#fff',
    fontSize: 16,
  },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
  },
  link: {
    color: '#FFD6E8',
    fontFamily: 'Montserrat-Medium',
  },
});
