import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../auth/LoginScreen';
import RoleSelectionScreen from '../auth/RoleSelectorScreen';
import SignupScreen from '../auth/SignupScreen';
import NGOHome from '../screens/NGO/NGOHome';
import DonorHome from '../screens/Donor/DonorHome';
import VictimHome from '../screens/Victim/VictimHome';
import ConsultantHome from '../screens/Consultant/ConsultantHome';
import AddRequest from '../screens/Victim/AddRequest';
import AddDonation from '../screens/Donor/AddDonation';
import DonationHistory from '../screens/Donor/DonationHistory';
import DonorTabs from '../screens/Donor/DonorTabs';
import VictimTabs from '../screens/Victim/VictimTabs';
import ConsultantTabs from '../screens/Consultant/ConsultantTabs';
import NGOTabs from '../screens/NGO/NGOTabs';
import AddResource from '../screens/NGO/AddResource';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Create Account' }} />
      <Stack.Screen name="AddResource" component={AddResource} options={{ headerShown: false }} />

      <Stack.Screen name="DonorHome" component={DonorTabs} options={{ headerShown: false }} />
      <Stack.Screen name="NGOHome" component={NGOTabs} options={{ headerShown: false }} />
      <Stack.Screen name="AddDonation" component={AddDonation} options={{ title: 'Add Donation' }} />
      <Stack.Screen name="DonationHistory" component={DonationHistory} options={{ title: 'Donation History' }} />
      <Stack.Screen name="VictimHome" component={VictimTabs} options={{ headerShown: false }} />
      <Stack.Screen name="ConsultantHome" component={ConsultantTabs} options={{ headerBackVisible: false, title: 'Consultant Dashboard' }} />
    </Stack.Navigator>
  );
}
