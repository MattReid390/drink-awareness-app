// S07 — Drink Menu
// Scrollable drink menu for a venue.
// Items grouped by category with quick-log tap to pre-fill S08.

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  SectionList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { DrinkMenuItem } from '../types';
import { useNavigation } from '@react-navigation/native';

// Placeholder menu data — will be replaced with real data in Phase 5
const PLACEHOLDER_MENU: { title: string; data: DrinkMenuItem[] }[] = [
  {
    title: 'Beers',
    data: [
      {
        id: '1',
        venueId: '1',
        name: 'Pint of Lager',
        category: 'Beers',
        price: 5.20,
        abv: 4.0,
      },
      {
        id: '2',
        venueId: '1',
        name: 'Pint of Ale',
        category: 'Beers',
        price: 5.80,
        abv: 4.5,
      },
      {
        id: '3',
        venueId: '1',
        name: 'Bottle of Beer',
        category: 'Beers',
        price: 4.50,
        abv: 5.0,
      },
    ],
  },
  {
    title: 'Wines',
    data: [
      {
        id: '4',
        venueId: '1',
        name: 'White Wine 175ml',
        category: 'Wines',
        price: 6.50,
        abv: 12.0,
      },
      {
        id: '5',
        venueId: '1',
        name: 'Red Wine 175ml',
        category: 'Wines',
        price: 6.50,
        abv: 13.5,
      },
    ],
  },
  {
    title: 'Spirits',
    data: [
      {
        id: '6',
        venueId: '1',
        name: 'Gin & Tonic',
        category: 'Spirits',
        price: 7.00,
        abv: 37.5,
      },
      {
        id: '7',
        venueId: '1',
        name: 'Whisky & Mixer',
        category: 'Spirits',
        price: 7.50,
        abv: 40.0,
      },
    ],
  },
];

// Category filter tabs
const CATEGORIES = ['All', 'Beers', 'Wines', 'Spirits'];

export const DrinkMenuScreen: React.FC = () => {
  const navigation = useNavigation();

  // Active category tab
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter menu sections by active category
  const filteredMenu =
    activeCategory === 'All'
      ? PLACEHOLDER_MENU
      : PLACEHOLDER_MENU.filter(
          (section) => section.title === activeCategory
        );

  const renderItem = ({ item }: { item: DrinkMenuItem }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        {item.abv && (
          <Text style={styles.itemAbv}>{item.abv}% ABV</Text>
        )}
      </View>
      <Text style={styles.itemPrice}>£{item.price.toFixed(2)}</Text>

      {/* Quick-log button — pre-fills S08 with this drink */}
      <Pressable
        style={styles.logButton}
        onPress={() => navigation.navigate('Log' as never)}
      >
        <Text style={styles.logButtonText}>+</Text>
      </Pressable>
    </View>
  );

  const renderSectionHeader = ({
    section,
  }: {
    section: { title: string };
  }) => (
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
        <Text style={styles.appBarTitle}>Drink Menu</Text>
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
            style={[
              styles.tab,
              activeCategory === category && styles.tabActive,
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text
              style={[
                styles.tabText,
                activeCategory === category && styles.tabTextActive,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Menu list grouped by category */}
      <SectionList
        sections={filteredMenu}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
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
});