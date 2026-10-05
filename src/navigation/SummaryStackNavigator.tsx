// Summary stack navigator — nested inside Summary tab
// Handles navigation between summary screens and Phase 6.4 analytics screens

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SummaryStackParamList } from '../types';
import { WeeklySummaryScreen } from '../screens/WeeklySummaryScreen';
import { DailySummaryScreen } from '../screens/DailySummaryScreen';
import { AIInsightsScreen } from '../screens/AIInsightsScreen';
import { TrendAnalyticsScreen } from '../screens/TrendAnalyticsScreen';
import { GoalProgressScreen } from '../screens/GoalProgressScreen';
import { CostAnalysisScreen } from '../screens/CostAnalysisScreen';
import { VenueAnalyticsScreen } from '../screens/VenueAnalyticsScreen';
import { SyncStatusScreen } from '../screens/SyncStatusScreen';

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
      <Stack.Screen name="TrendAnalytics" component={TrendAnalyticsScreen} />
      <Stack.Screen name="GoalProgress" component={GoalProgressScreen} />
      <Stack.Screen name="CostAnalysis" component={CostAnalysisScreen} />
      <Stack.Screen name="VenueAnalytics" component={VenueAnalyticsScreen} />
      <Stack.Screen name="SyncStatus" component={SyncStatusScreen} />
    </Stack.Navigator>
  );
};
