// Claude AI coaching service for personalized recommendations

import { api } from './api';
import { getAllDrinks } from './storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CoachingRecommendation {
  id: number;
  topic: string;
  recommendation: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: string;
  reasoning?: string;
}

interface DismissedCoaching {
  id: number;
  dismissedAt: string;
}

const COACHING_CACHE_KEY = 'coaching_recommendations';
const DISMISSED_KEY = 'dismissed_coaching';
const LAST_GENERATION_KEY = 'last_coaching_generation';
const MIN_GENERATION_INTERVAL = 3600000; // 1 hour in milliseconds

class ClaudeCoachingService {
  async generateRecommendation(): Promise<CoachingRecommendation> {
    const lastGeneration = await AsyncStorage.getItem(LAST_GENERATION_KEY);
    const now = Date.now();

    if (lastGeneration) {
      const lastTime = parseInt(lastGeneration);
      if (now - lastTime < MIN_GENERATION_INTERVAL) {
        throw new Error('Please wait before generating another recommendation');
      }
    }

    try {
      const drinks = await getAllDrinks();
      const dismissed = await this.getDismissed();

      const recommendation = await api.post<CoachingRecommendation>('/claude/coaching/generate', {
        recentDrinks: drinks.slice(-14),
        dismissedTopics: dismissed.map((d) => d.id),
      });

      await AsyncStorage.setItem(LAST_GENERATION_KEY, now.toString());

      const cached = await this.getCached();
      const updated = [recommendation, ...cached].slice(0, 50);
      await AsyncStorage.setItem(COACHING_CACHE_KEY, JSON.stringify(updated));

      return recommendation;
    } catch (error) {
      console.error('Failed to generate coaching recommendation:', error);
      throw error;
    }
  }

  async getRecommendations(): Promise<CoachingRecommendation[]> {
    try {
      const cached = await this.getCached();
      const dismissed = await this.getDismissed();
      const dismissedIds = new Set(dismissed.map((d) => d.id));

      return cached.filter((rec) => !dismissedIds.has(rec.id));
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      return [];
    }
  }

  async dismissRecommendation(id: number): Promise<void> {
    try {
      const dismissed = await this.getDismissed();
      dismissed.push({ id, dismissedAt: new Date().toISOString() });
      await AsyncStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));

      await api.post(`/claude/coaching/${id}/dismiss`, {});
    } catch (error) {
      console.error('Failed to dismiss coaching:', error);
      throw error;
    }
  }

  private async getCached(): Promise<CoachingRecommendation[]> {
    try {
      const cached = await AsyncStorage.getItem(COACHING_CACHE_KEY);
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Failed to read coaching cache:', error);
      return [];
    }
  }

  private async getDismissed(): Promise<DismissedCoaching[]> {
    try {
      const dismissed = await AsyncStorage.getItem(DISMISSED_KEY);
      return dismissed ? JSON.parse(dismissed) : [];
    } catch (error) {
      console.error('Failed to read dismissed coaching:', error);
      return [];
    }
  }

  async clearCache(): Promise<void> {
    await AsyncStorage.removeItem(COACHING_CACHE_KEY);
    await AsyncStorage.removeItem(DISMISSED_KEY);
    await AsyncStorage.removeItem(LAST_GENERATION_KEY);
  }
}

export const claudeCoachingService = new ClaudeCoachingService();
