// S04 — Venue List / Search
// Browsable and searchable list of pubs and bars.
// Supports text search and filter pills.

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { EmptyState } from '../components/ui';
import { Venue } from '../types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getVenues } from '../services/venues';

const FILTERS = ['All', 'Pub', 'Bar', 'Cocktail Bar', 'Beer Garden', 'Wine Bar'];

export const VenueListScreen: React.FC = () => {
  const navigation = useNavigation();

  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useFocusEffect(
    useCallback(() => {
      const loadVenues = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await getVenues();
          setVenues(data);
        } catch (err) {
          setError('Could not load venues');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadVenues();
    }, [])
  );

  const filteredVenues = venues.filter((venue) => {
    const matchesQuery = venue.name.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === 'All' || venue.type === activeFilter;
    return matchesQuery && matchesFilter;
  });

  const renderVenue = ({ item }: { item: Venue }) => (
    <Pressable
      style={styles.venueCard}
      onPress={() => (navigation as any).navigate('VenueDetail', { venue: item })}
    >
      <View style={styles.venueThumbnail} />
      <View style={styles.venueInfo}>
        <Text style={styles.venueName}>{item.name}</Text>
        <Text style={styles.venueType}>{item.type}</Text>
        {item.distance && <Text style={styles.venueDistance}>{item.distance}m away</Text>}
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Venues</Text>
        <Pressable onPress={() => navigation.navigate('MapView' as never)}>
          <Text style={styles.mapToggle}>Map</Text>
        </Pressable>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search venues…"
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Filter pill strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterStrip}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((filter) => (
          <Pressable
            key={filter}
            style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterPillText,
                activeFilter === filter && styles.filterPillTextActive,
              ]}
            >
              {filter}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Venue list */}
      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.blue} />
        </View>
      ) : error ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="⚠️"
            headline="Could not load venues"
            ctaLabel="Try again"
            onPressCta={() => {
              setLoading(true);
              setError(null);
            }}
          />
        </View>
      ) : filteredVenues.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="📍"
            headline="No venues found"
            ctaLabel="Clear search"
            onPressCta={() => setQuery('')}
          />
        </View>
      ) : (
        <FlatList data={filteredVenues} keyExtractor={(item) => item.id} renderItem={renderVenue} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  appBarTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.appBar,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
  mapToggle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    color: Colors.white,
  },
  searchContainer: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
  },
  searchInput: {
    height: 44,
    backgroundColor: Colors.surfaceGrey,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: Spacing.cardBorderRadius,
    paddingHorizontal: Spacing.md,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.label,
    color: Colors.textPrimary,
  },
  filterStrip: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  filterContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterPill: {
    backgroundColor: Colors.surfaceGrey,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  filterPillActive: {
    backgroundColor: Colors.blue,
    borderColor: Colors.blue,
  },
  filterPillText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.small,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  filterPillTextActive: {
    color: Colors.white,
  },
  venueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 88,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  venueThumbnail: {
    width: 56,
    height: 56,
    borderRadius: 6,
    backgroundColor: Colors.surfaceGrey,
    marginRight: Spacing.md,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  venueType: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.small,
    color: Colors.textAccent,
  },
  venueDistance: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.small,
    color: Colors.textAccent,
  },
  chevron: {
    fontSize: 20,
    color: Colors.border,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});
