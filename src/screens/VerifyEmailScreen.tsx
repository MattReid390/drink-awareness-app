import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { verifyEmail } from '../services/auth';
import { Colors, Spacing, Typography } from '../constants';

interface VerifyEmailScreenProps {
  email: string;
  onVerifyComplete: () => void;
  onResendEmail: () => void;
}

export function VerifyEmailScreen({
  email,
  onVerifyComplete,
  onResendEmail,
}: VerifyEmailScreenProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleVerify = async () => {
    setError('');

    if (!code.trim()) {
      setError('Verification code is required');
      return;
    }

    setLoading(true);
    try {
      await verifyEmail(code.trim());
      onVerifyComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setError('');
    setResendCountdown(60);
    onResendEmail();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We sent a code to {'\n'}
            <Text style={styles.email}>{email}</Text>
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Verification Code</Text>
            <TextInput
              style={styles.input}
              placeholder="000000"
              placeholderTextColor={Colors.gray}
              keyboardType="number-pad"
              maxLength={6}
              editable={!loading}
              value={code}
              onChangeText={setCode}
            />
            <Text style={styles.hint}>Check your email for the 6-digit code</Text>
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Verify Email</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn&apos;t receive a code? </Text>
            <TouchableOpacity onPress={handleResend} disabled={loading || resendCountdown > 0}>
              <Text
                style={[
                  styles.resendLink,
                  (loading || resendCountdown > 0) && styles.resendLinkDisabled,
                ]}
              >
                {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navy,
  },
  content: {
    flexGrow: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.fontSize.heading,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.body,
    color: Colors.textLight,
    textAlign: 'center',
  },
  email: {
    color: Colors.blue,
    fontWeight: Typography.fontWeight.medium,
  },
  form: {
    gap: Spacing.md,
  },
  formGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
  input: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Spacing.inputBorderRadius,
    fontSize: Typography.fontSize.body,
    color: Colors.navy,
    textAlign: 'center',
    letterSpacing: 2,
  },
  hint: {
    fontSize: Typography.fontSize.tiny,
    color: Colors.gray,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: Colors.errorBg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.red,
    padding: Spacing.md,
    borderRadius: 4,
  },
  errorText: {
    color: Colors.red,
    fontSize: Typography.fontSize.small,
  },
  button: {
    backgroundColor: Colors.blue,
    paddingVertical: Spacing.md,
    borderRadius: Spacing.inputBorderRadius,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.medium,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  resendText: {
    color: Colors.textLight,
    fontSize: Typography.fontSize.small,
  },
  resendLink: {
    color: Colors.blue,
    fontSize: Typography.fontSize.small,
    fontWeight: Typography.fontWeight.medium,
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },
});
