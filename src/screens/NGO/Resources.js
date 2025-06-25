// src/screens/NGO/Resources.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Resources() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Manage Resources Here (Coming Soon)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  text: { fontSize: 18, color: '#6C63FF', fontWeight: 'bold' },
});
