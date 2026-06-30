// Reusable stat card component
// Used on Home (S03), Daily Summary (S10), and Weekly Summary (S11)

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors, Typography, Spacing } from '../../constants';

interface StatCardProps {
    label: string;          // e.g. "DRINKS", "UNITS", "SPENT"
    value: string;          // e.g. "4", "6.2", "£18"
    subLabel: string;      // e.g. "today", "of 14 weekly left"
};

export const StatCard: React.FC<StatCardProps> = ({ label, value, subLabel }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.label}> {label} </Text>
            <Text style={styles.value}> {value} </Text>
            <Text style={styles.subLabel}> {subLabel} </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: Colors.surfaceGrey,
        borderWidth: 0.5,
        borderColor: Colors.border,
        borderRadius: Spacing.cardBorderRadius,
        paddingVertical: Spacing.cardPaddingVertical,
        paddingHorizontal: Spacing.cardPaddingHorizontal,
    },
    label: {
        fontFamily: Typography.fontFamily,
        fontSize: Typography.fontSize.tiny,
        fontWeight: Typography.fontWeight.medium,
        color: Colors.textAccent,
        marginBottom: Spacing.xs,
    },
    value: {
        fontFamily: Typography.fontFamily,
        fontSize: Typography.fontSize.heading,
        fontWeight: Typography.fontWeight.medium,
        color: Colors.textPrimary,
        lineHeight: Typography.fontSize.heading * Typography.lineHeight.tight,
    },
    subLabel: {
        fontFamily: Typography.fontFamily,
        fontSize: Typography.fontSize.tiny,
        color: Colors.textAccent,
        marginTop: Spacing.xs,
    },
});