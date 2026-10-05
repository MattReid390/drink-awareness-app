// Analytics service — Data aggregation for Phase 6.4 enhanced analytics
// Calculates trends, goals, costs, and venue frequency from stored drinks

import { getAllDrinks, getWeeklyLog, getWeeklyUnitGoal } from './storage';
import { getTodayString } from '../utils';

export interface TrendDataPoint {
  date: string;
  units: number;
  drinks: number;
}

export interface GoalProgress {
  currentWeekUnits: number;
  weeklyGoal: number;
  percentComplete: number;
  daysRemaining: number;
  onTrack: boolean;
}

export interface CostDataPoint {
  date: string;
  spend: number;
  avgPerDrink: number;
}

export interface VenueFrequency {
  venue: string;
  count: number;
  avgSpendPerVisit: number;
}

// Get 30-day trend data
export const get30DayTrend = async (): Promise<TrendDataPoint[]> => {
  try {
    const allDrinks = await getAllDrinks();
    const today = new Date(getTodayString());
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const trendMap = new Map<string, { units: number; drinks: number }>();

    // Initialize map with last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      trendMap.set(dateStr, { units: 0, drinks: 0 });
    }

    // Aggregate drinks data
    allDrinks.forEach((drink) => {
      const drinkDate = drink.time.split('T')[0];
      const entry = trendMap.get(drinkDate);
      if (entry) {
        entry.units += drink.units ?? 0;
        entry.drinks += 1;
      }
    });

    // Convert to array sorted by date
    return Array.from(trendMap.entries())
      .map(([date, { units, drinks }]) => ({ date, units, drinks }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Failed to get 30-day trend:', error);
    return [];
  }
};

// Get current week goal progress
export const getGoalProgress = async (): Promise<GoalProgress> => {
  try {
    const weeklyLog = await getWeeklyLog();
    const goal = await getWeeklyUnitGoal();
    const today = new Date(getTodayString());
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday
    const daysRemaining = 7 - dayOfWeek;
    const percentComplete = Math.min(100, Math.round((weeklyLog.totalUnits / goal) * 100));

    return {
      currentWeekUnits: weeklyLog.totalUnits,
      weeklyGoal: goal,
      percentComplete,
      daysRemaining,
      onTrack: weeklyLog.totalUnits <= goal,
    };
  } catch (error) {
    console.error('Failed to get goal progress:', error);
    return {
      currentWeekUnits: 0,
      weeklyGoal: 14,
      percentComplete: 0,
      daysRemaining: 7,
      onTrack: true,
    };
  }
};

// Get cost analysis over the last 30 days
export const getCostAnalysis = async (): Promise<{
  dailyData: CostDataPoint[];
  totalSpend: number;
  avgDailySpend: number;
  avgPerDrink: number;
}> => {
  try {
    const allDrinks = await getAllDrinks();
    const today = new Date(getTodayString());
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const costMap = new Map<string, { spend: number; drinks: number }>();

    // Initialize map with last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      costMap.set(dateStr, { spend: 0, drinks: 0 });
    }

    // Aggregate spending data
    allDrinks.forEach((drink) => {
      const drinkDate = drink.time.split('T')[0];
      const entry = costMap.get(drinkDate);
      if (entry) {
        entry.spend += drink.price ?? 0;
        entry.drinks += 1;
      }
    });

    // Convert to array
    const dailyData = Array.from(costMap.entries())
      .map(([date, { spend, drinks }]) => ({
        date,
        spend: parseFloat(spend.toFixed(2)),
        avgPerDrink: drinks > 0 ? parseFloat((spend / drinks).toFixed(2)) : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const totalSpend = parseFloat(dailyData.reduce((sum, d) => sum + d.spend, 0).toFixed(2));
    const avgDailySpend = parseFloat((totalSpend / 30).toFixed(2));
    const totalDrinks = allDrinks.filter((d) => {
      const drinkDate = d.time.split('T')[0];
      return drinkDate >= thirtyDaysAgo.toISOString().split('T')[0];
    }).length;
    const avgPerDrink = totalDrinks > 0 ? parseFloat((totalSpend / totalDrinks).toFixed(2)) : 0;

    return { dailyData, totalSpend, avgDailySpend, avgPerDrink };
  } catch (error) {
    console.error('Failed to get cost analysis:', error);
    return {
      dailyData: [],
      totalSpend: 0,
      avgDailySpend: 0,
      avgPerDrink: 0,
    };
  }
};

// Get venue frequency analysis
export const getVenueFrequency = async (): Promise<VenueFrequency[]> => {
  try {
    const allDrinks = await getAllDrinks();
    const venueMap = new Map<string, { count: number; totalSpend: number }>();

    allDrinks.forEach((drink) => {
      const venue = drink.venue || 'Unknown';
      const entry = venueMap.get(venue) || { count: 0, totalSpend: 0 };
      entry.count += 1;
      entry.totalSpend += drink.price ?? 0;
      venueMap.set(venue, entry);
    });

    // Convert to array and sort by frequency
    return Array.from(venueMap.entries())
      .map(([venue, { count, totalSpend }]) => ({
        venue,
        count,
        avgSpendPerVisit: parseFloat((totalSpend / count).toFixed(2)),
      }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Failed to get venue frequency:', error);
    return [];
  }
};
