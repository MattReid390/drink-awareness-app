// S12 — AI Insights
// Dedicated screen for AI-generated insights.
// Every insight shows its data basis (DAA-049).
// All insights are individually dismissable.

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { getDailyLog, getWeeklyLog, getDailyInsight, getWeeklyInsight } from '../services';
import { InsightCard, EmptyState } from '../components/ui';
import { Insight } from '../services/insights';
import { getTodayString } from '../utils';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export const AIInsightsScreen: React.FC = () => {
  const navigation = useNavigation();

  // All generated insights
  const [insights, setInsights] = useState<Insight[]>([]);

  // IDs of dismissed insight cards
  const [dismissed, setDismissed] = useState<string[]>([]);

  // Whether insights are loading
  const [loading, setLoading] = useState(true);

  // Load insights from daily and weekly logs on mount
  const loadInsights = async () => {
    setLoading(true);
    setDismissed([]);

    const today = getTodayString();
    const dailyLog = await getDailyLog(today);
    const weeklyLog = await getWeeklyLog(today);

    const generated: Insight[] = [];

    // Only generate daily insight if drinks have been logged today
    if (dailyLog.totalDrinks > 0) {
      const daily = await getDailyInsight(dailyLog);
      generated.push(daily);
    }

    // Only generate weekly insight if drinks have been logged this week
    if (weeklyLog.totalDrinks > 0) {
      const weekly = await getWeeklyInsight(weeklyLog);
      generated.push(weekly);
    }

    setInsights(generated);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadInsights();
    }, [])
  );

  // Dismiss an insight card by ID
  const handleDismiss = (id: string) => {
    setDismissed((prev) => [...prev, id]);
  };

  // Visible insights — those not yet dismissed
  const visibleInsights = insights.filter(
    (insight) => !dismissed.includes(insight.id)
  );

  return (
    <View style={styles.container}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>AI Insights</Text>
        <Pressable onPress={loadInsights} style={styles.refreshButton}>
          <Text style={styles.refreshIcon}>↻</Text>
        </Pressable>
      </View>

      {/* Intro strip — non-medical disclaimer */}
      <View style={styles.introStrip}>
        <Text style={styles.introText}>
          Insights are based on your logged drinks only — not medical advice.
        </Text>
      </View>

      {/* Loading state */}
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Generating insights…</Text>
        </View>
      )}

      {/* Insights list */}
      {!loading && visibleInsights.length === 0 && (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="💡"
            headline="No insights yet"
            ctaLabel="Log some drinks first"
            onPressCta={() => navigation.navigate('Log' as never)}
          />
        </View>
      )}

      {!loading && visibleInsights.length > 0 && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {visibleInsights.map((insight) => (
            <InsightCard
              key={insight.id}
              text={insight.text}
              dataBasis={insight.dataBasis}
              onDismiss={() => handleDismiss(insight.id)}
            />
          ))}
        </ScrollView>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  appBarTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.appBar,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
  },
  refreshButton: {
    position: 'absolute',
    right: Spacing.lg,
  },
  refreshIcon: {
    fontSize: 20,
    color: Colors.white,
  },
  introStrip: {
    backgroundColor: Colors.surfaceGrey,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  introText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    color: Colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    color: Colors.textAccent,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
});