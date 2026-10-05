// Health app integration service for Apple Health & Google Fit

import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export interface HealthDataPoint {
  stepsToday: number;
  sleepHours: number;
  heartRate: number;
  lastUpdated?: string;
}

export interface HealthProvider {
  provider: 'apple_health' | 'google_fit';
  connected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  syncedAt?: string;
}

interface StoredHealthProvider extends HealthProvider {
  refreshedAt?: string;
}

const HEALTH_PROVIDER_KEY = 'health_provider_config';
const HEALTH_DATA_CACHE_KEY = 'health_data_cache';
const TOKEN_REFRESH_THRESHOLD = 300000; // 5 minutes before expiry

class HealthIntegrationService {
  async connectAppleHealth(accessToken: string, refreshToken?: string, expiresIn?: number) {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Health is only available on iOS');
    }

    try {
      const expiresAt = expiresIn
        ? new Date(Date.now() + expiresIn * 1000).toISOString()
        : undefined;

      const provider: StoredHealthProvider = {
        provider: 'apple_health',
        connected: true,
        accessToken,
        refreshToken,
        expiresAt,
        syncedAt: new Date().toISOString(),
      };

      await this.storeProvider(provider);

      await api.post('/health/connect', {
        provider: 'apple_health',
        accessToken,
        refreshToken,
        expiresIn,
      });

      return provider;
    } catch (error) {
      console.error('Failed to connect Apple Health:', error);
      throw error;
    }
  }

  async connectGoogleFit(accessToken: string, refreshToken?: string, expiresIn?: number) {
    if (Platform.OS !== 'android') {
      throw new Error('Google Fit is only available on Android');
    }

    try {
      const expiresAt = expiresIn
        ? new Date(Date.now() + expiresIn * 1000).toISOString()
        : undefined;

      const provider: StoredHealthProvider = {
        provider: 'google_fit',
        connected: true,
        accessToken,
        refreshToken,
        expiresAt,
        syncedAt: new Date().toISOString(),
      };

      await this.storeProvider(provider);

      await api.post('/health/connect', {
        provider: 'google_fit',
        accessToken,
        refreshToken,
        expiresIn,
      });

      return provider;
    } catch (error) {
      console.error('Failed to connect Google Fit:', error);
      throw error;
    }
  }

  async getConnectedProvider(): Promise<HealthProvider | null> {
    try {
      const stored = await AsyncStorage.getItem(HEALTH_PROVIDER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to get health provider:', error);
      return null;
    }
  }

  async refreshTokenIfNeeded(): Promise<boolean> {
    const provider = await this.getConnectedProvider();
    if (!provider || !provider.connected || !provider.refreshToken || !provider.expiresAt) {
      return false;
    }

    const expiresAt = new Date(provider.expiresAt).getTime();
    const now = Date.now();

    if (now + TOKEN_REFRESH_THRESHOLD > expiresAt) {
      try {
        const response = await api.post<{ accessToken: string; expiresIn: number }>(
          '/health/refresh-token',
          {
            provider: provider.provider,
            refreshToken: provider.refreshToken,
          }
        );

        const updated: StoredHealthProvider = {
          ...provider,
          accessToken: response.accessToken,
          expiresAt: new Date(Date.now() + response.expiresIn * 1000).toISOString(),
          refreshedAt: new Date().toISOString(),
        };

        await this.storeProvider(updated);
        return true;
      } catch (error) {
        console.error('Failed to refresh health token:', error);
        return false;
      }
    }

    return true;
  }

  async syncHealthData(): Promise<HealthDataPoint | null> {
    try {
      await this.refreshTokenIfNeeded();

      const provider = await this.getConnectedProvider();
      if (!provider?.connected) {
        throw new Error('No health provider connected');
      }

      const data = await api.post<HealthDataPoint>('/health/sync', {
        provider: provider.provider,
      });

      await AsyncStorage.setItem(HEALTH_DATA_CACHE_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      const cached = await this.getCachedData();
      if (cached) {
        return cached;
      }
      throw error;
    }
  }

  async getCachedData(): Promise<HealthDataPoint | null> {
    try {
      const cached = await AsyncStorage.getItem(HEALTH_DATA_CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Failed to get cached health data:', error);
      return null;
    }
  }

  async disconnect(): Promise<void> {
    try {
      const provider = await this.getConnectedProvider();

      if (provider?.connected) {
        await api.post('/health/disconnect', {
          provider: provider.provider,
        });
      }

      await AsyncStorage.removeItem(HEALTH_PROVIDER_KEY);
      await AsyncStorage.removeItem(HEALTH_DATA_CACHE_KEY);
    } catch (error) {
      console.error('Failed to disconnect health provider:', error);
      throw error;
    }
  }

  private async storeProvider(provider: StoredHealthProvider): Promise<void> {
    try {
      await AsyncStorage.setItem(HEALTH_PROVIDER_KEY, JSON.stringify(provider));
    } catch (error) {
      console.error('Failed to store health provider:', error);
      throw error;
    }
  }
}

export const healthIntegrationService = new HealthIntegrationService();
