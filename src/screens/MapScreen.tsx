// S05 — Map View
// Full-screen map showing nearby venue pins.
// Toggled from VenueListScreen via the app bar.
// Requires react-native-maps (already in tech stack).

import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Colors, Typography, Spacing } from '../constants';
import { Venue } from '../types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getVenues } from '../services/venues';

const DEFAULT_REGION = {
  latitude: 51.505,
  longitude: -0.09,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export const MapScreen: React.FC = () => {
  const navigation = useNavigation();

  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadVenues = async () => {
        try {
          const data = await getVenues();
          setVenues(data);
        } catch (err) {
          console.error('Failed to load venues for map:', err);
        }
      };
      loadVenues();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* App bar — semi-transparent over map */}
      <View style={styles.appBar}>
        <Text style={styles.appBarTitle}>Venues</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.toggleButton}>List</Text>
        </Pressable>
      </View>

      {/* Full-screen map */}
      <MapView style={styles.map} initialRegion={DEFAULT_REGION}>
        {venues.map((venue) =>
          venue.coordinates ? (
            <Marker
              key={venue.id}
              coordinate={venue.coordinates}
              onPress={() => setSelectedVenue(venue)}
              pinColor={selectedVenue?.id === venue.id ? Colors.navy : Colors.blue}
              title={venue.name}
            />
          ) : null
        )}
      </MapView>

      {/* Bottom sheet — shown when a venue is selected */}
      {selectedVenue && (
        <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />
          <Text style={styles.venueName}>{selectedVenue.name}</Text>
          <Text style={styles.venueType}>
            {selectedVenue.type} · {selectedVenue.distance}m away
          </Text>
          <Pressable
            style={styles.menuButton}
            onPress={() => (navigation as any).navigate('VenueDetail', { venue: selectedVenue })}
          >
            <Text style={styles.menuButtonText}>View details</Text>
          </Pressable>
        </View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: Spacing.appBar,
    backgroundColor: Colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    opacity: 0.9,
  },
  appBarTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.appBar,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
  toggleButton: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    color: Colors.white,
  },
  map: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: Spacing.bottomNav,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: Spacing.lg,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  venueName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  venueType: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.small,
    color: Colors.textAccent,
    marginBottom: Spacing.md,
  },
  menuButton: {
    backgroundColor: Colors.blue,
    borderRadius: Spacing.cardBorderRadius,
    height: Spacing.buttonHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
});
