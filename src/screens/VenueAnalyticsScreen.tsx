// S18 — Venue Analytics
// Analyze which venues are visited most often

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { EmptyState } from '../components/ui';
import { getVenueFrequency } from '../services/analytics';
import { useFocusEffect } from '@react-navigation/native';

export const VenueAnalyticsScreen: React.FC = () => {
  const [venueData, setVenueData] = useState<
    Array<{ venue: string; count: number; avgSpendPerVisit: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const data = await getVenueFrequency();
        setVenueData(data);
        setLoading(false);
      };
      load();
    }, [])
  );

  if (loading || !venueData || venueData.length === 0) {
    return (
      <EmptyState
        icon="📍"
        headline="No venue data yet"
        ctaLabel="Log drinks with venues"
        onPressCta={() => {}}
      />
    );
  }

  const totalVisits = venueData.reduce((sum, v) => sum + v.count, 0);
  const topVenue = venueData[0];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Venue Analytics</Text>
      </View>

      <View style={styles.topVenueCard}>
        <Text style={styles.topVenueLabel}>Most Visited</Text>
        <Text style={styles.topVenueName}>{topVenue.venue}</Text>
        <View style={styles.topVenueStats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{topVenue.count}</Text>
            <Text style={styles.statLabel}>visits</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {((topVenue.count / totalVisits) * 100).toFixed(0)}%
            </Text>
            <Text style={styles.statLabel}>of total</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Venues</Text>
        <FlatList
          scrollEnabled={false}
          data={venueData}
          renderItem={({ item, index }) => (
            <View key={item.venue} style={styles.venueRow}>
              <View style={styles.venueInfo}>
                <Text style={styles.rank}>#{index + 1}</Text>
                <View style={styles.venueDetails}>
                  <Text style={styles.venueName}>{item.venue}</Text>
                  <Text style={styles.venueStats}>
                    {item.count} {item.count === 1 ? 'visit' : 'visits'}
                  </Text>
                </View>
              </View>
              <Text style={styles.percentage}>
                {((item.count / totalVisits) * 100).toFixed(0)}%
              </Text>
            </View>
          )}
          keyExtractor={(item) => item.venue}
        />
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
  topVenueCard: {
    backgroundColor: Colors.blue,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  topVenueLabel: {
    fontSize: Typography.fontSize.small,
    color: Colors.textLight,
    marginBottom: Spacing.xs,
  },
  topVenueName: {
    fontSize: 24,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
    marginBottom: Spacing.md,
  },
  topVenueStats: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
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
  venueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  venueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rank: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.blue,
    marginRight: Spacing.md,
    width: 30,
  },
  venueDetails: {
    flex: 1,
  },
  venueName: {
    fontSize: Typography.fontSize.body,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  venueStats: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
  },
  percentage: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    minWidth: 40,
    textAlign: 'right',
  },
});
