import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function ConsultantHome() {
  const helpRequests = [
    { id: '1', victimName: 'Rita Sharma', type: 'Legal Consultation', status: 'Pending' },
    { id: '2', victimName: 'Anita Singh', type: 'Psychological Support', status: 'Scheduled' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Consultant Dashboard</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.sectionTitle}>Help Requests</Text>
        {helpRequests.map((req) => (
          <View key={req.id} style={styles.card}>
            <Text style={styles.cardTitle}>{req.victimName}</Text>
            <Text style={styles.cardSubtitle}>{req.type}</Text>
            <Text style={styles.cardSubtitle}>Status: {req.status}</Text>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Respond</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
});
