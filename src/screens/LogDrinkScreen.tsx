// S08 — Log Drink / Add Drink
// Primary data-entry screen.
// Only drink name and time are required fields (DAA-048).
// Quick-select pills allow one-tap logging (DAA-047).

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { saveDrink } from '../services';
import { PresetPill } from '../components/ui';
import { Drink, PresetDrink } from '../types';
import { generateId } from '../utils';
import { useNavigation } from '@react-navigation/native';

// Input validation helpers
const validatePrice = (price: string): number | undefined => {
  if (!price.trim()) return undefined;
  const parsed = parseFloat(price);
  if (isNaN(parsed)) return undefined;
  if (parsed < 0 || parsed > 1000) return undefined;
  return parsed;
};

const validateUnits = (units: string): number | undefined => {
  if (!units.trim()) return undefined;
  const parsed = parseFloat(units);
  if (isNaN(parsed)) return undefined;
  if (parsed <= 0 || parsed > 100) return undefined;
  return parsed;
};

// Default quick-select preset drinks (DAA-047)
const PRESET_DRINKS: PresetDrink[] = [
  {
    id: 'pint-lager',
    name: 'Pint of Lager',
    type: 'Beer',
    servingSize: 'Pint',
    units: 2.3,
  },
  {
    id: 'gin-tonic',
    name: 'Gin & Tonic',
    type: 'Spirit',
    servingSize: 'Single',
    units: 1.4,
  },
  {
    id: 'wine-175ml',
    name: 'Wine 175ml',
    type: 'Wine',
    servingSize: '175ml',
    units: 2.1,
  },
  {
    id: 'shot',
    name: 'Shot',
    type: 'Spirit',
    servingSize: '25ml',
    units: 1.0,
  },
  {
    id: 'bottle-beer',
    name: 'Bottle of Beer',
    type: 'Beer',
    servingSize: '330ml',
    units: 1.7,
  },
  {
    id: 'cider-pint',
    name: 'Pint of Cider',
    type: 'Cider',
    servingSize: 'Pint',
    units: 2.6,
  },
];

export const LogDrinkScreen: React.FC = () => {
  const navigation = useNavigation();

  // Required fields
  const [name, setName] = useState('');
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })
  );

  // Optional fields
  const [type, setType] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [units, setUnits] = useState('');
  const [price, setPrice] = useState('');
  const [venue, setVenue] = useState('');
  const [notes, setNotes] = useState('');

  // Loading state to prevent double-tap
  const [saving, setSaving] = useState(false);

  // Fills the form when a preset pill is tapped
  const handlePresetPress = (preset: PresetDrink) => {
    setName(preset.name);
    setType(preset.type);
    setServingSize(preset.servingSize);
    setUnits(String(preset.units));
  };

  // Saves the drink to AsyncStorage
  const handleSave = async () => {
    // Prevent double-tap
    if (saving) return;

    // Validate required fields
    if (!name.trim()) {
      Alert.alert('Drink name required', 'Please enter a drink name.');
      return;
    }

    // Validate optional numeric fields
    const validatedPrice = validatePrice(price);
    if (price && !validatedPrice) {
      Alert.alert('Invalid price', 'Price must be a number between 0 and 1000.');
      return;
    }

    const validatedUnits = validateUnits(units);
    if (units && !validatedUnits) {
      Alert.alert('Invalid units', 'Units must be a number between 0.01 and 100.');
      return;
    }

    const drink: Drink = {
      id: generateId(),
      name: name.trim(),
      time: new Date().toISOString(),
      type: type || undefined,
      servingSize: servingSize || undefined,
      units: validatedUnits,
      price: validatedPrice,
      venue: venue || undefined,
      notes: notes || undefined,
    };

    setSaving(true);
    try {
      await saveDrink(drink);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save drink. Please try again.');
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* App bar */}
      <View style={styles.appBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </Pressable>
        <Text style={styles.appBarTitle}>Log a drink</Text>
        <View style={styles.appBarSpacer} />
      </View>

      {/* Quick-select header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick select</Text>
      </View>

      {/* Quick-select pill scroll row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.pillRow}
        contentContainerStyle={styles.pillContent}
      >
        {PRESET_DRINKS.map((preset) => (
          <PresetPill key={preset.id} preset={preset} onPress={handlePresetPress} />
        ))}
      </ScrollView>

      {/* Required fields header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Drink details <Text style={styles.requiredNote}>* required</Text>
        </Text>
      </View>

      {/* Drink name — required */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>
          Drink name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="e.g. Pint of Lager"
          placeholderTextColor={Colors.textMuted}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Drink type */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Type</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="e.g. Beer, Wine, Spirit"
          placeholderTextColor={Colors.textMuted}
          value={type}
          onChangeText={setType}
        />
      </View>

      {/* Serving size and time on same row */}
      <View style={styles.fieldRow}>
        <View style={styles.fieldHalf}>
          <Text style={styles.fieldLabel}>Serving</Text>
          <TextInput
            style={styles.fieldInput}
            placeholder="e.g. Pint"
            placeholderTextColor={Colors.textMuted}
            value={servingSize}
            onChangeText={setServingSize}
          />
        </View>
        <View style={styles.fieldHalf}>
          <Text style={styles.fieldLabel}>
            Time <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.fieldInput}
            placeholder="e.g. 9:41 pm"
            placeholderTextColor={Colors.textMuted}
            value={time}
            onChangeText={setTime}
          />
        </View>
      </View>

      {/* Optional fields header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Optional details</Text>
      </View>

      {/* Price and venue on same row */}
      <View style={styles.fieldRow}>
        <View style={styles.fieldHalf}>
          <Text style={styles.fieldLabel}>Price</Text>
          <TextInput
            style={styles.fieldInput}
            placeholder="£0.00"
            placeholderTextColor={Colors.textMuted}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.fieldHalf}>
          <Text style={styles.fieldLabel}>Venue</Text>
          <TextInput
            style={styles.fieldInput}
            placeholder="Search venues…"
            placeholderTextColor={Colors.textMuted}
            value={venue}
            onChangeText={setVenue}
          />
        </View>
      </View>

      {/* Notes */}
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Notes</Text>
        <TextInput
          style={styles.fieldInput}
          placeholder="Add a note…"
          placeholderTextColor={Colors.textMuted}
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {/* Save button */}
      <Pressable
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save drink'}</Text>
      </Pressable>

      {/* Cancel link */}
      <Pressable style={styles.cancelContainer} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </ScrollView>
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
  closeButton: {
    fontSize: 18,
    color: Colors.white,
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
    width: 18,
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
  requiredNote: {
    fontWeight: Typography.fontWeight.regular,
    color: Colors.textAccent,
    fontSize: Typography.fontSize.tiny,
  },
  pillRow: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  pillContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  field: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  fieldRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  fieldHalf: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    borderRightWidth: 0.5,
    borderRightColor: Colors.border,
  },
  fieldLabel: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    width: 80,
  },
  required: {
    color: Colors.blue,
  },
  fieldInput: {
    flex: 1,
    height: 32,
    backgroundColor: Colors.surfaceGrey,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: Spacing.inputBorderRadius,
    paddingHorizontal: Spacing.sm,
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    color: Colors.textPrimary,
  },
  saveButton: {
    backgroundColor: Colors.blue,
    borderRadius: Spacing.cardBorderRadius,
    height: Spacing.buttonHeight,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
  cancelContainer: {
    height: Spacing.sectionHeader,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  cancelText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    color: Colors.textAccent,
    textDecorationLine: 'underline',
  },
});
