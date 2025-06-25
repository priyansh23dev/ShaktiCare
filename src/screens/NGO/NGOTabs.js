// src/screens/NGO/NGOTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VictimCases from './VictimCases';
import Resources from './Resources';

import Icon from 'react-native-vector-icons/Ionicons';
import ProfileScreen from '../Victim/ProfileScreen';
import NGOHome from './NGOHome';

const Tab = createBottomTabNavigator();

export default function NGOTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'NGOHome') iconName = 'people-outline';
          else if (route.name === 'Resources') iconName = 'layers-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="NGOHome" component={NGOHome} options={{ title: 'Victim Cases' }} />
      <Tab.Screen name="Resources" component={Resources} options={{ title: 'Resources' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
