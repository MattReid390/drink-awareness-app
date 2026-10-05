// Track which drinks and fields have changed for selective sync

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Drink } from '../types/drink';

interface ChangeRecord {
  drinkId: string;
  fields: string[];
  version: number;
  timestamp: string;
  synced: boolean;
}

const CHANGES_KEY = 'sync_change_tracking';

class ChangeTracker {
  private changes: Map<string, ChangeRecord> = new Map();
  private version = 0;

  async initialize(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(CHANGES_KEY);
      if (data) {
        const records = JSON.parse(data) as ChangeRecord[];
        records.forEach((record) => {
          this.changes.set(record.drinkId, record);
          this.version = Math.max(this.version, record.version);
        });
      }
    } catch (error) {
      console.error('Failed to load change tracking:', error);
    }
  }

  async recordChange(drinkId: string, fields: string[], _drink: Drink): Promise<void> {
    this.version += 1;

    const record: ChangeRecord = {
      drinkId,
      fields,
      version: this.version,
      timestamp: new Date().toISOString(),
      synced: false,
    };

    this.changes.set(drinkId, record);
    await this.persist();
  }

  async markSynced(drinkIds: string[]): Promise<void> {
    let changed = false;

    for (const drinkId of drinkIds) {
      const record = this.changes.get(drinkId);
      if (record) {
        record.synced = true;
        changed = true;
      }
    }

    if (changed) {
      await this.persist();
    }
  }

  getUnsyncedChanges(): ChangeRecord[] {
    return Array.from(this.changes.values()).filter((r) => !r.synced);
  }

  getChangesForDrink(drinkId: string): ChangeRecord | undefined {
    return this.changes.get(drinkId);
  }

  async clearOldChanges(daysOld: number = 30): Promise<void> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysOld);

    let changed = false;
    for (const [drinkId, record] of this.changes.entries()) {
      if (new Date(record.timestamp) < cutoff && record.synced) {
        this.changes.delete(drinkId);
        changed = true;
      }
    }

    if (changed) {
      await this.persist();
    }
  }

  private async persist(): Promise<void> {
    try {
      const records = Array.from(this.changes.values());
      await AsyncStorage.setItem(CHANGES_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Failed to persist change tracking:', error);
    }
  }
}

export const changeTracker = new ChangeTracker();
