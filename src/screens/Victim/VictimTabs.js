// src/screens/Victim/VictimTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VictimHome from './VictimHome';
import AddRequest from './AddRequest';
import ProfileScreen from './ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function VictimTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Requests') iconName = 'list-outline';
          else if (route.name === 'AddRequest') iconName = 'add-circle-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#aaa',
        tabBarLabelStyle: {
          fontFamily: 'Montserrat-Regular',
          fontSize: 12,
        },
        tabBarStyle: {
          paddingVertical: 6,
          height: 60,
        },
        headerTitleStyle: {
          fontFamily: 'Montserrat-Bold',
          fontSize: 18,
          color: '#6C63FF',
        },
        headerStyle: {
          backgroundColor: '#F5F5F5',
          elevation: 0,
        },
      })}
    >
      <Tab.Screen
        name="Requests"
        component={VictimHome}
        options={{ title: 'My Requests', headerShown: false }}
      />
      <Tab.Screen
        name="AddRequest"
        component={AddRequest}
        options={{ title: 'Add Request' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
    </Tab.Navigator>
  );
}
