// S10 — Daily Summary
// Scannable view of all drinks logged for a single day.
// Date strip allows navigation to previous and next days.

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { getDailyLog, getDailyInsight } from '../services';
import { StatCard, InsightCard, DrinkEntryRow, EmptyState } from '../components/ui';
import { DailyLog } from '../types';
import { Insight } from '../services/insights';
import { formatUnits, getTodayString, formatDateLong, getPreviousDay, getNextDay } from '../utils';
import { useNavigation, useFocusEffect, useIsFocused, useRoute, RouteProp } from '@react-navigation/native';
import { SummaryStackParamList } from '../types';

type DailySummaryRouteProp = RouteProp<SummaryStackParamList, 'DailySummary'>;

export const DailySummaryScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<DailySummaryRouteProp>();

  // Currently viewed date — defaults to today, but can be passed from Weekly Summary
  const [date, setDate] = useState(route.params?.date ?? getTodayString());

  // Log data for the current date
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);

  // AI insight for the current date
  const [insight, setInsight] = useState<Insight | null>(null);

  // Whether the insight card has been dismissed
  const [insightDismissed, setInsightDismissed] = useState(false);

  // Reload data every time the screen comes into focus or the date changes
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const log = await getDailyLog(date);
        setDailyLog(log);
        setInsightDismissed(false);
        const todayInsight = await getDailyInsight(log);
        setInsight(todayInsight);
      };
      load();
    }, [date])
  );

  // Navigate to the previous day
  const handlePreviousDay = () => setDate(getPreviousDay(date));

  // Navigate to the next day — disabled if already on today
  const handleNextDay = () => {
    if (date < getTodayString()) setDate(getNextDay(date));
  };

  const isToday = date === getTodayString();

  return (
    <View style={styles.container}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Daily Summary</Text>
      </View>

      {/* Date strip */}
      <View style={styles.dateStrip}>
        <Pressable onPress={handlePreviousDay}>
          <Text style={styles.chevron}>‹</Text>
        </Pressable>
        <Text style={styles.dateLabel}>{formatDateLong(date)}</Text>
        <Pressable onPress={handleNextDay} disabled={isToday}>
          <Text style={[styles.chevron, isToday && styles.chevronDisabled]}>
            ›
          </Text>
        </Pressable>
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

      {/* Section divider */}
      <View style={styles.divider} />

      {/* Logged drinks header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Logged drinks</Text>
        <Text style={styles.entryCount}>
          {dailyLog?.totalDrinks ?? 0} entries
        </Text>
      </View>

      {/* Drink list or empty state */}
      {dailyLog?.drinks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="🍺"
            headline="Nothing logged today"
            ctaLabel="Log your first drink"
            onPressCta={() => navigation.navigate('Log' as never)}
          />
        </View>
      ) : (
        <FlatList
          data={dailyLog?.drinks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <DrinkEntryRow drink={item} />}
          style={styles.list}
        />
      )}

      {/* Insight card */}
      {insight && !insightDismissed && dailyLog && dailyLog.totalDrinks > 0 && (
        <View style={styles.insightContainer}>
          <InsightCard
            text={insight.text}
            dataBasis={insight.dataBasis}
            onDismiss={() => setInsightDismissed(true)}
          />
        </View>
      )}

      {/* Log another drink button */}
      <Pressable
        style={styles.logButton}
        onPress={() => navigation.navigate('Log' as never)}
      >
        <Text style={styles.logButtonText}>+ Log another drink</Text>
      </Pressable>
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
  dateStrip: {
    height: Spacing.dateStrip,
    backgroundColor: Colors.surfaceGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  dateLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  chevron: {
    fontSize: 24,
    color: Colors.blue,
  },
  chevronDisabled: {
    color: Colors.border,
  },
  statRow: {
    flexDirection: 'row',
    padding: Spacing.lg,
    backgroundColor: Colors.surfaceGrey,
  },
  statGap: {
    width: Spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  sectionHeader: {
    height: Spacing.sectionHeader,
    backgroundColor: Colors.surfaceGrey,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  entryCount: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.small,
    color: Colors.textAccent,
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  insightContainer: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
  },
  logButton: {
    backgroundColor: Colors.blue,
    borderRadius: Spacing.cardBorderRadius,
    height: Spacing.buttonHeight,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
});