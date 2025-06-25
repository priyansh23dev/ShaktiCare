import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';

// If you use Expo, you can load Montserrat like this:
// import { useFonts, Montserrat_400Regular, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
// (Add font loading logic if needed)

export default function DonorProfile({ navigation }) {
  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => navigation.replace('Login'))
      .catch(error => Alert.alert('Logout Error', error.message));
  };

  return (
    <LinearGradient
      colors={['#6C63FF', '#3B33A1']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* <Text style={styles.title}>Donor Profile</Text> */}
      <View style={styles.infoBox}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.info}>{auth().currentUser?.email || 'Not Available'}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Montserrat_700Bold', // or fallback to 'System' if not loaded
    marginBottom: 40,
  },
  infoBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: '100%',
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  label: {
    fontSize: 14,
    color: '#D1D1D1',
    fontWeight: '600',
    marginBottom: 6,
    fontFamily: 'Montserrat_400Regular',
  },
  info: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Montserrat_600SemiBold',
  },
  logoutButton: {
    backgroundColor: '#F44336',
    paddingVertical: 15,
    paddingHorizontal: 70,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Montserrat-Bold',
  },
});
