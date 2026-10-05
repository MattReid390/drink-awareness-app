// Track achievements, streaks, and milestones for notifications

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllDrinks } from './storage';
import { MilestoneEvent, StreakData } from '../types/notification';

const STREAK_KEY = 'achievement_streak_data';
const MILESTONES_KEY = 'achievement_milestones';

class AchievementsManager {
  async getStreakData(): Promise<StreakData> {
    try {
      const data = await AsyncStorage.getItem(STREAK_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to get streak data:', error);
    }

    return {
      currentStreak: 0,
      longestStreak: 0,
      lastLoggedDate: '',
    };
  }

  async updateStreakData(newLogDate: string): Promise<StreakData> {
    const current = await this.getStreakData();
    const today = new Date();

    // Calculate streak
    let streak = current.currentStreak;

    if (current.lastLoggedDate) {
      const lastDate = new Date(current.lastLoggedDate);
      const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        // Consecutive day, increment streak
        streak = current.currentStreak + 1;
      } else if (daysDiff > 1) {
        // Streak broken, reset
        streak = 1;
      }
      // If daysDiff === 0, same day, no change
    } else {
      streak = 1;
    }

    const updated: StreakData = {
      currentStreak: streak,
      longestStreak: Math.max(streak, current.longestStreak),
      lastLoggedDate: newLogDate,
    };

    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(updated));
    return updated;
  }

  async checkMilestones(): Promise<MilestoneEvent[]> {
    const drinks = await getAllDrinks();
    const streak = await this.getStreakData();
    const achieved: MilestoneEvent[] = [];

    // Milestone: First drink
    if (drinks.length === 1) {
      achieved.push({
        type: 'first_drink',
        value: 1,
        achieved: true,
      });
    }

    // Milestone: Drinks logged (10, 25, 50, 100, 250, 500)
    const milestones = [10, 25, 50, 100, 250, 500];
    for (const milestone of milestones) {
      if (drinks.length === milestone) {
        achieved.push({
          type: 'drinks_logged',
          value: milestone,
          achieved: true,
        });
      }
    }

    // Milestone: Streak (7, 30, 90, 365 days)
    const streakMilestones = [7, 30, 90, 365];
    for (const streak_milestone of streakMilestones) {
      if (streak.currentStreak === streak_milestone) {
        achieved.push({
          type: 'streak_milestone',
          value: streak_milestone,
          achieved: true,
        });
      }
    }

    return achieved;
  }

  async recordMilestones(events: MilestoneEvent[]): Promise<void> {
    try {
      const existing = await AsyncStorage.getItem(MILESTONES_KEY);
      const all = existing ? JSON.parse(existing) : [];

      const newEvents = events.filter(
        (e) => !all.some((a: MilestoneEvent) => a.type === e.type && a.value === e.value)
      );

      if (newEvents.length > 0) {
        await AsyncStorage.setItem(MILESTONES_KEY, JSON.stringify([...all, ...newEvents]));
      }
    } catch (error) {
      console.error('Failed to record milestones:', error);
    }
  }
}

export const achievementsManager = new AchievementsManager();
