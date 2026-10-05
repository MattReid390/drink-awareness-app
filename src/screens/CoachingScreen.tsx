// S25 — AI Coaching Recommendations
// Premium feature: AI-powered personalized coaching

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { useFocusEffect } from '@react-navigation/native';
import { getCoaching, dismissCoaching, refreshCoaching } from '../services/premium';
import { EmptyState } from '../components/ui';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface CoachingItem {
  id: number;
  topic: string;
  recommendation: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return Colors.red;
    case 'warning':
      return Colors.orange;
    default:
      return Colors.blue;
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
      return '⚠️';
    case 'warning':
      return '⚡';
    default:
      return '💡';
  }
};

export const CoachingScreen: React.FC = () => {
  const [coaching, setCoaching] = useState<CoachingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dismissingId, setDismissingId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadCoaching = async () => {
        try {
          setLoading(true);
          const response = await getCoaching();
          if (response) {
            setCoaching(response.sessions);
          }
        } catch (error) {
          console.error('Failed to load coaching:', error);
          Alert.alert('Error', 'Failed to load coaching recommendations');
        } finally {
          setLoading(false);
        }
      };
      loadCoaching();
    }, [])
  );

  const handleDismiss = async (id: number) => {
    try {
      setDismissingId(id);
      await dismissCoaching(id);
      setCoaching(coaching.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Failed to dismiss coaching:', error);
      Alert.alert('Error', 'Failed to dismiss recommendation');
    } finally {
      setDismissingId(null);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const newCoaching = await refreshCoaching();
      if (newCoaching) {
        setCoaching([newCoaching as CoachingItem, ...coaching]);
      }
    } catch (error) {
      console.error('Failed to refresh coaching:', error);
      Alert.alert('Error', 'Failed to generate new recommendation');
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.blue} />
      </View>
    );
  }

  if (coaching.length === 0) {
    return (
      <ErrorBoundary>
        <View style={[styles.container, styles.centerContent]}>
          <EmptyState
            icon="💭"
            headline="No Active Recommendations"
            ctaLabel="Generate New"
            onPressCta={handleRefresh}
          />
        </View>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>AI Coaching</Text>
          <Text style={styles.subtitle}>
            Personalized recommendations to improve your drinking habits
          </Text>
        </View>

        {coaching.map((item) => (
          <View
            key={item.id}
            style={[styles.card, { borderLeftColor: getSeverityColor(item.severity) }]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.icon}>{getSeverityIcon(item.severity)}</Text>
              <View style={styles.cardTitle}>
                <Text style={styles.topic}>{item.topic}</Text>
                <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
              <Pressable onPress={() => handleDismiss(item.id)} disabled={dismissingId === item.id}>
                <Text style={styles.dismissButton}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.recommendation}>{item.recommendation}</Text>

            <View style={styles.cardFooter}>
              <View
                style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}
              >
                <Text style={styles.severityText}>{item.severity.toUpperCase()}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Generate New Button */}
        <Pressable
          style={[styles.button, styles.generateButton, refreshing && styles.disabledButton]}
          onPress={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? (
            <ActivityIndicator color={Colors.white} size="small" />
          ) : (
            <Text style={styles.buttonText}>Generate New Recommendation</Text>
          )}
        </Pressable>

        {/* Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>🤖 How It Works</Text>
          <Text style={styles.infoText}>
            Our AI analyzes your drinking patterns and provides personalized recommendations to help
            you develop healthier drinking habits.
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
  centerContent: {
    justifyContent: 'center',
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
    lineHeight: 20,
  },
  card: {
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  cardTitle: {
    flex: 1,
  },
  topic: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
    textTransform: 'capitalize',
  },
  date: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  dismissButton: {
    fontSize: 20,
    color: Colors.textMuted,
    padding: Spacing.xs,
  },
  recommendation: {
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  severityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
  },
  severityText: {
    fontSize: Typography.fontSize.small,
    fontWeight: '600',
    color: Colors.white,
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  generateButton: {
    backgroundColor: Colors.blue,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.white,
  },
  infoBox: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 8,
    padding: Spacing.md,
  },
  infoTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.blue,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.fontSize.small,
    color: Colors.blue,
    lineHeight: 18,
  },
});
