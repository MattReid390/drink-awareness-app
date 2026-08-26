// App.tsx — entry point
// Wires navigation and age confirmation gate.
// Shows AgeConfirmationScreen on first launch only.
// Navigates to main tab navigator once age is confirmed.

import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from './src/constants';
import { getAgeConfirmed } from './src/services';
import { isAuthenticated } from './src/services/auth';
import { AgeConfirmationScreen } from './src/screens/AgeConfirmationScreen';
import { AuthStackNavigator } from './src/navigation/AuthStackNavigator';
import { TabNavigator } from './src/navigation';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      const [age, auth] = await Promise.all([
        getAgeConfirmed(),
        isAuthenticated(),
      ]);
      setAgeConfirmed(age);
      setAuthenticated(auth);
      setChecking(false);
    };
    check();
  }, []);

  if (checking) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Colors.blue} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!authenticated ? (
          <Stack.Screen
            name="Auth"
          >
            {() => (
              <AuthStackNavigator onAuthComplete={() => setAuthenticated(true)} />
            )}
          </Stack.Screen>
        ) : !ageConfirmed ? (
          <Stack.Screen name="AgeConfirmation">
            {() => (
              <AgeConfirmationScreen
                onConfirmed={() => setAgeConfirmed(true)}
              />
            )}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="MainTabs" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
});