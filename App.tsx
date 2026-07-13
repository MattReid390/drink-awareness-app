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
import { AgeConfirmationScreen } from './src/screens/AgeConfirmationScreen';
import { TabNavigator } from './src/navigation';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // Whether the user has already confirmed their age
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  // Whether the app is still checking AsyncStorage on launch
  const [checking, setChecking] = useState(true);

  // Check age confirmation status on first launch
  useEffect(() => {
    const check = async () => {
      const confirmed = await getAgeConfirmed();
      setAgeConfirmed(confirmed);
      setChecking(false);
    };
    check();
  }, []);

  // Show a blank loading screen while checking AsyncStorage
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
        {!ageConfirmed ? (
          // Show age confirmation gate on first launch
          <Stack.Screen name="AgeConfirmation">
            {() => (
              <AgeConfirmationScreen
                onConfirmed={() => setAgeConfirmed(true)}
              />
            )}
          </Stack.Screen>
        ) : (
          // Show main tab navigator once age is confirmed
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