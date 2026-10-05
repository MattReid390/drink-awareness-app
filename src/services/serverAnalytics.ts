import { api } from './api';

export interface TrendDataPoint {
  date: string;
  drinks: number;
  units: number;
}

export interface TrendResponse {
  period: string;
  dataPoints: number;
  totalDrinks: number;
  totalUnits: number;
  trends: TrendDataPoint[];
}

export interface StatsResponse {
  allTime: {
    totalDrinks: number;
    totalUnits: number;
    averageUnits: number;
    maxUnits: number;
    minUnits: number;
  };
  thirtyDays: {
    drinks: number;
    units: number;
    activeDays: number;
    averagePerDay: number;
  };
}

export interface Insight {
  type: 'warning' | 'positive' | 'info';
  message: string;
}

export interface InsightsResponse {
  insightCount: number;
  insights: Insight[];
  metadata: {
    daysLogged: number;
    averageDailyUnits: string;
    peakDailyUnits: string;
  };
}

export const get30DayTrends = async (): Promise<TrendResponse | null> => {
  try {
    return await api.get<TrendResponse>('/analytics/trends');
  } catch (error) {
    console.error('Failed to get trends:', error);
    return null;
  }
};

export const getStatistics = async (): Promise<StatsResponse | null> => {
  try {
    return await api.get<StatsResponse>('/analytics/stats');
  } catch (error) {
    console.error('Failed to get statistics:', error);
    return null;
  }
};

export const getInsights = async (): Promise<InsightsResponse | null> => {
  try {
    return await api.get<InsightsResponse>('/analytics/insights');
  } catch (error) {
    console.error('Failed to get insights:', error);
    return null;
  }
};
