import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

export default function DonorHome({ navigation }) {
  const [showNGOs, setShowNGOs] = useState(true);
  const [loading, setLoading] = useState(true);
  const [ngoList, setNgoList] = useState([]);
  const [victimList, setVictimList] = useState([]);

  const userId = auth().currentUser.uid;

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const ngoSnapshot = await firestore()
          .collection('users')
          .where('role', '==', 'NGO')
          .get();

        const victimSnapshot = await firestore()
          .collection('users')
          .where('role', '==', 'Victim')
          .get();

        setNgoList(ngoSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setVictimList(victimSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const renderUserItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name || 'Unnamed'}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <TouchableOpacity
        style={styles.donateButton}
        onPress={() => navigation.navigate('AddDonation', { recipientId: item.id, recipientName: item.name, recipientRole: item.role })}
      >
        <Text style={styles.donateButtonText}>Donate</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, Donor</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, showNGOs && styles.activeTab]}
          onPress={() => setShowNGOs(true)}
        >
          <Text style={[styles.tabText, showNGOs && styles.activeTabText]}>NGOs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, !showNGOs && styles.activeTab]}
          onPress={() => setShowNGOs(false)}
        >
          <Text style={[styles.tabText, !showNGOs && styles.activeTabText]}>Victims</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" />
      ) : (
        <FlatList
          data={showNGOs ? ngoList : victimList}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          ListEmptyComponent={<Text style={styles.emptyText}>No {showNGOs ? 'NGOs' : 'Victims'} found.</Text>}
          contentContainerStyle={(showNGOs ? ngoList : victimList).length === 0 && styles.emptyContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#6C63FF', marginBottom: 20 },
  tabContainer: { flexDirection: 'row', marginBottom: 20 },
  tab: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#eee',
    borderRadius: 30,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeTab: { backgroundColor: '#6C63FF' },
  tabText: { color: '#555', fontWeight: 'bold', fontSize: 16 },
  activeTabText: { color: '#fff' },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  email: { color: '#555', marginVertical: 5 },
  donateButton: {
    marginTop: 10,
    backgroundColor: '#6C63FF',
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  donateButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  emptyContainer: { flexGrow: 1, justifyContent: 'center' },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#999' },
});
