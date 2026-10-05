// S16 — Goal Progress Tracker
// Track progress towards weekly drinking goal

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { getGoalProgress, getWeeklyLog, saveWeeklyUnitGoal, getWeeklyUnitGoal } from '../services';
import { useFocusEffect } from '@react-navigation/native';

export const GoalProgressScreen: React.FC = () => {
  const [goal, setGoal] = useState(14);
  const [progress, setProgress] = useState({
    currentWeekUnits: 0,
    weeklyGoal: 14,
    percentComplete: 0,
    daysRemaining: 7,
    onTrack: true,
  });
  const [weeklyLog, setWeeklyLog] = useState<any>(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const goalData = await getGoalProgress();
        setProgress(goalData);

        const currentGoal = await getWeeklyUnitGoal();
        setGoal(currentGoal);

        const weekLog = await getWeeklyLog();
        setWeeklyLog(weekLog);
      };
      load();
    }, [])
  );

  const handleGoalChange = async (newGoal: number) => {
    setGoal(newGoal);
    await saveWeeklyUnitGoal(newGoal);
    const updatedProgress = await getGoalProgress();
    setProgress(updatedProgress);
  };

  const remaining = Math.max(0, progress.weeklyGoal - progress.currentWeekUnits);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Goal</Text>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.progressLabel}>Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress.percentComplete}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {progress.currentWeekUnits} of {progress.weeklyGoal} units
        </Text>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>{progress.onTrack ? '✓ On Track' : '⚠ Over Goal'}</Text>
        <Text style={styles.statusValue}>{remaining} units remaining</Text>
      </View>

      {weeklyLog && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Breakdown</Text>
          {weeklyLog.days.map((day: any, idx: number) => (
            <View key={idx} style={styles.dayRow}>
              <Text style={styles.dayName}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(day.date).getDay()]}
              </Text>
              <View style={styles.dayBarBg}>
                <View
                  style={[
                    styles.dayBar,
                    {
                      width: `${Math.min(100, (day.totalUnits / progress.weeklyGoal) * 100)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.dayValue}>{day.totalUnits}u</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Set</Text>
        <View style={styles.buttonRow}>
          {[7, 10, 14, 18].map((g) => (
            <Pressable
              key={g}
              style={[styles.button, goal === g && styles.buttonActive]}
              onPress={() => handleGoalChange(g)}
            >
              <Text style={[styles.buttonText, goal === g && styles.buttonTextActive]}>{g}u</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
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
  progressCard: {
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  progressLabel: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: 12,
    backgroundColor: Colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.blue,
    borderRadius: 6,
  },
  progressText: {
    fontSize: Typography.fontSize.small,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statusLabel: {
    fontSize: Typography.fontSize.body,
    color: Colors.blue,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  statusValue: {
    fontSize: Typography.fontSize.small,
    color: Colors.textAccent,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
    marginBottom: Spacing.md,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  dayName: {
    width: 30,
    fontSize: Typography.fontSize.small,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  dayBarBg: {
    flex: 1,
    height: 20,
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 4,
    overflow: 'hidden',
  },
  dayBar: {
    height: '100%',
    backgroundColor: Colors.blue,
    borderRadius: 4,
  },
  dayValue: {
    width: 30,
    textAlign: 'right',
    fontSize: Typography.fontSize.small,
    color: Colors.textPrimary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: Colors.blue,
  },
  buttonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  buttonTextActive: {
    color: Colors.white,
  },
});
