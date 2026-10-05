// Cloud sync service for data persistence
// Handles uploading/downloading user data to/from backend API

import { api } from './api';
import { getAllDrinks, saveDrink } from './storage';
import { Drink } from '../types';
import { isAuthenticated } from './auth';

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime?: string;
  syncedDrinks: number;
  totalDrinks: number;
  error?: string;
}

export interface SyncConflict {
  drinkId: string;
  localVersion: Drink;
  remoteVersion: Drink;
}

class SyncManager {
  private isSyncing = false;
  private syncStatus: SyncStatus = {
    isSyncing: false,
    syncedDrinks: 0,
    totalDrinks: 0,
  };

  async getStatus(): Promise<SyncStatus> {
    return this.syncStatus;
  }

  async performSync(): Promise<void> {
    if (this.isSyncing) return;
    if (!(await isAuthenticated())) {
      throw new Error('Not authenticated. Please log in to sync.');
    }

    this.isSyncing = true;
    this.syncStatus.isSyncing = true;
    this.syncStatus.error = undefined;

    try {
      // Download remote data first (pull)
      await this.pullRemoteData();

      // Upload local data (push)
      await this.pushLocalData();

      // Update sync timestamp
      this.syncStatus.lastSyncTime = new Date().toISOString();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sync failed';
      this.syncStatus.error = message;
      console.error('Sync failed:', error);
      throw error;
    } finally {
      this.isSyncing = false;
      this.syncStatus.isSyncing = false;
    }
  }

  private async pullRemoteData(): Promise<void> {
    try {
      const remoteData = await api.get<{ drinks: Drink[] }>('/api/sync/drinks');

      if (!remoteData.drinks) return;

      const localDrinks = await getAllDrinks();
      const conflicts = this.detectConflicts(localDrinks, remoteData.drinks);

      // Resolve conflicts (last-write-wins strategy)
      for (const conflict of conflicts) {
        const remoteTime = new Date(conflict.remoteVersion.time).getTime();
        const localTime = new Date(conflict.localVersion.time).getTime();

        if (remoteTime > localTime) {
          // Remote is newer, update local
          await saveDrink(conflict.remoteVersion);
        }
        // Otherwise keep local version
      }

      // Add new remote drinks that don't exist locally
      for (const remoteDrink of remoteData.drinks) {
        const existsLocally = localDrinks.some((d) => d.id === remoteDrink.id);
        if (!existsLocally) {
          await saveDrink(remoteDrink);
        }
      }

      this.syncStatus.totalDrinks = remoteData.drinks.length;
    } catch (error) {
      console.error('Failed to pull remote data:', error);
      throw new Error('Failed to download data from server');
    }
  }

  private async pushLocalData(): Promise<void> {
    try {
      const localDrinks = await getAllDrinks();
      this.syncStatus.totalDrinks = localDrinks.length;

      // Send all local drinks to backend (backend deduplicates by ID)
      await api.post('/api/sync/drinks', { drinks: localDrinks });

      this.syncStatus.syncedDrinks = localDrinks.length;
    } catch (error) {
      console.error('Failed to push local data:', error);
      throw new Error('Failed to upload data to server');
    }
  }

  private detectConflicts(local: Drink[], remote: Drink[]): SyncConflict[] {
    const conflicts: SyncConflict[] = [];
    const remoteMap = new Map(remote.map((d) => [d.id, d]));

    for (const localDrink of local) {
      const remoteDrink = remoteMap.get(localDrink.id);
      if (remoteDrink) {
        // Both have the drink - check if they differ
        if (JSON.stringify(localDrink) !== JSON.stringify(remoteDrink)) {
          conflicts.push({
            drinkId: localDrink.id,
            localVersion: localDrink,
            remoteVersion: remoteDrink,
          });
        }
      }
    }

    return conflicts;
  }

  async uploadUserPreferences(preferences: {
    weeklyUnitGoal?: number;
    currency?: string;
  }): Promise<void> {
    if (!(await isAuthenticated())) {
      throw new Error('Not authenticated');
    }

    try {
      await api.post('/api/sync/preferences', preferences);
    } catch (error) {
      console.error('Failed to upload preferences:', error);
      throw new Error('Failed to sync preferences');
    }
  }

  async downloadUserPreferences(): Promise<{
    weeklyUnitGoal?: number;
    currency?: string;
  }> {
    if (!(await isAuthenticated())) {
      throw new Error('Not authenticated');
    }

    try {
      const prefs = await api.get<{
        weeklyUnitGoal?: number;
        currency?: string;
      }>('/api/sync/preferences');
      return prefs;
    } catch (error) {
      console.error('Failed to download preferences:', error);
      return {};
    }
  }
}

export const syncManager = new SyncManager();
