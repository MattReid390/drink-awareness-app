// Network status monitoring service
// Detects online/offline state and triggers sync when connection restored

import * as Network from 'expo-network';
import { syncManager } from './sync';

type NetworkStatusListener = (_isOnline: boolean) => void;

class NetworkStatusManager {
  private isOnline = true;
  private listeners: NetworkStatusListener[] = [];
  private syncRetryCount = 0;
  private maxRetries = 3;
  private retryDelays = [1000, 2000, 4000]; // ms

  async initialize(): Promise<() => void> {
    // Get initial network state
    const state = await Network.getNetworkStateAsync();
    this.isOnline = state.isInternetReachable ?? true;

    // Listen for network state changes
    const subscription = Network.addNetworkStateListener((_state) => {
      const wasOnline = this.isOnline;
      this.isOnline = _state.isInternetReachable ?? true;

      // Trigger sync when connection restored
      if (!wasOnline && this.isOnline) {
        this.triggerSync();
      }

      // Notify listeners
      this.notifyListeners(this.isOnline);
    });

    // Cleanup subscription on process exit (if needed)
    return () => subscription.remove();
  }

  private async triggerSync(): Promise<void> {
    this.syncRetryCount = 0;
    await this.syncWithRetry();
  }

  private async syncWithRetry(): Promise<void> {
    try {
      await syncManager.performSync();
      this.syncRetryCount = 0;
    } catch (error) {
      if (this.syncRetryCount < this.maxRetries) {
        const delay = this.retryDelays[this.syncRetryCount];
        this.syncRetryCount += 1;

        setTimeout(() => {
          this.syncWithRetry();
        }, delay);
      }
    }
  }

  isNetworkOnline(): boolean {
    return this.isOnline;
  }

  subscribe(listener: NetworkStatusListener): () => void {
    this.listeners.push(listener);

    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(isOnline: boolean): void {
    this.listeners.forEach((listener) => listener(isOnline));
  }
}

export const networkStatusManager = new NetworkStatusManager();
