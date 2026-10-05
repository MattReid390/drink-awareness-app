// S24 — Premium & Subscription
// Manage subscription and access premium features

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
import {
  getSubscription,
  upgradeToPremium,
  cancelSubscription,
  Subscription,
} from '../services/premium';
import { ErrorBoundary } from '../components/ErrorBoundary';

const PLANS = {
  free: {
    name: 'Free',
    price: '$0',
    features: [
      'Basic drink logging',
      'Daily/weekly summaries',
      'Local data storage',
      'Email support',
    ],
  },
  premium: {
    name: 'Premium',
    price: '$9.99/month',
    features: [
      'Everything in Free',
      'Cloud sync across devices',
      'AI coaching recommendations',
      'Advanced analytics',
      'Health integration',
      'Priority support',
    ],
  },
  premium_plus: {
    name: 'Premium Plus',
    price: '$19.99/month',
    features: [
      'Everything in Premium',
      'Apple Health / Google Fit sync',
      'Weekly AI insights',
      'Export to PDF/CSV',
      'Yearly analytics reports',
      '24/7 VIP support',
    ],
  },
};

export const PremiumScreen: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<keyof typeof PLANS>('free');

  useFocusEffect(
    useCallback(() => {
      const loadSubscription = async () => {
        try {
          setLoading(true);
          const sub = await getSubscription();
          if (sub) {
            setSubscription(sub);
            setCurrentPlan(sub.plan);
          }
        } catch (error) {
          console.error('Failed to load subscription:', error);
        } finally {
          setLoading(false);
        }
      };
      loadSubscription();
    }, [])
  );

  const handleUpgrade = async (plan: 'premium' | 'premium_plus') => {
    Alert.alert(
      `Upgrade to ${PLANS[plan].name}`,
      `${PLANS[plan].price}\n\nYou can cancel anytime.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upgrade',
          onPress: async () => {
            try {
              setUpgrading(true);
              await upgradeToPremium(plan);
              setCurrentPlan(plan);
              Alert.alert('Success', `Upgraded to ${PLANS[plan].name}!`);
            } catch (error) {
              Alert.alert('Error', 'Failed to upgrade. Please try again.');
            } finally {
              setUpgrading(false);
            }
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Subscription',
      'Your subscription will remain active until the current period ends.',
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Cancel Subscription',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelSubscription();
              setCurrentPlan('free');
              Alert.alert('Canceled', 'Your subscription has been canceled.');
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel subscription.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.blue} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Premium</Text>
          {subscription?.isPremium && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✓ {PLANS[currentPlan].name}</Text>
            </View>
          )}
        </View>

        {/* Current Plan */}
        {subscription && (
          <View style={styles.currentPlanCard}>
            <Text style={styles.planName}>{PLANS[currentPlan].name}</Text>
            <Text style={styles.planPrice}>{PLANS[currentPlan].price}</Text>
            <Text style={styles.planStatus}>
              {currentPlan === 'free'
                ? 'Get more features with Premium'
                : `Active until ${new Date(subscription.currentPeriodEnd || '').toLocaleDateString()}`}
            </Text>
          </View>
        )}

        {/* Plans Comparison */}
        <View style={styles.plansContainer}>
          {Object.entries(PLANS).map(([planKey, plan]) => (
            <View
              key={planKey}
              style={[styles.planCard, currentPlan === planKey && styles.activePlanCard]}
            >
              <Text style={styles.cardTitle}>{plan.name}</Text>
              <Text style={styles.price}>{plan.price}</Text>

              <View style={styles.featuresList}>
                {plan.features.map((feature, idx) => (
                  <View key={idx} style={styles.featureItem}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {currentPlan === planKey ? (
                <Pressable
                  style={[styles.button, styles.currentButton]}
                  onPress={handleCancel}
                  disabled={currentPlan === 'free'}
                >
                  <Text style={styles.buttonText}>
                    {currentPlan === 'free' ? 'Current Plan' : 'Cancel'}
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[styles.button, styles.upgradeButton]}
                  onPress={() => handleUpgrade(planKey as 'premium' | 'premium_plus')}
                  disabled={upgrading}
                >
                  <Text style={styles.buttonText}>{upgrading ? 'Upgrading...' : 'Upgrade'}</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>

        {/* Features Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Premium Features</Text>
          <Text style={styles.infoText}>• Cloud synchronization across all devices</Text>
          <Text style={styles.infoText}>• AI-powered coaching recommendations</Text>
          <Text style={styles.infoText}>• Advanced analytics and insights</Text>
          <Text style={styles.infoText}>• Health app integration</Text>
          <Text style={styles.infoText}>• Data export and reports</Text>
        </View>

        {/* Billing Info */}
        <View style={styles.billingBox}>
          <Text style={styles.billingTitle}>💳 Billing</Text>
          <Text style={styles.billingText}>
            Secure payments via Stripe. You can cancel anytime, no questions asked.
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
  badge: {
    backgroundColor: Colors.green,
    borderRadius: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: Typography.fontSize.small,
    fontWeight: '600',
    color: Colors.white,
  },
  currentPlanCard: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.blue,
  },
  planName: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.blue,
  },
  planPrice: {
    fontSize: Typography.fontSize.heading,
    fontWeight: '600',
    color: Colors.navy,
    marginVertical: Spacing.sm,
  },
  planStatus: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
  },
  plansContainer: {
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  planCard: {
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activePlanCard: {
    borderColor: Colors.blue,
    backgroundColor: Colors.lightBlue,
  },
  cardTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
    marginBottom: Spacing.sm,
  },
  price: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.blue,
    marginBottom: Spacing.md,
  },
  featuresList: {
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  checkmark: {
    fontSize: Typography.fontSize.body,
    color: Colors.green,
    fontWeight: '600',
  },
  featureText: {
    fontSize: Typography.fontSize.small,
    color: Colors.textPrimary,
    flex: 1,
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeButton: {
    backgroundColor: Colors.blue,
  },
  currentButton: {
    backgroundColor: Colors.border,
  },
  buttonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.white,
  },
  infoBox: {
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  infoTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
    marginBottom: Spacing.md,
  },
  infoText: {
    fontSize: Typography.fontSize.small,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  billingBox: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 8,
    padding: Spacing.md,
  },
  billingTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.blue,
    marginBottom: Spacing.sm,
  },
  billingText: {
    fontSize: Typography.fontSize.small,
    color: Colors.blue,
    lineHeight: 18,
  },
});
