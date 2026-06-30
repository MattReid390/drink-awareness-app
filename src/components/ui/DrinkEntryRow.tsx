// Reusable drink entry row component
// Used on Daily Summary (S10) to display logged drinks

import react from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants';
import { formatTime } from '../../utils';
import { Drink } from '../../types';

interface DrinkEntryRowProps {
    drink: Drink;           // The drink to display in this row
};

export const DrinkEntryRow: React.FC<DrinkEntryRowProps> = ({ drink }) => {
    // Build the sub-label from available drink details
    const subLabelParts = [
        drink.units ? `${drink.units} units` : null,
        drink.venue,
        formatTime(drink.time),
    ].filter(Boolean);

    const subLabel = subLabelParts.join(' . ');
    
    return (
        <View style={styles.row}>
            <View style={styles.accentBar}/>
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.name}> {drink.name} </Text>
                    <Text style={styles.subLabel}> {subLabel} </Text>
                </View>
                {drink.price !== undefined && (
                    <Text style={styles.price}> £{drink.price.toFixed(2)} </Text>
                )};
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        height: Spacing.rowHeight,
        backgroundColor: Colors.white,
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.border,
    },
    accentBar: {
        width: Spacing.accentBarWidth,
        backgroundColor: Colors.blue,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontFamily: Typography.fontFamily,
        fontSize: Typography.fontSize.label,
        fontWeight: Typography.fontWeight.medium,
        color: Colors.textPrimary,
    },
    subLabel: {
        fontFamily: Typography.fontFamily,
        fontSize: Typography.fontSize.small,
        color: Colors.textAccent,
    },
    price: {
        fontFamily: Typography.fontFamily,
        fontSize: Typography.fontSize.subLabel,
        fontWeight: Typography.fontWeight.medium,
        color: Colors.textPrimary,
    },
});