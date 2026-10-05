// S26 — Health Integration
// Connect to Apple Health or Google Fit for comprehensive wellness tracking

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { useFocusEffect } from '@react-navigation/native';
import {
  getHealthStatus,
  connectHealthProvider,
  syncHealthData,
  disconnectHealthProvider,
  HealthIntegration,
  HealthDataPoint,
} from '../services/premium';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const HealthIntegrationScreen: React.FC = () => {
  const [health, setHealth] = useState<HealthIntegration | null>(null);
  const [healthData, setHealthData] = useState<HealthDataPoint | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadHealth = async () => {
        try {
          setLoading(true);
          const status = await getHealthStatus();
          if (status) {
            setHealth(status);
          }
        } catch (error) {
          console.error('Failed to load health status:', error);
        } finally {
          setLoading(false);
        }
      };
      loadHealth();
    }, [])
  );

  const handleConnect = async (provider: 'apple_health' | 'google_fit') => {
    Alert.alert(
      `Connect ${provider === 'apple_health' ? 'Apple Health' : 'Google Fit'}`,
      `Allow Drink Awareness to access your health data?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: async () => {
            try {
              setConnecting(true);
              // In production, use OAuth flow or native health kit APIs
              // For now, simulate connection with mock token
              await connectHealthProvider(
                provider,
                `mock_access_token_${provider}`,
                `mock_refresh_token_${provider}`,
                3600
              );
              setHealth({
                connected: true,
                provider,
                syncedAt: new Date().toISOString(),
              });
              Alert.alert('Success', 'Connected successfully!');
            } catch (error) {
              Alert.alert('Error', 'Failed to connect. Please try again.');
            } finally {
              setConnecting(false);
            }
          },
        },
      ]
    );
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const data = await syncHealthData();
      if (data) {
        setHealthData(data.dataPoints);
        Alert.alert('Synced', 'Health data synchronized successfully');
      }
    } catch (error) {
      console.error('Sync error:', error);
      Alert.alert('Error', 'Failed to sync health data');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    Alert.alert('Disconnect', 'Are you sure? You can reconnect anytime.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Disconnect',
        style: 'destructive',
        onPress: async () => {
          try {
            await disconnectHealthProvider();
            setHealth({ connected: false });
            setHealthData(null);
            Alert.alert('Disconnected', 'Health integration removed');
          } catch (error) {
            Alert.alert('Error', 'Failed to disconnect');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.blue} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Health Integration</Text>
          <Text style={styles.subtitle}>Sync with your health app for comprehensive wellness</Text>
        </View>

        {!health?.connected ? (
          <>
            {/* Connection Options */}
            <View style={styles.optionsContainer}>
              {/* Apple Health */}
              <Pressable
                style={[styles.optionCard, Platform.OS !== 'ios' && styles.disabledCard]}
                onPress={() => handleConnect('apple_health')}
                disabled={Platform.OS !== 'ios' || connecting}
              >
                <Text style={styles.optionIcon}>🍎</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Apple Health</Text>
                  <Text style={styles.optionDesc}>
                    {Platform.OS === 'ios' ? 'Connect to Health app' : 'Available on iOS only'}
                  </Text>
                </View>
                {connecting ? (
                  <ActivityIndicator color={Colors.blue} size="small" />
                ) : (
                  <Text style={styles.arrow}>›</Text>
                )}
              </Pressable>

              {/* Google Fit */}
              <Pressable
                style={[styles.optionCard, Platform.OS !== 'android' && styles.disabledCard]}
                onPress={() => handleConnect('google_fit')}
                disabled={Platform.OS !== 'android' || connecting}
              >
                <Text style={styles.optionIcon}>🏃</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Google Fit</Text>
                  <Text style={styles.optionDesc}>
                    {Platform.OS === 'android'
                      ? 'Connect to Google Fit'
                      : 'Available on Android only'}
                  </Text>
                </View>
                {connecting ? (
                  <ActivityIndicator color={Colors.blue} size="small" />
                ) : (
                  <Text style={styles.arrow}>›</Text>
                )}
              </Pressable>
            </View>

            {/* Benefits */}
            <View style={styles.benefitsBox}>
              <Text style={styles.benefitsTitle}>✨ Why Connect?</Text>
              <Text style={styles.benefitItem}>• Track steps and activity levels</Text>
              <Text style={styles.benefitItem}>• Monitor sleep patterns</Text>
              <Text style={styles.benefitItem}>• Sync heart rate data</Text>
              <Text style={styles.benefitItem}>• Get holistic health insights</Text>
              <Text style={styles.benefitItem}>• Better AI coaching recommendations</Text>
            </View>
          </>
        ) : (
          <>
            {/* Connected Status */}
            <View style={styles.connectedBox}>
              <View style={styles.statusHeader}>
                <Text style={styles.statusIcon}>✓</Text>
                <View style={styles.statusInfo}>
                  <Text style={styles.statusTitle}>
                    {health.provider === 'apple_health' ? 'Apple Health' : 'Google Fit'} Connected
                  </Text>
                  {health.syncedAt && (
                    <Text style={styles.statusDate}>
                      Synced {new Date(health.syncedAt).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>

              {healthData && (
                <View style={styles.healthDataContainer}>
                  <View style={styles.dataCard}>
                    <Text style={styles.dataLabel}>Steps</Text>
                    <Text style={styles.dataValue}>{healthData.stepsToday.toLocaleString()}</Text>
                  </View>
                  <View style={styles.dataCard}>
                    <Text style={styles.dataLabel}>Sleep</Text>
                    <Text style={styles.dataValue}>{healthData.sleepHours}h</Text>
                  </View>
                  <View style={styles.dataCard}>
                    <Text style={styles.dataLabel}>HR</Text>
                    <Text style={styles.dataValue}>{healthData.heartRate} bpm</Text>
                  </View>
                </View>
              )}

              <View style={styles.buttonGroup}>
                <Pressable
                  style={[styles.button, styles.syncButton, syncing && styles.loadingButton]}
                  onPress={handleSync}
                  disabled={syncing}
                >
                  <Text style={styles.buttonText}>{syncing ? 'Syncing...' : 'Sync Now'}</Text>
                </Pressable>

                <Pressable
                  style={[styles.button, styles.disconnectButton]}
                  onPress={handleDisconnect}
                  disabled={syncing}
                >
                  <Text style={[styles.buttonText, { color: Colors.red }]}>Disconnect</Text>
                </Pressable>
              </View>
            </View>

            {/* Privacy Notice */}
            <View style={styles.privacyBox}>
              <Text style={styles.privacyTitle}>🔒 Privacy</Text>
              <Text style={styles.privacyText}>
                Your health data stays on your device. We only sync aggregated insights to improve
                your coaching recommendations.
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.heading,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.body,
    color: Colors.textMuted,
  },
  optionsContainer: {
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  optionCard: {
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  disabledCard: {
    opacity: 0.5,
  },
  optionIcon: {
    fontSize: 32,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
  },
  optionDesc: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  arrow: {
    fontSize: 20,
    color: Colors.textMuted,
  },
  benefitsBox: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  benefitsTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.blue,
    marginBottom: Spacing.md,
  },
  benefitItem: {
    fontSize: Typography.fontSize.small,
    color: Colors.blue,
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  connectedBox: {
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statusIcon: {
    fontSize: 24,
    color: Colors.green,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
  },
  statusDate: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  healthDataContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  dataCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: Spacing.md,
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  dataValue: {
    fontSize: Typography.fontSize.label,
    fontWeight: '600',
    color: Colors.blue,
  },
  buttonGroup: {
    gap: Spacing.sm,
  },
  button: {
    paddingVertical: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  syncButton: {
    backgroundColor: Colors.blue,
  },
  disconnectButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  loadingButton: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.white,
  },
  privacyBox: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 8,
    padding: Spacing.md,
  },
  privacyTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.blue,
    marginBottom: Spacing.sm,
  },
  privacyText: {
    fontSize: Typography.fontSize.small,
    color: Colors.blue,
    lineHeight: 18,
  },
});
