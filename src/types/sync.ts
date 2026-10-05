// Sync-related type definitions

export interface SyncConflictResolution {
  drinkId: string;
  strategy: 'local' | 'remote' | 'merge';
  resolvedAt: string;
}

export interface SyncMetadata {
  lastSyncTime: string;
  syncInProgress: boolean;
  lastSyncError?: string;
  conflictCount: number;
  pendingChanges: number;
}

export interface SyncableData {
  id: string;
  lastModified: string;
  version: number;
  synced: boolean;
}
