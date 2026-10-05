// S21 — User Settings (Synced with Server)
// Manage personal drink limits, notifications, and UI preferences

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Switch,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { useFocusEffect } from '@react-navigation/native';
import { getUserSettings, updateUserSettings, UserSettings } from '../services/userProfile';
import { ErrorBoundary } from '../components/ErrorBoundary';

export const UserSettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit state
  const [editDailyLimit, setEditDailyLimit] = useState('14');
  const [editWeeklyLimit, setEditWeeklyLimit] = useState('98');
  const [editNotifications, setEditNotifications] = useState(true);
  const [editDarkMode, setEditDarkMode] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadSettings = async () => {
        try {
          setLoading(true);
          const userSettings = await getUserSettings();
          if (userSettings) {
            setSettings(userSettings);
            setEditDailyLimit(userSettings.dailyLimitUnits.toString());
            setEditWeeklyLimit(userSettings.weeklyLimitUnits.toString());
            setEditNotifications(userSettings.notificationsEnabled);
            setEditDarkMode(userSettings.darkMode);
          }
        } catch (error) {
          console.error('Failed to load settings:', error);
          Alert.alert('Error', 'Failed to load settings');
        } finally {
          setLoading(false);
        }
      };
      loadSettings();
    }, [])
  );

  const handleSave = async () => {
    const dailyLimit = parseFloat(editDailyLimit);
    const weeklyLimit = parseFloat(editWeeklyLimit);

    if (isNaN(dailyLimit) || isNaN(weeklyLimit) || dailyLimit <= 0 || weeklyLimit <= 0) {
      Alert.alert('Validation', 'Limits must be positive numbers');
      return;
    }

    try {
      setSaving(true);
      const updated = await updateUserSettings({
        dailyLimitUnits: dailyLimit,
        weeklyLimitUnits: weeklyLimit,
        notificationsEnabled: editNotifications,
        darkMode: editDarkMode,
      });
      if (updated) {
        setSettings(updated);
        setIsEditing(false);
        Alert.alert('Success', 'Settings updated successfully');
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      Alert.alert('Error', 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (settings) {
      setEditDailyLimit(settings.dailyLimitUnits.toString());
      setEditWeeklyLimit(settings.weeklyLimitUnits.toString());
      setEditNotifications(settings.notificationsEnabled);
      setEditDarkMode(settings.darkMode);
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.blue} />
      </View>
    );
  }

  if (!settings) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load settings</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Preferences</Text>
        </View>

        {/* Drinking Limits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily & Weekly Limits</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Daily Limit (units)</Text>
              <Text style={styles.settingDescription}>NHS recommends max 4 units per day</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editDailyLimit}
                onChangeText={setEditDailyLimit}
                keyboardType="decimal-pad"
                placeholderTextColor={Colors.textMuted}
                editable={!saving}
              />
            ) : (
              <Text style={styles.settingValue}>{settings.dailyLimitUnits}</Text>
            )}
          </View>

          <View style={[styles.settingRow, styles.borderTop]}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Weekly Limit (units)</Text>
              <Text style={styles.settingDescription}>NHS recommends max 14 units per week</Text>
            </View>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editWeeklyLimit}
                onChangeText={setEditWeeklyLimit}
                keyboardType="decimal-pad"
                placeholderTextColor={Colors.textMuted}
                editable={!saving}
              />
            ) : (
              <Text style={styles.settingValue}>{settings.weeklyLimitUnits}</Text>
            )}
          </View>
        </View>

        {/* Notifications Section */}
        <View style={[styles.section, styles.borderTop]}>
          <Text style={styles.sectionTitle}>Notifications</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Enable Notifications</Text>
              <Text style={styles.settingDescription}>Get alerts when approaching limits</Text>
            </View>
            {isEditing ? (
              <Switch
                value={editNotifications}
                onValueChange={setEditNotifications}
                disabled={saving}
              />
            ) : (
              <Text style={styles.settingValue}>{settings.notificationsEnabled ? '✓' : '○'}</Text>
            )}
          </View>
        </View>

        {/* Display Section */}
        <View style={[styles.section, styles.borderTop]}>
          <Text style={styles.sectionTitle}>Display</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingDescription}>Use dark theme for the app</Text>
            </View>
            {isEditing ? (
              <Switch value={editDarkMode} onValueChange={setEditDarkMode} disabled={saving} />
            ) : (
              <Text style={styles.settingValue}>{settings.darkMode ? '✓' : '○'}</Text>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        {isEditing ? (
          <View style={styles.buttonGroup}>
            <Pressable
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save Settings'}</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={saving}
            >
              <Text style={[styles.buttonText, { color: Colors.navy }]}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={[styles.button, styles.editButton]} onPress={() => setIsEditing(true)}>
            <Text style={styles.buttonText}>Edit Settings</Text>
          </Pressable>
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
  },
  section: {
    marginBottom: Spacing.lg,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
    paddingTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 8,
  },
  settingContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  settingDescription: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  settingValue: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.blue,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
    minWidth: 60,
  },
  buttonGroup: {
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: Colors.blue,
    marginTop: Spacing.lg,
  },
  saveButton: {
    backgroundColor: Colors.green,
  },
  cancelButton: {
    backgroundColor: Colors.surfaceGrey,
  },
  buttonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },
  errorText: {
    fontSize: Typography.fontSize.body,
    color: Colors.red,
    textAlign: 'center',
  },
});
