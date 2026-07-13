// S11 — Weekly Summary
// Overview of the current week with bar chart and day rows.
// Highest-rated feature in research (8 participants).
// Tapping a day row navigates to S10 for that date.

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { getWeeklyLog } from '../services';
import { StatCard } from '../components/ui';
import { WeeklyLog, DailyLog } from '../types';
import {
  formatUnits,
  getTodayString,
  getWeekStart,
  getWeekEnd,
  formatDateShort,
  getDayName,
} from '../utils';
import { useNavigation } from '@react-navigation/native';

export const WeeklySummaryScreen: React.FC = () => {
  const navigation = useNavigation();

  // Start date of the currently viewed week
  const [weekStart, setWeekStart] = useState(
    getWeekStart(getTodayString())
  );

  // Weekly log data
  const [weeklyLog, setWeeklyLog] = useState<WeeklyLog | null>(null);

  // Load weekly log whenever the week changes
  useEffect(() => {
    const load = async () => {
      const log = await getWeeklyLog(weekStart);
      setWeeklyLog(log);
    };
    load();
  }, [weekStart]);

  // Navigate to the previous week
  const handlePreviousWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(prev.getDate() - 7);
    setWeekStart(prev.toISOString().split('T')[0]);
  };

  // Navigate to the next week — disabled if already on current week
  const handleNextWeek = () => {
    const currentWeekStart = getWeekStart(getTodayString());
    if (weekStart < currentWeekStart) {
      const next = new Date(weekStart);
      next.setDate(next.getDate() + 7);
      setWeekStart(next.toISOString().split('T')[0]);
    }
  };

  const isCurrentWeek = weekStart === getWeekStart(getTodayString());

  // Find the max drinks in any single day for bar chart scaling
  const maxDrinks = Math.max(
    1,
    ...(weeklyLog?.days.map((d) => d.totalDrinks) ?? [0])
  );

  const renderDayRow = ({ item }: { item: DailyLog }) => {
    const isToday = item.date === getTodayString();

    return (
      <Pressable
        style={styles.dayRow}
        onPress={() =>
          navigation.navigate('Summary' as never)
        }
      >
        <View style={styles.dayInfo}>
          <Text style={[styles.dayName, isToday && styles.dayNameToday]}>
            {getDayName(item.date)}
          </Text>
          <Text style={styles.dayDate}>{formatDateShort(item.date)}</Text>
        </View>
        <View style={styles.dayStats}>
          <Text style={styles.dayDrinks}>
            {item.totalDrinks} drink{item.totalDrinks !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.dayUnits}>
            {formatUnits(item.totalUnits)} units
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Weekly Summary</Text>
      </View>

      {/* Week strip */}
      <View style={styles.weekStrip}>
        <Pressable onPress={handlePreviousWeek}>
          <Text style={styles.chevronNav}>‹</Text>
        </Pressable>
        <Text style={styles.weekLabel}>
          {weeklyLog
            ? `${formatDateShort(weeklyLog.weekStart)} — ${formatDateShort(weeklyLog.weekEnd)}`
            : '…'}
        </Text>
        <Pressable onPress={handleNextWeek} disabled={isCurrentWeek}>
          <Text
            style={[
              styles.chevronNav,
              isCurrentWeek && styles.chevronDisabled,
            ]}
          >
            ›
          </Text>
        </Pressable>
      </View>

      {/* Bar chart */}
      <View style={styles.chartArea}>
        {weeklyLog?.days.map((day) => {
          const isToday = day.date === getTodayString();
          const barHeight = Math.max(
            4,
            (day.totalDrinks / maxDrinks) * 80
          );
          return (
            <View key={day.date} style={styles.barColumn}>
              <Text style={styles.barValue}>
                {day.totalDrinks > 0 ? day.totalDrinks : ''}
              </Text>
              <View
                style={[
                  styles.bar,
                  { height: barHeight },
                  isToday && styles.barToday,
                  day.totalDrinks === 0 && styles.barEmpty,
                ]}
              />
              <Text style={styles.barLabel}>
                {getDayName(day.date)}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Stats row */}
      <View style={styles.statRow}>
        <StatCard
          label="DRINKS"
          value={String(weeklyLog?.totalDrinks ?? 0)}
          subLabel="this week"
        />
        <View style={styles.statGap} />
        <StatCard
          label="UNITS"
          value={formatUnits(weeklyLog?.totalUnits ?? 0)}
          subLabel="this week"
        />
        <View style={styles.statGap} />
        <StatCard
          label="SPENT"
          value={`£${(weeklyLog?.totalSpend ?? 0).toFixed(0)}`}
          subLabel="this week"
        />
      </View>

      {/* Days list header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>This week</Text>
      </View>

      {/* Day rows */}
      <FlatList
        data={weeklyLog?.days}
        keyExtractor={(item) => item.date}
        renderItem={renderDayRow}
      />
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
  weekStrip: {
    height: Spacing.dateStrip,
    backgroundColor: Colors.surfaceGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  weekLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.small,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  chevronNav: {
    fontSize: 24,
    color: Colors.blue,
  },
  chevronDisabled: {
    color: Colors.border,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  barColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  barValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.micro,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  bar: {
    width: 24,
    backgroundColor: Colors.blue,
    borderRadius: 4,
  },
  barToday: {
    backgroundColor: Colors.navy,
  },
  barEmpty: {
    backgroundColor: Colors.border,
  },
  barLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.micro,
    color: Colors.textAccent,
    marginTop: Spacing.xs,
  },
  statRow: {
    flexDirection: 'row',
    padding: Spacing.lg,
    backgroundColor: Colors.surfaceGrey,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  statGap: {
    width: Spacing.sm,
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
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Spacing.rowHeight,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  dayNameToday: {
    color: Colors.blue,
  },
  dayDate: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.small,
    color: Colors.textAccent,
  },
  dayStats: {
    alignItems: 'flex-end',
    marginRight: Spacing.md,
  },
  dayDrinks: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    color: Colors.textPrimary,
  },
  dayUnits: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.tiny,
    color: Colors.textAccent,
  },
  chevron: {
    fontSize: 20,
    color: Colors.border,
  },
});