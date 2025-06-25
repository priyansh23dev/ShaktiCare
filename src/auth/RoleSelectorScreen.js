// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// const roles = ['NGO', 'Donor', 'Victim', 'Consultant'];

// export default function RoleSelectionScreen({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Select Your Role</Text>
//       {roles.map((role) => (
//         <TouchableOpacity
//           key={role}
//           style={styles.button}
//           onPress={() => navigation.navigate('Signup', { role })}
//         >
//           <Text style={styles.buttonText}>{role}</Text>
//         </TouchableOpacity>
//       ))}
//       <Text style={styles.loginText}>
//         Already have an account?{' '}
//         <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Login</Text>
//       </Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//   title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#6C63FF' },
//   button: {
//     backgroundColor: '#6C63FF',
//     paddingVertical: 15,
//     paddingHorizontal: 40,
//     borderRadius: 30,
//     marginVertical: 10,
//     width: '100%',
//   },
//   buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
//   loginText: { marginTop: 30 },
//   link: { color: '#F48FB1', fontWeight: 'bold' }
// });
