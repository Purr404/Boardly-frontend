import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

// Screens (we'll add these next)
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import RoomDetailsScreen from '../screens/RoomDetailsScreen';
import BookingScreen from '../screens/BookingScreen';
import OwnerDashboardScreen from '../screens/OwnerDashboardScreen';
import PostListingScreen from '../screens/PostListingScreen';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import LocationSelectorScreen from '../screens/LocationSelectorScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Owner Dashboard" component={OwnerDashboardScreen} />
      <Tab.Screen name="Admin Panel" component={AdminPanelScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="RoomDetails" component={RoomDetailsScreen} />
          <Stack.Screen name="Booking" component={BookingScreen} />
          <Stack.Screen name="PostListing" component={PostListingScreen} />
          <Stack.Screen name="LocationSelector" component={LocationSelectorScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}