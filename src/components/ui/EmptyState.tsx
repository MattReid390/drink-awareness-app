// Reusable empty state component
// Used on Venues (S04), Daily Summary (S10), Weekly Summary (S11), and AI Insights (S12)

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors, Typography, Spacing } from "../../constants";

interface EmptyStateProps {
  icon: string;             // Emoji or icon character
  headline: string;         // e.g. "No venues found nearby"
  ctaLabel: string;         // e.g. "Log your first drink"
  onPressCta: () => void;   // Called when the CTA is tapped
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  headline,
  ctaLabel,
  onPressCta,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.headline}>{headline}</Text>
      <Pressable style={styles.button} onPress={onPressCta}>
        <Text style={styles.buttonText}>{ctaLabel}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: Spacing.avatarBorderRadius,
    backgroundColor: Colors.surfaceGrey,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  icon: {
    fontSize: 36,
  },
  headline: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.blue,
    borderRadius: Spacing.cardBorderRadius,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  buttonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
});