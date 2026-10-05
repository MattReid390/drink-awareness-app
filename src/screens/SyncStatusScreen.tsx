// S19 — Sync Status
// Display cloud sync progress and status

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { EmptyState } from '../components/ui';
import { syncManager, SyncStatus } from '../services/sync';
import { isAuthenticated } from '../services/auth';
import { useFocusEffect } from '@react-navigation/native';

export const SyncStatusScreen: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isSyncing: false,
    syncedDrinks: 0,
    totalDrinks: 0,
  });
  const [isAuthenticated_, setIsAuthenticated] = useState(false);
  const [isSyncingNow, setIsSyncingNow] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const authed = await isAuthenticated();
        setIsAuthenticated(authed);

        const status = await syncManager.getStatus();
        setSyncStatus(status);
      };
      load();
    }, [])
  );

  const handleSync = async () => {
    if (!isAuthenticated_) return;

    setIsSyncingNow(true);
    try {
      await syncManager.performSync();
      const status = await syncManager.getStatus();
      setSyncStatus(status);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncingNow(false);
    }
  };

  if (!isAuthenticated_) {
    return (
      <EmptyState
        icon="🔐"
        headline="Log in to sync"
        ctaLabel="Go to Settings"
        onPressCta={() => {}}
      />
    );
  }

  const progressPercent =
    syncStatus.totalDrinks > 0 ? (syncStatus.syncedDrinks / syncStatus.totalDrinks) * 100 : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sync Status</Text>
      </View>

      <View style={styles.statusCard}>
        {syncStatus.isSyncing || isSyncingNow ? (
          <>
            <ActivityIndicator size="large" color={Colors.blue} style={styles.spinner} />
            <Text style={styles.syncingText}>Syncing data...</Text>
          </>
        ) : (
          <>
            <Text style={styles.statusLabel}>
              {syncStatus.error ? '⚠ Sync Failed' : '✓ Last Sync'}
            </Text>
            <Text style={styles.lastSync}>
              {syncStatus.lastSyncTime
                ? new Date(syncStatus.lastSyncTime).toLocaleString()
                : 'Never synced'}
            </Text>
          </>
        )}
      </View>

      {syncStatus.error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{syncStatus.error}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Status</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Drinks Synced</Text>
          <Text style={styles.statValue}>{syncStatus.syncedDrinks}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Local</Text>
          <Text style={styles.statValue}>{syncStatus.totalDrinks}</Text>
        </View>
      </View>

      {syncStatus.totalDrinks > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progressPercent)}% complete</Text>
        </View>
      )}

      <View style={styles.section}>
        <Pressable
          style={[styles.syncButton, isSyncingNow && styles.syncButtonDisabled]}
          onPress={handleSync}
          disabled={isSyncingNow || syncStatus.isSyncing}
        >
          <Text style={styles.syncButtonText}>{isSyncingNow ? 'Syncing...' : 'Sync Now'}</Text>
        </Pressable>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>ℹ About Sync</Text>
        <Text style={styles.infoText}>
          Syncing uploads your drink logs to the cloud and downloads any changes made on other
          devices. Sync happens automatically when you log in.
        </Text>
        <Text style={[styles.infoText, { marginTop: Spacing.md }]}>
          Your data is encrypted and only accessible with your account.
        </Text>
      </View>
    </ScrollView>
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
  statusCard: {
    backgroundColor: Colors.lightBlue,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  spinner: {
    marginBottom: Spacing.md,
  },
  syncingText: {
    fontSize: Typography.fontSize.body,
    color: Colors.blue,
    fontWeight: '600',
  },
  statusLabel: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  lastSync: {
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  errorCard: {
    backgroundColor: Colors.errorBg,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  errorText: {
    fontSize: Typography.fontSize.body,
    color: Colors.red,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
    marginBottom: Spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statLabel: {
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
  },
  statValue: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.blue,
  },
  progressBar: {
    height: 12,
    backgroundColor: Colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.green,
    borderRadius: 6,
  },
  progressText: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
  },
  syncButton: {
    backgroundColor: Colors.blue,
    borderRadius: 8,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  syncButtonDisabled: {
    opacity: 0.5,
  },
  syncButtonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.white,
  },
  infoSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  infoLabel: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
    marginBottom: Spacing.md,
  },
  infoText: {
    fontSize: Typography.fontSize.small,
    color: Colors.textMuted,
    lineHeight: 18,
  },
});
