// Hook for monitoring sync status throughout the app

import { useEffect, useState } from 'react';
import { syncManager, SyncStatus } from '../services/sync';

export const useSyncStatus = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);

  useEffect(() => {
    const updateStatus = async () => {
      const status = await syncManager.getStatus();
      setSyncStatus(status);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  return syncStatus;
};
