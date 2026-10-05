// Deep linking configuration
// Maps routes to both custom scheme and universal link paths

import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

export const linking: { prefixes: string[]; config: any } = {
  prefixes: [prefix, 'drinkawareness://', 'https://drinkaware.app/'],

  config: {
    screens: {
      Auth: 'auth',
      AgeConfirmation: 'age-confirmation',
      MainTabs: {
        screens: {
          Home: 'home',
          Venues: {
            screens: {
              VenueList: 'venues',
              MapView: 'venues/map',
              VenueDetail: 'venue/:id',
              DrinkDetail: 'venue/:id/drink',
            },
          },
          Log: {
            screens: {
              LogDrink: 'log-drink',
            },
          },
          Summary: {
            screens: {
              WeeklySummary: 'summary',
              DailySummary: 'summary/daily',
              AIInsights: 'insights',
              TrendAnalytics: 'analytics/trends',
              GoalProgress: 'goal',
              CostAnalysis: 'analytics/cost',
              VenueAnalytics: 'analytics/venue',
              SyncStatus: 'sync',
              UserProfile: 'profile',
              UserSettings: 'settings',
              DataExport: 'export',
              DataImport: 'import',
              Premium: 'premium',
              Coaching: 'coaching',
              HealthIntegration: 'health',
              NotificationSettings: 'notifications',
            },
          },
          Settings: 'settings',
        },
      },
    } as Record<string, any>,
  },
};

export const linking_old = {
  prefixes: [prefix],
  config: {
    screens: {
      Home: 'home',
      NotFound: '*',
    },
  },
};
