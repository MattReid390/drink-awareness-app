// S14 — Settings / Responsible Use
// User preferences and responsible use information.
// Reinforces local-first, no-account approach (DAA-050).
// Tone: practical and matter-of-fact, not preachy.

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import {
  resetAllData,
  getWeeklyUnitGoal,
  saveWeeklyUnitGoal,
} from '../services';

export const SettingsScreen: React.FC = () => {
  // User's current weekly unit goal
  const [weeklyGoal, setWeeklyGoal] = useState(14);

  // Load saved weekly goal on mount
  useEffect(() => {
    const load = async () => {
      const goal = await getWeeklyUnitGoal();
      setWeeklyGoal(goal);
    };
    load();
  }, []);

  // Prompts user to update their weekly unit goal
  const handleEditGoal = () => {
    Alert.prompt(
      'Weekly unit goal',
      'Enter your weekly unit goal (NHS recommends 14).',
      async (value) => {
        const parsed = parseInt(value, 10);
        if (!isNaN(parsed) && parsed > 0) {
          await saveWeeklyUnitGoal(parsed);
          setWeeklyGoal(parsed);
        }
      },
      'plain-text',
      String(weeklyGoal)
    );
  };

  // Confirms and resets all app data
  const handleReset = () => {
    Alert.alert(
      'Reset all data',
      'This will permanently delete all logged drinks and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            setWeeklyGoal(14);
          },
        },
      ]
    );
  };

  // Opens the NHS alcohol support page
  const handleSupportResources = () => {
    Linking.openURL('https://www.nhs.uk/live-well/alcohol-advice/');
  };

  // Opens the NHS unit guidelines page
  const handleUnitGuidelines = () => {
    Linking.openURL(
      'https://www.nhs.uk/live-well/alcohol-advice/calculating-alcohol-units/'
    );
  };

  return (
    <View style={styles.container}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Settings</Text>
      </View>

      {/* Preferences section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Preferences</Text>
      </View>

      {/* Weekly unit goal row */}
      <Pressable style={styles.row} onPress={handleEditGoal}>
        <View style={styles.rowContent}>
          <Text style={styles.rowLabel}>Weekly unit goal</Text>
          <Text style={styles.rowSub}>
            NHS recommends no more than 14 units per week
          </Text>
        </View>
        <Text style={styles.rowValue}>{weeklyGoal} units</Text>
      </Pressable>

      {/* Responsible use section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Responsible use</Text>
      </View>

      {/* About this app row */}
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.rowLabel}>About this app</Text>
          <Text style={styles.rowSub}>
            Drink Aware is a personal awareness tool, not medical advice
          </Text>
        </View>
      </View>

      {/* UK unit guidelines row */}
      <Pressable style={styles.row} onPress={handleUnitGuidelines}>
        <View style={styles.rowContent}>
          <Text style={styles.rowLabel}>UK unit guidelines</Text>
          <Text style={styles.rowSub}>View NHS alcohol unit guidance</Text>
        </View>
        <Text style={styles.rowChevron}>›</Text>
      </Pressable>

      {/* Support resources row */}
      <Pressable style={styles.row} onPress={handleSupportResources}>
        <View style={styles.rowContent}>
          <Text style={styles.rowLabel}>Support resources</Text>
          <Text style={styles.rowSub}>NHS alcohol advice and support</Text>
        </View>
        <Text style={styles.rowChevron}>›</Text>
      </Pressable>

      {/* Reset all data row — destructive */}
      <Pressable style={styles.row} onPress={handleReset}>
        <Text style={styles.destructiveLabel}>Reset all data</Text>
      </Pressable>

      {/* Local-first footnote */}
      <View style={styles.footnoteContainer}>
        <Text style={styles.footnote}>
          No account, no sign-in. All your data stays on this device.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  appBar: {
    height: Spacing.appBar,
    backgroundColor: Colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  appBarTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.appBar,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
  sectionHeader: {
    height: Spacing.sectionHeader,
    backgroundColor: Colors.surfaceGrey,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  row: {
    minHeight: Spacing.rowHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  rowSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.small,
    color: Colors.textAccent,
    marginTop: Spacing.xs,
  },
  rowValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.blue,
    marginLeft: Spacing.md,
  },
  rowChevron: {
    fontSize: 20,
    color: Colors.border,
    marginLeft: Spacing.md,
  },
  destructiveLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.red,
  },
  footnoteContainer: {
    padding: Spacing.lg,
  },
  footnote: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});