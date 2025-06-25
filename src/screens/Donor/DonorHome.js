// src/screens/Donor/DonorHome.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';

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
      <Text style={styles.email}>{item.email || 'No email provided'}</Text>
      <TouchableOpacity
        style={styles.donateButton}
        onPress={() =>
          navigation.navigate('AddDonation', {
            recipientId: item.id,
            recipientName: item.name,
            recipientRole: item.role,
          })
        }
      >
        <Text style={styles.donateButtonText}>Donate</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient colors={['#6C63FF', '#A084DC']} style={styles.gradient}>
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
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={showNGOs ? ngoList : victimList}
            keyExtractor={(item) => item.id}
            renderItem={renderUserItem}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No {showNGOs ? 'NGOs' : 'Victims'} found.</Text>
            }
            contentContainerStyle={(showNGOs ? ngoList : victimList).length === 0 && styles.emptyContainer}
          />
        )}
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
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    // fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    justifyContent: 'center',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 30,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    color: '#eee',
    fontWeight: '600',
    fontSize: 18,
    fontFamily: 'Montserrat-Medium',
  },
  activeTabText: {
    color: '#6C63FF',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 18,
    shadowColor: '#6C63FF',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginVertical: 8,
    fontFamily: 'Montserrat-Regular',
  },
  donateButton: {
    marginTop: 12,
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  donateButtonText: {
    color: '#fff',
    // fontWeight: '700',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#ddd',
    fontFamily: 'Montserrat-Regular',
  },
});
