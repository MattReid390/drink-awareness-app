// S27 — Notification Settings
// Manage notification preferences and reminders

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { useFocusEffect } from '@react-navigation/native';
import { localNotificationsManager } from '../services/localNotifications';
import { notificationsManager } from '../services/notifications';
import { NotificationPreferences } from '../types/notification';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const NotificationSettingsScreen: React.FC = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const loadPreferences = async () => {
        try {
          setLoading(true);
          const prefs = await localNotificationsManager.getPreferences();
          setPreferences(prefs);
        } catch (error) {
          console.error('Failed to load preferences:', error);
          Alert.alert('Error', 'Failed to load notification settings');
        } finally {
          setLoading(false);
        }
      };
      loadPreferences();
    }, [])
  );

  const handleToggleNotifications = async (enabled: boolean) => {
    if (preferences) {
      const updated = await localNotificationsManager.updatePreferences({
        enabled,
      });
      setPreferences(updated);

      if (enabled) {
        const registered = await notificationsManager.registerDeviceToken();
        if (registered) {
          Alert.alert('Success', 'Push notifications enabled');
        } else {
          Alert.alert('Info', 'Unable to enable push notifications on this device');
        }
      }
    }
  };

  const handleToggleSetting = async (key: keyof NotificationPreferences, value: boolean) => {
    if (preferences) {
      const updated = await localNotificationsManager.updatePreferences({
        [key]: value,
      });
      setPreferences(updated);

      if (key === 'dailyReminders' && value) {
        await localNotificationsManager.scheduleDailyReminder(updated.dailyReminderTime);
      }
    }
  };

  const handleChangeReminderTime = async () => {
    if (!preferences) return;

    Alert.prompt(
      'Set reminder time',
      'Enter time in HH:MM format (e.g., 09:00)',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Set',
          onPress: async (time: string | undefined) => {
            if (time && /^\d{2}:\d{2}$/.test(time)) {
              const updated = await localNotificationsManager.updatePreferences({
                dailyReminderTime: time,
              });
              setPreferences(updated);

              if (updated.dailyReminders) {
                await localNotificationsManager.scheduleDailyReminder(time);
              }
            } else {
              Alert.alert('Invalid format', 'Please use HH:MM format');
            }
          },
        },
      ],
      'plain-text',
      preferences.dailyReminderTime
    );
  };

  const handleTestNotification = async () => {
    try {
      setRegistering(true);
      await localNotificationsManager.scheduleMilestoneNotification('first_drink', 1);
      Alert.alert('Test Notification', 'Sent! Check your notification center');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    } finally {
      setRegistering(false);
    }
  };

  if (loading || !preferences) {
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
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>Manage how and when you get notified</Text>
        </View>

        {/* Master Toggle */}
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Push Notifications</Text>
              <Text style={styles.settingDesc}>Receive alerts about your achievements</Text>
            </View>
            <Switch
              value={preferences.enabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: Colors.border, true: Colors.lightBlue }}
              thumbColor={preferences.enabled ? Colors.blue : Colors.lightGray}
            />
          </View>
        </View>

        {preferences.enabled && (
          <>
            {/* Daily Reminder */}
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>📝 Daily Reminder</Text>
                  <Text style={styles.settingDesc}>
                    Remember to log your drinks at a specific time
                  </Text>
                </View>
                <Switch
                  value={preferences.dailyReminders}
                  onValueChange={(value) => handleToggleSetting('dailyReminders', value)}
                  trackColor={{ false: Colors.border, true: Colors.lightBlue }}
                  thumbColor={preferences.dailyReminders ? Colors.blue : Colors.lightGray}
                />
              </View>

              {preferences.dailyReminders && (
                <Pressable style={styles.timePickerButton} onPress={handleChangeReminderTime}>
                  <Text style={styles.timePickerLabel}>Reminder time</Text>
                  <Text style={styles.timePickerValue}>{preferences.dailyReminderTime}</Text>
                </Pressable>
              )}
            </View>

            {/* Streak Alerts */}
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>🔥 Streak Alerts</Text>
                  <Text style={styles.settingDesc}>
                    Celebrate milestone streaks (7, 30, 90 days)
                  </Text>
                </View>
                <Switch
                  value={preferences.streakAlerts}
                  onValueChange={(value) => handleToggleSetting('streakAlerts', value)}
                  trackColor={{ false: Colors.border, true: Colors.lightBlue }}
                  thumbColor={preferences.streakAlerts ? Colors.blue : Colors.lightGray}
                />
              </View>
            </View>

            {/* Weekly Goal Alerts */}
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>🎯 Weekly Goal Alerts</Text>
                  <Text style={styles.settingDesc}>Get notified when you hit your weekly goal</Text>
                </View>
                <Switch
                  value={preferences.weeklyGoalAlerts}
                  onValueChange={(value) => handleToggleSetting('weeklyGoalAlerts', value)}
                  trackColor={{ false: Colors.border, true: Colors.lightBlue }}
                  thumbColor={preferences.weeklyGoalAlerts ? Colors.blue : Colors.lightGray}
                />
              </View>
            </View>

            {/* Milestone Celebrations */}
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>🎉 Milestone Celebrations</Text>
                  <Text style={styles.settingDesc}>
                    Celebrate drinking milestones (10, 50, 100+ drinks)
                  </Text>
                </View>
                <Switch
                  value={preferences.milestoneCelebrations}
                  onValueChange={(value) => handleToggleSetting('milestoneCelebrations', value)}
                  trackColor={{ false: Colors.border, true: Colors.lightBlue }}
                  thumbColor={preferences.milestoneCelebrations ? Colors.blue : Colors.lightGray}
                />
              </View>
            </View>

            {/* Test Button */}
            <Pressable
              style={[styles.button, styles.testButton, registering && styles.loadingButton]}
              onPress={handleTestNotification}
              disabled={registering}
            >
              <Text style={styles.buttonText}>
                {registering ? 'Sending...' : '📬 Send Test Notification'}
              </Text>
            </Pressable>
          </>
        )}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ About Notifications</Text>
          <Text style={styles.infoText}>
            Notifications help you stay engaged with your drinking tracking. We only send relevant
            alerts based on your preferences.
          </Text>
        </View>
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
  card: {
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
    marginBottom: Spacing.xs,
  },
  settingDesc: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timePickerLabel: {
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
  },
  timePickerValue: {
    fontSize: Typography.fontSize.label,
    fontWeight: '600',
    color: Colors.blue,
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  testButton: {
    backgroundColor: Colors.blue,
  },
  loadingButton: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.white,
  },
  infoBox: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 8,
    padding: Spacing.md,
  },
  infoTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.blue,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.fontSize.small,
    color: Colors.blue,
    lineHeight: 18,
  },
});
