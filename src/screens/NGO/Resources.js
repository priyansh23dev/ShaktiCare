import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Resources({ navigation }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('resources')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const res = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setResources(res);
        setLoading(false);
      }, error => {
        setLoading(false);
        console.error(error);
      });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Icon name="information-circle-outline" size={22} color="#6C63FF" />
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>
      <Text style={styles.cardSubtitle}>Type: {item.type}</Text>
      <Text style={styles.cardSubtitle}>Location: {item.location}</Text>
      <Text style={styles.cardSubtitle}>Contact: {item.contact}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#6C63FF', '#A084DC']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.header}>Support Resources</Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddResource')}
        >
          <Icon name="add-circle" size={28} color="#fff" />
          <Text style={styles.addButtonText}>Add Resource</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 30 }} />
        ) : resources.length === 0 ? (
          <Text style={styles.empty}>No resources available.</Text>
        ) : (
          <FlatList
            data={resources}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 20, paddingTop: 60 },
  header: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginBottom: 20,
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#6C63FF',
    fontSize: 18,
    marginLeft: 8,
    fontFamily: 'Montserrat-Bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: 8,
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 4,
  },
  empty: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },
});
