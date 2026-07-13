// S06 — Venue Details
// Full detail view for a single venue.
// Shows hero image, name, address, hours, and links to drink menu.

import React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { Venue } from '../types';

// Placeholder venue — will be replaced with nav params in Phase 5
const PLACEHOLDER_VENUE: Venue = {
  id: '1',
  name: 'The Anchor',
  type: 'Pub',
  address: '12 High Street, London, EC1A 1BB',
  phone: '020 7123 4567',
  hours: {
    monday: '11:00 - 23:00',
    tuesday: '11:00 - 23:00',
    wednesday: '11:00 - 23:00',
    thursday: '11:00 - 23:00',
    friday: '11:00 - 00:00',
    saturday: '11:00 - 00:00',
    sunday: '12:00 - 22:30',
  },
};

export const VenueDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const venue = PLACEHOLDER_VENUE;

  return (
    <ScrollView style={styles.container}>
      {/* Hero image placeholder */}
      <View style={styles.heroImage} />

      {/* App bar — overlaid on hero image */}
      <View style={styles.appBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹</Text>
        </Pressable>
      </View>

      {/* Venue name strip */}
      <View style={styles.nameStrip}>
        <Text style={styles.venueName}>{venue.name}</Text>
        <Text style={styles.venueType}>{venue.type}</Text>
      </View>

      {/* Detail rows */}
      <View style={styles.detailCard}>
        {/* Address row */}
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📍</Text>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{venue.address}</Text>
          </View>
        </View>

        {/* Hours row */}
        {venue.hours && (
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>🕐</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Today's hours</Text>
              <Text style={styles.detailValue}>
                {venue.hours.monday}
              </Text>
            </View>
          </View>
        )}

        {/* Phone row */}
        {venue.phone && (
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📞</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{venue.phone}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Primary action — view drink menu */}
      <Pressable
        style={styles.primaryButton}
        onPress={() => navigation.navigate('DrinkMenu' as never)}
      >
        <Text style={styles.primaryButtonText}>View drink menu</Text>
      </Pressable>

      {/* Secondary action — log drink here */}
      <Pressable
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Log' as never)}
      >
        <Text style={styles.secondaryButtonText}>Log a drink here</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  heroImage: {
    height: 220,
    backgroundColor: Colors.surfaceGrey,
  },
  appBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Spacing.appBar + Spacing.statusBar,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    fontSize: 28,
    color: Colors.white,
  },
  nameStrip: {
    backgroundColor: Colors.navy,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  venueName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.appBar,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
  venueType: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.small,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  detailCard: {
    backgroundColor: Colors.white,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: Spacing.md,
  },
  detailContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    color: Colors.textAccent,
  },
  detailValue: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  primaryButton: {
    backgroundColor: Colors.blue,
    borderRadius: Spacing.cardBorderRadius,
    height: Spacing.buttonHeight,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
  secondaryButton: {
    borderWidth: 0.5,
    borderColor: Colors.blue,
    borderRadius: Spacing.cardBorderRadius,
    height: Spacing.buttonHeight,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.blue,
  },
});