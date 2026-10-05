// Simple in-memory cache with TTL support

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class Cache {
  private data: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, value: T, ttlMs?: number): void {
    const expiresAt = Date.now() + (ttlMs || this.defaultTTL);
    this.data.set(key, { value, expiresAt });
  }

  get<T>(key: string): T | null {
    const entry = this.data.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.data.delete(key);
      return null;
    }

    return entry.value as T;
  }

  has(key: string): boolean {
    const entry = this.data.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.data.delete(key);
      return false;
    }

    return true;
  }

  clear(keyPattern?: string): void {
    if (!keyPattern) {
      this.data.clear();
      return;
    }

    // Clear keys matching pattern
    const regex = new RegExp(keyPattern);
    for (const key of this.data.keys()) {
      if (regex.test(key)) {
        this.data.delete(key);
      }
    }
  }

  getSize(): number {
    return this.data.size;
  }
}

export const cache = new Cache();

// Cache strategies for common operations
export const cacheStrategies = {
  // Cache analytics data for 10 minutes
  ANALYTICS: (key: string) => cache.get(key),
  setAnalytics: (key: string, value: any) => cache.set(key, value, 10 * 60 * 1000),

  // Cache user preferences for 1 hour
  USER_PREFS: (key: string) => cache.get(key),
  setUserPrefs: (key: string, value: any) => cache.set(key, value, 60 * 60 * 1000),

  // Cache venue data for 30 minutes
  VENUES: (key: string) => cache.get(key),
  setVenues: (key: string, value: any) => cache.set(key, value, 30 * 60 * 1000),
};
