// Venue stack navigator — nested inside Venues tab
// Handles navigation between Venue List, Map, Detail, and Drink Menu screens

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VenueStackParamList } from '../types';
import { VenueListScreen } from '../screens/VenueListScreen';
import { MapScreen } from '../screens/MapScreen';
import { VenueDetailScreen } from '../screens/VenueDetailScreen';
import { DrinkMenuScreen } from '../screens/DrinkMenuScreen';

const Stack = createNativeStackNavigator<VenueStackParamList>();

export const VenueStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="VenueList"
    >
      <Stack.Screen
        name="VenueList"
        component={VenueListScreen}
      />
      <Stack.Screen
        name="MapView"
        component={MapScreen}
      />
      <Stack.Screen
        name="VenueDetail"
        component={VenueDetailScreen}
      />
      <Stack.Screen
        name="DrinkDetail"
        component={DrinkMenuScreen}
      />
    </Stack.Navigator>
  );
};
