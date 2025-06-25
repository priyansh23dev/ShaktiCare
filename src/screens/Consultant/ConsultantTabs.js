// src/screens/Consultant/ConsultantTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HelpRequests from './HelpRequests';   // You will create this screen
// import ScheduleScreen from './ScheduleScreen'; // You will create this screen
// import ProfileScreen from '../Common/ProfileScreen'; // Reusable profile screen
import Icon from 'react-native-vector-icons/Ionicons';
import ConsulantProfile from './ConsulantProfile';
import ScheduleScreen from './ScheduleScreen';
import HelpRequests from './HelpRequests';

HelpRequests

const Tab = createBottomTabNavigator();

export default function ConsultantTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'HelpRequests') iconName = 'list-outline';
          else if (route.name === 'Schedule') iconName = 'calendar-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="HelpRequests" component={HelpRequests} options={{ title: 'Requests' }} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'Schedule' }} />
      <Tab.Screen name="Profile" component={ConsulantProfile} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
