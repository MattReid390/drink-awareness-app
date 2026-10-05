// S15 — 30-Day Trend Analytics
// Visualize drinking patterns over the last 30 days

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { StatCard, EmptyState, SkeletonCard } from '../components/ui';
import { get30DayTrend } from '../services/analytics';
import { useFocusEffect } from '@react-navigation/native';
import { cache } from '../utils/cache';
import { performance } from '../utils/performance';

const CACHE_KEY = 'trend_analytics';

export const TrendAnalyticsScreen: React.FC = () => {
  const [trendData, setTrendData] = useState<
    Array<{ date: string; units: number; drinks: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        // Try cache first
        const cached = cache.get<Array<{ date: string; units: number; drinks: number }>>(CACHE_KEY);
        if (cached) {
          setTrendData(cached);
          setLoading(false);
          return;
        }

        // Measure and load data
        const data = await performance.measureAsync('get30DayTrend', () => get30DayTrend());
        cache.set(CACHE_KEY, data, 10 * 60 * 1000); // Cache for 10 minutes
        setTrendData(data);
        setLoading(false);
      };
      load();
    }, [])
  );

  // Memoize calculations to avoid recalculating on every render
  const { avgUnits, maxUnits } = useMemo(() => {
    if (!trendData || trendData.length === 0) {
      return { avgUnits: '0.0', maxUnits: 0 };
    }
    const total = trendData.reduce((sum, d) => sum + d.units, 0);
    return {
      avgUnits: (total / 30).toFixed(1),
      maxUnits: Math.max(...trendData.map((d) => d.units)),
    };
  }, [trendData]);

  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <SkeletonCard lines={4} />
        <SkeletonCard lines={3} />
      </ScrollView>
    );
  }

  if (!trendData || trendData.length === 0) {
    return (
      <EmptyState
        icon="📊"
        headline="No drinking data yet"
        ctaLabel="Log your first drink"
        onPressCta={() => {}}
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>30-Day Trends</Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard label="AVG/DAY" value={avgUnits} subLabel="units" />
        <StatCard label="PEAK" value={maxUnits.toString()} subLabel="units" />
        <StatCard label="TOTAL" value={trendData.length.toString()} subLabel="days logged" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Last 7 Days</Text>
        {trendData.slice(-7).map((day) => (
          <View key={day.date} style={styles.row}>
            <Text style={styles.date}>{day.date}</Text>
            <View style={styles.barBg}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${(day.units / maxUnits) * 100}%`,
                    backgroundColor: day.units > 14 ? Colors.red : Colors.blue,
                  },
                ]}
              />
            </View>
            <Text style={styles.value}>{day.units}u</Text>
          </View>
        ))}
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
  statsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  date: {
    width: 50,
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
  },
  barBg: {
    flex: 1,
    height: 24,
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  value: {
    width: 40,
    textAlign: 'right',
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
