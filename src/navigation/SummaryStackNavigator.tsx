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
import { UserProfileScreen } from '../screens/UserProfileScreen';
import { UserSettingsScreen } from '../screens/UserSettingsScreen';
import { DataExportScreen } from '../screens/DataExportScreen';
import { DataImportScreen } from '../screens/DataImportScreen';
import { PremiumScreen } from '../screens/PremiumScreen';
import { CoachingScreen } from '../screens/CoachingScreen';
import { HealthIntegrationScreen } from '../screens/HealthIntegrationScreen';
import { NotificationSettingsScreen } from '../screens/NotificationSettingsScreen';
import { DeepLinkTestScreen } from '../screens/DeepLinkTestScreen';
import { PaymentMethodsScreen } from '../screens/PaymentMethodsScreen';
import { InvoicesScreen } from '../screens/InvoicesScreen';

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
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="UserSettings" component={UserSettingsScreen} />
      <Stack.Screen name="DataExport" component={DataExportScreen} />
      <Stack.Screen name="DataImport" component={DataImportScreen} />
      <Stack.Screen name="Premium" component={PremiumScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Invoices" component={InvoicesScreen} />
      <Stack.Screen name="Coaching" component={CoachingScreen} />
      <Stack.Screen name="HealthIntegration" component={HealthIntegrationScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="DeepLinkTest" component={DeepLinkTestScreen} />
    </Stack.Navigator>
  );
};
