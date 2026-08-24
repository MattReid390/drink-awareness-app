// S07 — Drink Menu
// Scrollable drink menu for a venue.
// Items grouped by category with quick-log tap to pre-fill S08.

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  SectionList,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { Venue } from '../types';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { VenueStackParamList } from '../types';
import { getVenueDetail } from '../services/venues';

type DrinkDetailRouteProp = RouteProp<VenueStackParamList, 'DrinkDetail'>;

const CATEGORIES = ['All'];

// Placeholder venue fallback if no params provided
const PLACEHOLDER_VENUE: Venue = {
  id: '1',
  name: 'The Anchor',
  type: 'Pub',
  address: '12 High Street, London, EC1A 1BB',
};

export const DrinkMenuScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<DrinkDetailRouteProp>();
  const venueParam = route.params?.venue ?? PLACEHOLDER_VENUE;

  const [venue, setVenue] = useState<Venue | null>(venueParam);
  const [menu, setMenu] = useState<{ title: string; data: any[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useFocusEffect(
    useCallback(() => {
      const loadVenueDetail = async () => {
        setLoading(true);
        setError(null);
        try {
          const detail = await getVenueDetail(venueParam.id);
          if (detail) {
            setVenue(detail);
            const drinks = (detail as any).drinks || [];
            setMenu([
              {
                title: 'Drinks',
                data: drinks.map((d: any) => ({
                  id: String(d.id),
                  venueId: String(detail.id),
                  name: d.name,
                  category: 'Drinks',
                  price: d.price,
                  units: d.units,
                })),
              },
            ]);
          }
        } catch (err) {
          setError('Could not load drinks');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadVenueDetail();
    }, [venueParam.id])
  );

  const filteredMenu =
    activeCategory === 'All' ? menu : menu.filter((section) => section.title === activeCategory);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.units && <Text style={styles.itemAbv}>{item.units} units</Text>}
      </View>
      <Text style={styles.itemPrice}>£{item.price.toFixed(2)}</Text>

      {/* Quick-log button — pre-fills S08 with this drink */}
      <Pressable style={styles.logButton} onPress={() => navigation.navigate('Log' as never)}>
        <Text style={styles.logButtonText}>+</Text>
      </Pressable>
    </View>
  );

  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹</Text>
        </Pressable>
        <Text style={styles.appBarTitle}>{venue?.name ?? 'Drink Menu'}</Text>
        <View style={styles.appBarSpacer} />
      </View>

      {/* Category tab strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabStrip}
        contentContainerStyle={styles.tabContent}
      >
        {CATEGORIES.map((category) => (
          <Pressable
            key={category}
            style={[styles.tab, activeCategory === category && styles.tabActive]}
            onPress={() => setActiveCategory(category)}
          >
            <Text style={[styles.tabText, activeCategory === category && styles.tabTextActive]}>
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Menu list grouped by category */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.blue} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : filteredMenu.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No drinks available</Text>
        </View>
      ) : (
        <SectionList
          sections={filteredMenu}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  backButton: {
    fontSize: 28,
    color: Colors.white,
    marginRight: Spacing.md,
  },
  appBarTitle: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.appBar,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
  },
  appBarSpacer: {
    width: 28,
  },
  tabStrip: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  tabContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  tab: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.blue,
  },
  tabText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    color: Colors.textPrimary,
  },
  tabTextActive: {
    fontWeight: Typography.fontWeight.medium,
    color: Colors.blue,
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
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 72,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  itemAbv: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.small,
    color: Colors.textAccent,
  },
  itemPrice: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    marginRight: Spacing.md,
  },
  logButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logButtonText: {
    fontSize: Typography.fontSize.appBar,
    color: Colors.white,
    lineHeight: 22,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.label,
    color: Colors.textPrimary,
  },
  emptyText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.label,
    color: Colors.textAccent,
  },
});
