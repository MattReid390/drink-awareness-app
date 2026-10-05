// S29 — Payment Methods
// Manage payment methods for subscriptions

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { useFocusEffect } from '@react-navigation/native';
import { stripeService } from '../services/stripe';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  default: boolean;
}

export const PaymentMethodsScreen: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadPaymentMethods = async () => {
        try {
          setLoading(true);
          const paymentMethods = await stripeService.getPaymentMethods();
          setMethods(paymentMethods || []);
        } catch (error) {
          console.error('Failed to load payment methods:', error);
          Alert.alert('Error', 'Failed to load payment methods');
        } finally {
          setLoading(false);
        }
      };
      loadPaymentMethods();
    }, [])
  );

  const handleSetDefault = async (methodId: string) => {
    try {
      await stripeService.updateDefaultPaymentMethod(methodId);
      const updated = methods.map((m) => ({
        ...m,
        default: m.id === methodId,
      }));
      setMethods(updated);
      Alert.alert('Success', 'Default payment method updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update default payment method');
    }
  };

  const handleRemove = (method: PaymentMethod) => {
    Alert.alert('Remove Payment Method', `Remove ${method.brand} ending in ${method.last4}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeletingId(method.id);
            await stripeService.removePaymentMethod(method.id);
            setMethods(methods.filter((m) => m.id !== method.id));
            Alert.alert('Removed', 'Payment method deleted');
          } catch (error) {
            Alert.alert('Error', 'Failed to remove payment method');
          } finally {
            setDeletingId(null);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.blue} />
      </View>
    );
  }

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <View style={[styles.methodCard, item.default && styles.defaultCard]}>
      <View style={styles.methodInfo}>
        <Text style={styles.cardBrand}>{item.brand.toUpperCase()}</Text>
        <Text style={styles.cardNumber}>•••• {item.last4}</Text>
        <Text style={styles.expiry}>
          Expires {item.expMonth}/{item.expYear % 100}
        </Text>
        {item.default && <View style={styles.defaultBadge} />}
      </View>

      <View style={styles.methodActions}>
        {!item.default && (
          <Pressable style={styles.setDefaultButton} onPress={() => handleSetDefault(item.id)}>
            <Text style={styles.buttonText}>Set Default</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.removeButton, deletingId === item.id && styles.disabled]}
          onPress={() => handleRemove(item)}
          disabled={deletingId === item.id}
        >
          <Text style={styles.removeButtonText}>{deletingId === item.id ? '...' : 'Remove'}</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ErrorBoundary>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Payment Methods</Text>
        </View>

        {methods.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No payment methods on file</Text>
            <Text style={styles.emptySubtext}>
              Add a payment method when upgrading your subscription
            </Text>
          </View>
        ) : (
          <FlatList
            data={methods}
            renderItem={renderPaymentMethod}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>🔒 Security</Text>
          <Text style={styles.infoText}>
            Your payment information is encrypted and processed securely by Stripe. We never store
            your full card details.
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
  },
  listContent: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  methodCard: {
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 12,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  defaultCard: {
    borderColor: Colors.green,
    backgroundColor: '#f0fdf4',
  },
  methodInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  cardBrand: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
  },
  cardNumber: {
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
  },
  expiry: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
  },
  defaultBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.green,
    marginTop: Spacing.xs,
  },
  methodActions: {
    gap: Spacing.xs,
    flexDirection: 'row',
  },
  setDefaultButton: {
    backgroundColor: Colors.blue,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
  },
  removeButton: {
    backgroundColor: '#ef4444',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 6,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: Typography.fontSize.small,
    fontWeight: '600',
    color: Colors.white,
  },
  removeButtonText: {
    fontSize: Typography.fontSize.small,
    fontWeight: '600',
    color: Colors.white,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    fontSize: Typography.fontSize.body,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
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
