// Deep Link Testing Screen
// Test custom scheme and universal links

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  Share,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { deepLinkManager } from '../services/deepLink';
import { ErrorBoundary } from '../components/ErrorBoundary';

const TEST_LINKS = [
  { name: 'Log Drink', url: 'drinkawareness://log-drink' },
  { name: 'View Summary', url: 'drinkawareness://summary' },
  { name: 'View Goal', url: 'drinkawareness://goal' },
  { name: 'Premium', url: 'drinkawareness://premium' },
  { name: 'Coaching', url: 'drinkawareness://coaching' },
  { name: 'Health Integration', url: 'drinkawareness://health' },
  {
    name: 'Drink with ID',
    url: 'drinkawareness://view-drink?drinkId=123e4567-e89b-12d3-a456-426614174000',
  },
];

export const DeepLinkTestScreen: React.FC = () => {
  const [customUrl, setCustomUrl] = useState('drinkawareness://log-drink');
  const [result, setResult] = useState('');

  const testLink = (url: string) => {
    const data = deepLinkManager.parseDeepLink(url);
    const resultText = `Route: ${data.route}\nParams: ${JSON.stringify(
      data.params,
      null,
      2
    )}\nError: ${data.error || 'None'}`;
    setResult(resultText);
  };

  const shareLink = async (url: string) => {
    try {
      await Share.share({
        message: `Check this out: ${url}`,
        title: 'Share Deep Link',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share link');
    }
  };

  return (
    <ErrorBoundary>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🔗 Deep Link Tester</Text>
          <Text style={styles.subtitle}>Test custom scheme and universal links</Text>
        </View>

        {/* Preset Links */}
        <Text style={styles.sectionTitle}>Preset Links</Text>
        {TEST_LINKS.map((link, idx) => (
          <View key={idx} style={styles.linkCard}>
            <View style={styles.linkInfo}>
              <Text style={styles.linkName}>{link.name}</Text>
              <Text style={styles.linkUrl} numberOfLines={1}>
                {link.url}
              </Text>
            </View>
            <View style={styles.linkActions}>
              <Pressable style={styles.actionButton} onPress={() => testLink(link.url)}>
                <Text style={styles.actionButtonText}>Test</Text>
              </Pressable>
              <Pressable style={styles.actionButton} onPress={() => shareLink(link.url)}>
                <Text style={styles.actionButtonText}>Share</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {/* Custom URL Input */}
        <Text style={styles.sectionTitle}>Custom URL</Text>
        <TextInput
          style={styles.urlInput}
          placeholder="Enter custom URL"
          placeholderTextColor={Colors.textMuted}
          value={customUrl}
          onChangeText={setCustomUrl}
        />
        <View style={styles.customActions}>
          <Pressable style={[styles.button, styles.testButton]} onPress={() => testLink(customUrl)}>
            <Text style={styles.buttonText}>Test Custom URL</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.shareButton]}
            onPress={() => shareLink(customUrl)}
          >
            <Text style={styles.buttonText}>Share</Text>
          </Pressable>
        </View>

        {/* Result */}
        {result && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Result</Text>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        )}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Custom Scheme</Text>
          <Text style={styles.infoText}>
            Test links with drinkawareness:// scheme. Use share button to test via SMS, email, etc.
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Universal Links</Text>
          <Text style={styles.infoText}>
            Production links use https://drinkaware.app/. Requires HTTPS certificate and
            apple-app-site-association / assetlinks.json setup.
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Routes Available</Text>
          <Text style={styles.infoText}>
            • drinkawareness://log-drink {'\n'}• drinkawareness://summary {'\n'}•
            drinkawareness://goal {'\n'}• drinkawareness://premium {'\n'}• drinkawareness://coaching{' '}
            {'\n'}• drinkawareness://health {'\n'}• drinkawareness://view-drink?drinkId=ID
          </Text>
        </View>
      </ScrollView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.heading,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.body,
    color: Colors.textMuted,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  linkInfo: {
    flex: 1,
  },
  linkName: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.navy,
    marginBottom: Spacing.xs,
  },
  linkUrl: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
  },
  linkActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    backgroundColor: Colors.lightBlue,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.small,
    color: Colors.blue,
    fontWeight: '600',
  },
  urlInput: {
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 8,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  customActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: Colors.blue,
  },
  shareButton: {
    backgroundColor: Colors.green,
  },
  buttonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.white,
  },
  resultBox: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  resultTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.blue,
    marginBottom: Spacing.sm,
  },
  resultText: {
    fontSize: Typography.fontSize.small,
    color: Colors.blue,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  infoTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.fontSize.small,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
});
