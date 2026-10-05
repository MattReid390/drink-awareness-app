// S30 — Invoices
// View billing history and download invoices

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
  Linking,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { useFocusEffect } from '@react-navigation/native';
import { stripeService } from '../services/stripe';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: 'paid' | 'draft' | 'open' | 'uncollectible';
  pdfUrl?: string;
  description?: string;
}

export const InvoicesScreen: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadInvoices = async () => {
        try {
          setLoading(true);
          const items = await stripeService.getInvoices();
          setInvoices(items || []);
        } catch (error) {
          console.error('Failed to load invoices:', error);
          Alert.alert('Error', 'Failed to load invoices');
        } finally {
          setLoading(false);
        }
      };
      loadInvoices();
    }, [])
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return Colors.green;
      case 'open':
        return '#f59e0b';
      case 'draft':
        return Colors.textMuted;
      default:
        return '#ef4444';
    }
  };

  const handleDownload = async (invoice: Invoice) => {
    if (!invoice.pdfUrl) {
      Alert.alert('Not Available', 'PDF not available for this invoice');
      return;
    }

    try {
      setDownloading(invoice.id);
      await Linking.openURL(invoice.pdfUrl);
    } catch (error) {
      Alert.alert('Error', 'Failed to download invoice');
    } finally {
      setDownloading(null);
    }
  };

  const renderInvoice = ({ item }: { item: Invoice }) => (
    <Pressable
      style={styles.invoiceCard}
      onPress={() => handleDownload(item)}
      disabled={downloading === item.id}
    >
      <View style={styles.invoiceLeft}>
        <View>
          <Text style={styles.invoiceId}>Invoice {item.id}</Text>
          <Text style={styles.invoiceDate}>{new Date(item.date).toLocaleDateString()}</Text>
          {item.description && <Text style={styles.description}>{item.description}</Text>}
        </View>
      </View>

      <View style={styles.invoiceRight}>
        <Text style={styles.amount}>
          {item.currency.toUpperCase()} ${(item.amount / 100).toFixed(2)}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
        {downloading === item.id && <ActivityIndicator size="small" color={Colors.blue} />}
        {!downloading && item.pdfUrl && <Text style={styles.downloadHint}>↓</Text>}
      </View>
    </Pressable>
  );

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
          <Text style={styles.title}>Invoices</Text>
          <Text style={styles.subtitle}>Billing history</Text>
        </View>

        {invoices.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No invoices yet</Text>
            <Text style={styles.emptySubtext}>
              Invoices will appear here once you have an active subscription
            </Text>
          </View>
        ) : (
          <FlatList
            data={invoices}
            renderItem={renderInvoice}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📄 Your Invoices</Text>
          <Text style={styles.infoText}>
            Click any invoice to download a PDF copy. All invoices are sent to your email on file.
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
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
  },
  listContent: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  invoiceCard: {
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 12,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceLeft: {
    flex: 1,
    gap: Spacing.xs,
  },
  invoiceId: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
  },
  invoiceDate: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
  },
  description: {
    fontSize: Typography.fontSize.small,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  invoiceRight: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  amount: {
    fontSize: Typography.fontSize.label,
    fontWeight: '600',
    color: Colors.navy,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 4,
  },
  statusText: {
    fontSize: Typography.fontSize.small,
    fontWeight: '500',
  },
  downloadHint: {
    fontSize: Typography.fontSize.label,
    color: Colors.blue,
    fontWeight: '600',
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
