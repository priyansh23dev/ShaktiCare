import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import DonationHistory from './DonationHistory';
import DonorHome from './DonorHome';
import DonorProfile from './DonorProfile';

const Tab = createBottomTabNavigator();

export default function DonorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Donate') iconName = 'cash-outline';
          else if (route.name === 'History') iconName = 'receipt-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Donate" component={DonorHome} options={{ headerShown: false }} />
      <Tab.Screen name="History" component={DonationHistory} options={{ title: 'Donation History' }} />
      <Tab.Screen name="DonorProfile" component={DonorProfile} options={{ title: 'My Profile' }} />
    </Tab.Navigator>
  );
}
