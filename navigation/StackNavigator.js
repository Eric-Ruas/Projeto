import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import InventoryScreen from '../screens/InventoryScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Inventory" component={InventoryScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
