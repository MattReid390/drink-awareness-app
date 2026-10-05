// Hook for monitoring network status throughout the app

import { useEffect, useState } from 'react';
import { networkStatusManager } from '../services/networkStatus';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(networkStatusManager.isNetworkOnline());

  useEffect(() => {
    const unsubscribe = networkStatusManager.subscribe((online) => {
      setIsOnline(online);
    });

    return unsubscribe;
  }, []);

  return isOnline;
};
