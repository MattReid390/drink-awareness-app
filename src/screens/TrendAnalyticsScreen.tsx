// S15 — 30-Day Trend Analytics
// Visualize drinking patterns over the last 30 days

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { StatCard, EmptyState } from '../components/ui';
import { get30DayTrend } from '../services/analytics';
import { useFocusEffect } from '@react-navigation/native';

export const TrendAnalyticsScreen: React.FC = () => {
  const [trendData, setTrendData] = useState<
    Array<{ date: string; units: number; drinks: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await get30DayTrend();
        setTrendData(data);
        setLoading(false);
      };
      load();
    }, [])
  );

  if (loading || !trendData || trendData.length === 0) {
    return (
      <EmptyState
        icon="📊"
        headline="No drinking data yet"
        ctaLabel="Log your first drink"
        onPressCta={() => {}}
      />
    );
  }

  const totalUnits = trendData.reduce((sum, d) => sum + d.units, 0);
  const avgUnits = (totalUnits / 30).toFixed(1);
  const maxUnits = Math.max(...trendData.map((d) => d.units));

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
