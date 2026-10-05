import { api } from './api';

export interface Subscription {
  id: number;
  userId: string;
  plan: 'free' | 'premium' | 'premium_plus';
  status: 'active' | 'canceled' | 'expired';
  stripeCustomerId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAt?: string;
  isPremium: boolean;
}

export interface CoachingSession {
  id: number;
  topic: string;
  recommendation: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
}

export interface CoachingResponse {
  count: number;
  sessions: CoachingSession[];
}

export interface HealthIntegration {
  connected: boolean;
  provider?: 'apple_health' | 'google_fit';
  syncedAt?: string;
  lastTokenRefresh?: string;
  message?: string;
}

export interface HealthDataPoint {
  stepsToday: number;
  sleepHours: number;
  heartRate: number;
}

export interface HealthSyncResponse {
  message: string;
  provider: string;
  syncedAt: string;
  dataPoints: HealthDataPoint;
}

// Subscription endpoints
export const getSubscription = async (): Promise<Subscription | null> => {
  try {
    return await api.get<Subscription>('/premium/subscription');
  } catch (error) {
    console.error('Failed to get subscription:', error);
    return null;
  }
};

export const upgradeToPremium = async (plan: 'premium' | 'premium_plus'): Promise<any> => {
  try {
    return await api.post('/premium/subscription/upgrade', { plan });
  } catch (error) {
    console.error('Failed to upgrade subscription:', error);
    throw error;
  }
};

export const cancelSubscription = async (): Promise<any> => {
  try {
    return await api.post('/premium/subscription/cancel', {});
  } catch (error) {
    console.error('Failed to cancel subscription:', error);
    throw error;
  }
};

// Coaching endpoints
export const getCoaching = async (): Promise<CoachingResponse | null> => {
  try {
    return await api.get<CoachingResponse>('/premium/coaching');
  } catch (error) {
    console.error('Failed to get coaching:', error);
    return null;
  }
};

export const dismissCoaching = async (id: number): Promise<any> => {
  try {
    return await api.post(`/premium/coaching/${id}/dismiss`, {});
  } catch (error) {
    console.error('Failed to dismiss coaching:', error);
    throw error;
  }
};

export const refreshCoaching = async (): Promise<CoachingSession | null> => {
  try {
    const response = await api.post<CoachingSession>('/premium/coaching/refresh', {});
    return response;
  } catch (error) {
    console.error('Failed to refresh coaching:', error);
    return null;
  }
};

// Health integration endpoints
export const getHealthStatus = async (): Promise<HealthIntegration | null> => {
  try {
    return await api.get<HealthIntegration>('/premium/health');
  } catch (error) {
    console.error('Failed to get health status:', error);
    return null;
  }
};

export const connectHealthProvider = async (
  provider: 'apple_health' | 'google_fit',
  accessToken: string,
  refreshToken?: string,
  expiresIn?: number
): Promise<any> => {
  try {
    return await api.post('/premium/health/connect', {
      provider,
      accessToken,
      refreshToken,
      expiresIn,
    });
  } catch (error) {
    console.error('Failed to connect health provider:', error);
    throw error;
  }
};

export const syncHealthData = async (): Promise<HealthSyncResponse | null> => {
  try {
    return await api.post<HealthSyncResponse>('/premium/health/sync', {});
  } catch (error) {
    console.error('Failed to sync health data:', error);
    return null;
  }
};

export const disconnectHealthProvider = async (): Promise<any> => {
  try {
    return await api.delete('/premium/health/disconnect');
  } catch (error) {
    console.error('Failed to disconnect health provider:', error);
    throw error;
  }
};
