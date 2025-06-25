import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import firestore from '@react-native-firebase/firestore';
import LinearGradient from 'react-native-linear-gradient';

export default function NGOHome() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdowns, setDropdowns] = useState({});
  const [selected, setSelected] = useState({});
  const [filterType, setFilterType] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [typeItems, setTypeItems] = useState([
    { label: 'All', value: null },
    { label: 'Financial', value: 'Financial' },
    { label: 'Medical', value: 'Medical' },
    { label: 'Consultation', value: 'Consultation' },
    { label: 'Legal Aid', value: 'Legal Aid' },
    { label: 'Shelter Request', value: 'Shelter Request' },
    { label: 'Police Assistance', value: 'Police Assistance' },
    { label: 'Counseling', value: 'Counseling' },
  ]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('helpRequests')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const reqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHelpRequests(reqs);
        setLoading(false);
      }, err => {
        Alert.alert('Error', 'Failed to load help requests');
        setLoading(false);
      });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    firestore()
      .collection('users')
      .where('role', '==', 'Consultant')
      .get()
      .then(snapshot => {
        const data = snapshot.docs.map(doc => {
          const d = doc.data();
          return {
            label: `${d.name} (${d.specialization || 'N/A'})`,
            value: doc.id,
          };
        });
        setConsultants(data);
      })
      .catch(() => Alert.alert('Error', 'Failed to load consultants'));
  }, []);

  const assignConsultant = (requestId, consultantId) => {
    Alert.alert(
      'Confirm Assignment',
      'Are you sure you want to assign this consultant?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Assign',
          onPress: async () => {
            try {
              await firestore().collection('helpRequests').doc(requestId).update({
                assignedConsultant: consultantId,
              });
              Alert.alert('Success', 'Consultant assigned successfully');
            } catch (e) {
              Alert.alert('Error', 'Failed to assign consultant');
            }
          },
        },
      ]
    );
  };

  const filteredRequests = filterType
    ? helpRequests.filter(item => item.requestType === filterType)
    : helpRequests;

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.uname || 'Unnamed Victim'}</Text>
      <Text style={styles.type}>Type: {item.requestType}</Text>

      {item.assignedConsultant ? (
        <Text style={styles.assignedText}>
          Assigned to:{' '}
          {consultants.find(c => c.value === item.assignedConsultant)?.label || 'Consultant'}
        </Text>
      ) : (
        <View style={styles.dropdownWrapper}>
          <DropDownPicker
            open={dropdowns[item.id] || false}
            value={selected[item.id] || null}
            items={consultants}
            setOpen={(open) => setDropdowns(prev => ({ ...prev, [item.id]: open }))}
            setValue={(val) => {
              const v = val();
              setSelected(prev => ({ ...prev, [item.id]: v }));
              assignConsultant(item.id, v);
            }}
            setItems={setConsultants}
            placeholder="Assign Consultant"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownBox}
            listMode="SCROLLVIEW"
            zIndex={1000}
          />
        </View>
      )}
    </View>
  );

  return (
    <LinearGradient colors={["#6C63FF", "#A084DC"]} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.header}>Victim Cases</Text>

        <DropDownPicker
          open={filterOpen}
          value={filterType}
          items={typeItems}
          setOpen={setFilterOpen}
          setValue={setFilterType}
          setItems={setTypeItems}
          placeholder="Filter by Request Type"
          style={styles.filterDropdown}
          dropDownContainerStyle={styles.dropdownBox}
          listMode="SCROLLVIEW"
          zIndex={2000}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 30 }} />
        ) : filteredRequests.length === 0 ? (
          <Text style={styles.empty}>No cases found</Text>
        ) : (
          <FlatList
            data={filteredRequests}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 30, paddingTop: 10 }}
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
    // fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 0,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Montserrat-Medium',
    color: '#333',
    marginBottom: 5,
  },
  type: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    fontFamily: 'Montserrat-Regular',
  },
  assignedText: {
    fontFamily: 'Montserrat-Medium',
    color: '#4CAF50',
    marginTop: 5,
    fontSize: 14,
  },
  dropdownWrapper: {
    // zIndex:9,
    // overflow:'visible'
    
  },
  dropdown: {
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  dropdownBox: {
    borderColor: '#ddd',
    zIndex: 1000,
  },
  filterDropdown: {
    marginBottom: 20,
    borderColor: '#fff',
    borderRadius: 10,
    backgroundColor: '#eee',
    zIndex: 2000,
  },
  empty: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },
});
