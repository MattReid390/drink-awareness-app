// S04 — Venue List / Search
// Browsable and searchable list of pubs and bars.
// Supports text search and filter pills.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { EmptyState } from '../components/ui';
import { Venue } from '../types';
import { useNavigation } from '@react-navigation/native';

// Filter categories for the pill strip
const FILTERS = ['All', 'Pub', 'Bar', 'Cocktail Bar', 'Beer Garden'];

// Placeholder venue data — will be replaced with real data in Phase 5
const PLACEHOLDER_VENUES: Venue[] = [
  {
    id: '1',
    name: 'The Anchor',
    type: 'Pub',
    address: '12 High Street',
    distance: 320,
  },
  {
    id: '2',
    name: 'The Crown',
    type: 'Pub',
    address: '45 Market Square',
    distance: 650,
  },
  {
    id: '3',
    name: 'Neon Bar',
    type: 'Bar',
    address: '8 Canal Street',
    distance: 900,
  },
];

export const VenueListScreen: React.FC = () => {
  const navigation = useNavigation();

  // Current search query
  const [query, setQuery] = useState('');

  // Active filter pill
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter venues by search query and active filter
  const filteredVenues = PLACEHOLDER_VENUES.filter((venue) => {
    const matchesQuery = venue.name
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesFilter =
      activeFilter === 'All' || venue.type === activeFilter;
    return matchesQuery && matchesFilter;
  });

  const renderVenue = ({ item }: { item: Venue }) => (
    <Pressable
      style={styles.venueCard}
      onPress={() => navigation.navigate('Venues' as never)}
    >
      <View style={styles.venueThumbnail} />
      <View style={styles.venueInfo}>
        <Text style={styles.venueName}>{item.name}</Text>
        <Text style={styles.venueType}>{item.type}</Text>
        {item.distance && (
          <Text style={styles.venueDistance}>
            {item.distance}m away
          </Text>
        )}
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Venues</Text>
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
            style={[
              styles.filterPill,
              activeFilter === filter && styles.filterPillActive,
            ]}
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
      {filteredVenues.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="📍"
            headline="No venues found nearby"
            ctaLabel="Try a different search"
            onPressCta={() => setQuery('')}
          />
        </View>
      ) : (
        <FlatList
          data={filteredVenues}
          keyExtractor={(item) => item.id}
          renderItem={renderVenue}
        />
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
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  appBarTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.appBar,
    fontWeight: Typography.fontWeight.medium,
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