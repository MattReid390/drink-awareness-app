// Network status monitoring (stub for future implementation)
// When @react-native-community/netinfo is available, this can be fully implemented

type NetworkListener = (_connectionStatus: boolean) => void;

class NetworkMonitor {
  private listeners: Set<NetworkListener> = new Set();
  private isOnline = true;

  async initialize(): Promise<void> {
    // Initialize network monitoring
    // Assuming online for now (full implementation requires netinfo package)
    this.isOnline = true;
  }

  cleanup(): void {
    this.listeners.clear();
  }

  getStatus(): boolean {
    return this.isOnline;
  }

  isOffline(): boolean {
    return !this.isOnline;
  }

  subscribe(listener: NetworkListener): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const networkMonitor = new NetworkMonitor();
