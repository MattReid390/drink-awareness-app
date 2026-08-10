// Summary stack navigator — nested inside Summary tab
// Handles navigation between Weekly Summary, Daily Summary, and AI Insights screens

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SummaryStackParamList } from '../types';
import { WeeklySummaryScreen } from '../screens/WeeklySummaryScreen';
import { DailySummaryScreen } from '../screens/DailySummaryScreen';
import { AIInsightsScreen } from '../screens/AIInsightsScreen';

const Stack = createNativeStackNavigator<SummaryStackParamList>();

export const SummaryStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="WeeklySummary"
    >
      <Stack.Screen name="WeeklySummary" component={WeeklySummaryScreen} />
      <Stack.Screen name="DailySummary" component={DailySummaryScreen} />
      <Stack.Screen name="AIInsights" component={AIInsightsScreen} />
    </Stack.Navigator>
  );
};
