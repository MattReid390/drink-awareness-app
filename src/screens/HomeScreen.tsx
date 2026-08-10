// S03 — Home / Dashboard
// Main entry point of the app. Shows today's stats,
// primary log action, AI insight, and shortcuts.

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { getDailyLog, getDailyInsight } from '../services';
import { StatCard, InsightCard } from '../components/ui';
import { DailyLog } from '../types';
import { Insight } from '../services/insights';
import { formatUnits } from '../utils';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  // Today's log data
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);

  // AI insight for today
  const [insight, setInsight] = useState<Insight | null>(null);

  // Whether the insight card has been dismissed
  const [insightDismissed, setInsightDismissed] = useState(false);

  // Reload data every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const log = await getDailyLog();
        setDailyLog(log);
        const todayInsight = await getDailyInsight(log);
        setInsight(todayInsight);
      };
      load();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Drink Aware</Text>
      </View>

      {/* Today summary strip */}
      <View style={styles.summaryStrip}>
        <View style={styles.dateRow}>
          <Text style={styles.todayLabel}>Today</Text>
        </View>

        {/* Stat cards */}
        <View style={styles.statRow}>
          <StatCard
            label="DRINKS"
            value={String(dailyLog?.totalDrinks ?? 0)}
            subLabel="today"
          />
          <View style={styles.statGap} />
          <StatCard
            label="UNITS"
            value={formatUnits(dailyLog?.totalUnits ?? 0)}
            subLabel="today"
          />
          <View style={styles.statGap} />
          <StatCard
            label="SPENT"
            value={`£${(dailyLog?.totalSpend ?? 0).toFixed(0)}`}
            subLabel="today"
          />
        </View>
      </View>

      {/* Log drink button */}
      <Pressable
        style={styles.logButton}
        onPress={() => navigation.navigate('Log' as never)}
      >
        <Text style={styles.logButtonText}>+ Log a drink</Text>
      </Pressable>

      {/* Insight card */}
      {insight && !insightDismissed && (
        <View style={styles.section}>
          <InsightCard
            text={insight.text}
            dataBasis={insight.dataBasis}
            onDismiss={() => setInsightDismissed(true)}
          />
        </View>
      )}

      {/* Shortcut cards */}
      <View style={styles.shortcutRow}>
        <Pressable
          style={styles.shortcutCard}
          onPress={() => navigation.navigate('Venues' as never)}
        >
          <Text style={styles.shortcutLabel}>Venues</Text>
          <Text style={styles.shortcutSub}>Find pubs and bars nearby</Text>
        </Pressable>

        <View style={styles.statGap} />

        <Pressable
          style={styles.shortcutCard}
          onPress={() => navigation.navigate('Summary' as never)}
        >
          <Text style={styles.shortcutLabel}>This week</Text>
          <Text style={styles.shortcutSub}>View weekly summary</Text>
        </Pressable>
      </View>

      {/* AI Insights shortcut */}
      <View style={styles.section}>
        <Pressable
          style={styles.insightShortcut}
          onPress={() => navigation.navigate('Summary' as never, { screen: 'AIInsights' } as never)}
        >
          <Text style={styles.insightShortcutLabel}>💡 View all insights</Text>
          <Text style={styles.insightShortcutSub}>See AI-generated insights for today and this week</Text>
        </Pressable>
      </View>
    </ScrollView>
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
    paddingHorizontal: Spacing.lg,
  },
  appBarTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.appBar,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
  summaryStrip: {
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  todayLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  statRow: {
    flexDirection: 'row',
  },
  statGap: {
    width: Spacing.sm,
  },
  logButton: {
    backgroundColor: Colors.blue,
    borderRadius: Spacing.cardBorderRadius,
    height: Spacing.buttonHeight,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
  section: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  shortcutRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: Spacing.cardBorderRadius,
    padding: Spacing.md,
    justifyContent: 'space-between',
    height: 74,
  },
  shortcutLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  shortcutSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.tiny,
    color: Colors.textAccent,
  },
  insightShortcut: {
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: Spacing.cardBorderRadius,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  insightShortcutLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  insightShortcutSub: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.tiny,
    color: Colors.textAccent,
  },
});