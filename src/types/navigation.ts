// Navigation route parameter definitions
// Ensures type safety when navigating between screens

import { Drink } from './drink';
import { Venue } from './venue';

// Root stack - handles authentication and age confirmation gates
export type RootStackParamList = {
  Auth: undefined; // No params - authentication flow
  AgeConfirmation: undefined; // No params - first launch only
  MainTabs: undefined; // No params - entry to tab navigator
};

// Bottom tab navigator - 5 main tabs
export type TabParamList = {
  Home: undefined; // S03 - no params
  Venues: undefined; // S04 - no params
  Log: undefined; // S08 - no params
  Summary: undefined; // S10 - no params
  Settings: undefined; // S14 - no params
};

// Venue stack - nested inside Venues tab
export type VenueStackParamList = {
  VenueList: undefined; // S04 - no params
  MapView: undefined; // S05 - no params
  VenueDetail: { venue: Venue }; // S06 - requires venue object
  DrinkDetail: { venue: Venue }; // S07 - requires venue object
};

// Summary stack - nested inside Summary tab
export type SummaryStackParamList = {
  DailySummary: { date?: string }; // S10 - optional date (defaults to today)
  WeeklySummary: { weekStart?: string }; // S11 - optional week start date
  AIInsights: undefined; // S12 - no params
  TrendAnalytics: undefined; // S15 - 30-day trends
  GoalProgress: undefined; // S16 - goal tracker
  CostAnalysis: undefined; // S17 - spending analysis
  VenueAnalytics: undefined; // S18 - venue frequency
  SyncStatus: undefined; // S19 - cloud sync status
  UserProfile: undefined; // S20 - user profile management
  UserSettings: undefined; // S21 - synced user settings
  DataExport: undefined; // S22 - export drink data
  DataImport: undefined; // S23 - import drink data
  Premium: undefined; // S24 - subscription and premium features
  PaymentMethods: undefined; // S29 - manage payment methods
  Invoices: undefined; // S30 - view invoices
  Coaching: undefined; // S25 - AI coaching recommendations
  HealthIntegration: undefined; // S26 - health app integration
  NotificationSettings: undefined; // S27 - notification preferences
  DeepLinkTest: undefined; // S28 - deep link testing screen
};

// Log stack - nested inside Log tab
export type LogStackParamList = {
  LogDrink: { prefillDrink?: Partial<Drink> }; // S08 - optional prefill from venue menu
};
