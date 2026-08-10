// Reusable insight card component
// Used on Home (S03), Daily Summary (S10), and AI Insights (S12)
// Every insight must show its data basis (DAA-049) and be dismissible

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants';

interface InsightCardProps {
  text: string; // Insight body copy
  dataBasis: string; // e.g. "Based on today's log"
  onDismiss: () => void; // Called when the dismiss icon is tapped
}

export const InsightCard: React.FC<InsightCardProps> = ({ text, dataBasis, onDismiss }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}> 💡 </Text>
        <Text style={styles.label}> AI Insights </Text>
        <Text style={styles.dataBasis}> {dataBasis} </Text>
      </View>
      <Text style={styles.body}> {text} </Text>
      <Pressable onPress={onDismiss} style={styles.dismissButton}>
        <Text style={styles.dismissIcon}> X </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.lightBlue,
    borderWidth: 0.5,
    borderColor: Colors.blue,
    borderRadius: Spacing.cardBorderRadius,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  icon: {
    fontSize: Typography.fontSize.label,
    marginRight: Spacing.xs,
  },
  label: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  dataBasis: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.tiny,
    color: Colors.textAccent,
    marginLeft: 'auto',
  },
  body: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    color: Colors.textPrimary,
    lineHeight: Typography.fontSize.subLabel * Typography.lineHeight.relaxed,
  },
  dismissButton: {
    alignSelf: 'flex-end',
    marginTop: Spacing.sm,
  },
  dismissIcon: {
    fontSize: Typography.fontSize.small,
    color: Colors.textAccent,
  },
});
