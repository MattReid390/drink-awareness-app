// Reusable preset pill component
// Used on Log Drink (S08) for quick-select drinks (DAA-047)

import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants';
import { PresetDrink } from '../../types';

interface PresetPillProps {
    preset: PresetDrink                         // The preset drink to display
    onPress: (preset: PresetDrink) => void;     // Called when the pill is tapped
};

export const PresetPill: React.FC<PresetPillProps> = ({ preset, onPress }) => {
    return (
        <Pressable style={styles.pill} onPress={() => onPress(preset)}>
            <Text style={styles.name}> {preset.name} </Text>
            <Text style={styles.units}> {preset.units} </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create ({
    pill: {
        backgroundColor: Colors.lightBlue,
        borderWidth: 0.5,
        borderColor: Colors.blue,
        borderRadius: Spacing.pillBorderRadius,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        marginRight: Spacing.sm,
    },
    name: {
        fontFamily: Typography.fontFamily,
        fontSize: Typography.fontSize.small,
        fontWeight: Typography.fontWeight.medium,
        color: Colors.textPrimary,
    },
    units: {
        fontFamily: Typography.fontFamily,
        fontSize: Typography.fontSize.tiny,
        color: Colors.textAccent,
    },
});