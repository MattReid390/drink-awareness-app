import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { VerifyEmailScreen } from '../screens/VerifyEmailScreen';
import { PasswordResetScreen } from '../screens/PasswordResetScreen';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  VerifyEmail: { email: string };
  PasswordReset: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface AuthStackNavigatorProps {
  onAuthComplete: () => void;
}

export function AuthStackNavigator({ onAuthComplete }: AuthStackNavigatorProps) {
  const [signUpEmail, setSignUpEmail] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showPasswordReset ? (
        <Stack.Screen name="PasswordReset">
          {() => (
            <PasswordResetScreen
              onResetComplete={() => setShowPasswordReset(false)}
              onCancel={() => setShowPasswordReset(false)}
            />
          )}
        </Stack.Screen>
      ) : signUpEmail ? (
        <Stack.Screen name="VerifyEmail">
          {() => (
            <VerifyEmailScreen
              email={signUpEmail}
              onVerifyComplete={onAuthComplete}
              onResendEmail={() => {
                // Resend logic handled by backend
              }}
            />
          )}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen name="Login">
            {({ navigation }) => (
              <LoginScreen
                onLoginComplete={onAuthComplete}
                onSwitchToSignUp={() => navigation.navigate('SignUp')}
                onForgotPassword={() => setShowPasswordReset(true)}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="SignUp">
            {({ navigation }) => (
              <SignUpScreen
                onSignUpComplete={(email) => {
                  setSignUpEmail(email);
                  navigation.navigate('VerifyEmail', { email });
                }}
                onSwitchToLogin={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="VerifyEmail">
            {() => (
              <VerifyEmailScreen
                email={signUpEmail}
                onVerifyComplete={onAuthComplete}
                onResendEmail={() => {
                  // Resend logic handled by backend
                }}
              />
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}
