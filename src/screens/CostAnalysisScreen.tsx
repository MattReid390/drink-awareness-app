// S17 — Cost Analysis
// Analyze spending patterns over the last 30 days

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { StatCard, EmptyState } from '../components/ui';
import { getCostAnalysis } from '../services/analytics';
import { useFocusEffect } from '@react-navigation/native';

export const CostAnalysisScreen: React.FC = () => {
  const [costData, setCostData] = useState({
    dailyData: [] as Array<{ date: string; spend: number; avgPerDrink: number }>,
    totalSpend: 0,
    avgDailySpend: 0,
    avgPerDrink: 0,
  });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await getCostAnalysis();
        setCostData(data);
        setLoading(false);
      };
      load();
    }, [])
  );

  if (loading || !costData.dailyData || costData.dailyData.length === 0) {
    return (
      <EmptyState
        icon="💳"
        headline="No spending data yet"
        ctaLabel="Log a drink with price"
        onPressCta={() => {}}
      />
    );
  }

  const weeklySpend = costData.dailyData.slice(-7).reduce((sum, d) => sum + d.spend, 0);
  const maxDailySpend = Math.max(...costData.dailyData.map((d) => d.spend));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cost Analysis</Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard label="30-DAY" value={`£${costData.totalSpend.toFixed(2)}`} subLabel="total" />
        <StatCard
          label="AVG/DAY"
          value={`£${costData.avgDailySpend.toFixed(2)}`}
          subLabel="daily"
        />
        <StatCard label="PER DRINK" value={`£${costData.avgPerDrink.toFixed(2)}`} subLabel="avg" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Last 7 Days</Text>
        {costData.dailyData.slice(-7).map((day) => (
          <View key={day.date} style={styles.row}>
            <Text style={styles.date}>{day.date}</Text>
            <View style={styles.barBg}>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${(day.spend / maxDailySpend) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.value}>£{day.spend.toFixed(0)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>This Week</Text>
          <Text style={styles.infoValue}>£{weeklySpend.toFixed(2)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Monthly Projection</Text>
          <Text style={styles.infoValue}>£{(costData.avgDailySpend * 30).toFixed(2)}</Text>
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
    backgroundColor: Colors.amber,
    borderRadius: 4,
  },
  value: {
    width: 50,
    textAlign: 'right',
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
  },
  infoValue: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.blue,
  },
});
