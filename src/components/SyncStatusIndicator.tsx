// Sync status indicator component
// Shows sync state in app header (synced, syncing, error, offline)

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { Colors, Typography } from '../constants';
import { syncManager, SyncStatus } from '../services/sync';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export const SyncStatusIndicator: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const isOnline = useNetworkStatus();

  useEffect(() => {
    const updateStatus = async () => {
      const status = await syncManager.getStatus();
      setSyncStatus(status);

      if (status.lastSyncTime) {
        const date = new Date(status.lastSyncTime);
        const timeStr = date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
        setLastUpdate(timeStr);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRetry = async () => {
    try {
      await syncManager.performSync();
      Alert.alert('Sync', 'Data synced successfully');
    } catch (error) {
      Alert.alert('Sync Error', 'Failed to sync. Please try again.');
    }
  };

  if (!isOnline) {
    return (
      <Pressable style={styles.offline} onPress={handleRetry}>
        <Text style={styles.icon}>📡</Text>
        <Text style={styles.text}>Offline</Text>
      </Pressable>
    );
  }

  if (syncStatus?.isSyncing) {
    return (
      <View style={styles.syncing}>
        <ActivityIndicator size="small" color={Colors.blue} />
        <Text style={styles.text}>Syncing...</Text>
      </View>
    );
  }

  if (syncStatus?.error) {
    return (
      <Pressable style={styles.error} onPress={handleRetry}>
        <Text style={styles.icon}>⚠️</Text>
        <Text style={styles.text}>Sync error</Text>
      </Pressable>
    );
  }

  return (
    <Pressable style={styles.synced} onPress={handleRetry}>
      <Text style={styles.icon}>✓</Text>
      <Text style={styles.text}>{lastUpdate ? `Synced ${lastUpdate}` : 'Synced'}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  synced: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: Colors.lightBlue,
    borderRadius: 6,
  },
  syncing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: Colors.lightBlue,
    borderRadius: 6,
  },
  offline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#FFF3CD',
    borderRadius: 6,
  },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: '#F8D7DA',
    borderRadius: 6,
  },
  icon: {
    fontSize: 12,
  },
  text: {
    fontSize: Typography.fontSize.small,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
});
