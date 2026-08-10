// S02 - Age Confirmation / Disclaimer
// Shown once on first launch. Confirms user is 18+
// Not medical advice - friendly, calm tone throughout

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { saveAgeConfirmed } from '../services';

interface AgeConfirmationScreenProps {
  onConfirmed: () => void; // Called once age is confirmed
}

export const AgeConfirmationScreen: React.FC<AgeConfirmationScreenProps> = ({ onConfirmed }) => {
  const handleConfirm = async () => {
    await saveAgeConfirmed();
    onConfirmed();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>You must be 18 or over to use this app.</Text>
      <Text style={styles.body}>
        Drink Aware helps you keep track of what you drink, at your own pace. It is not medical
        advice - just a helpful tool.
      </Text>
      <Pressable style={styles.confirmButton} onPress={handleConfirm}>
        <Text style={styles.confirmButtonText}>I am 18 or over - continue</Text>
      </Pressable>
      <Text style={styles.footnote}>
        By continuing you confirm you are aged 18 or over. This app does not provide medical advice.
        If you are concerned about your drinking, please speak to your GP.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  headline: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.heading,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  body: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.body,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: Typography.fontSize.body * Typography.lineHeight.relaxed,
    marginBottom: Spacing.xl,
  },
  confirmButton: {
    backgroundColor: Colors.blue,
    borderRadius: Spacing.cardBorderRadius,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.subLabel,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.white,
  },
  footnote: {
    fontFamily: Typography.fontFamily,
    fontSize: Typography.fontSize.small,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
});
