// AsyncStorage service for local data persistence
// All data is stored locally - no account or backend required (DAA-050)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Drink, DailyLog, WeeklyLog } from '../types';
import { getTodayString, getWeekStart, getWeekEnd, getWeekDays } from '../utils';

// Storage keys - all data is namespaced to avoid conflicts
const KEYS = {
  drinks: 'daa:drinks', // All logged drinks
  ageConfirmed: 'daa:age_confirmed', // Age confirmation flag
  weeklyUnitGoal: 'daa:weekly_unit_goal', // User's weekly unit goal
  currency: 'daa:currency', // User's preferred currency
} as const;

// --- Age Confirmation --------------------------------------------------------

// Saves the age confirmation flag on first launch
export const saveAgeConfirmed = async (): Promise<void> => {
  await AsyncStorage.setItem(KEYS.ageConfirmed, 'true');
};

// Returns true if the user has already confirmed their age
export const getAgeConfirmed = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(KEYS.ageConfirmed);
  return value === 'true';
};

// --- Drink Logging --------------------------------------------------------

// Returns all logged drinks from storage
export const getAllDrinks = async (): Promise<Drink[]> => {
  try {
    const value = await AsyncStorage.getItem(KEYS.drinks);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Failed to get drinks:', error);
    return [];
  }
};

// Saves a new drink to storage
export const saveDrink = async (drink: Drink): Promise<void> => {
  try {
    const existing = await getAllDrinks();
    const updated = [...existing, drink];
    await AsyncStorage.setItem(KEYS.drinks, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save drink:', error);
    throw new Error('Could not save drink. Please try again.');
  }
};

// Deletes a drink by ID
export const deleteDrink = async (id: String): Promise<void> => {
  try {
    const existing = await getAllDrinks();
    const updated = existing.filter((drink) => drink.id !== id);
    await AsyncStorage.setItem(KEYS.drinks, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to delete drink:', error);
    throw new Error('Could not delete drink. Please try again.');
  }
};

// --- Daily Log --------------------------------------------------------

// Returns a DailyLog for a given date (defaults to today)
export const getDailyLog = async (date?: string): Promise<DailyLog> => {
  try {
    const targetDate = date ?? getTodayString();
    const allDrinks = await getAllDrinks();

    // Filter drinks to those logged on the target date
    const dayDrinks = allDrinks.filter((drink) => drink.time.startsWith(targetDate));

    return {
      date: targetDate,
      drinks: dayDrinks,
      totalDrinks: dayDrinks.length,
      totalUnits: dayDrinks.reduce((sum, d) => sum + (d.units ?? 0), 0),
      totalSpend: dayDrinks.reduce((sum, d) => sum + (d.price ?? 0), 0),
    };
  } catch (error) {
    console.error('Failed to get daily log:', error);
    return {
      date: date ?? getTodayString(),
      drinks: [],
      totalDrinks: 0,
      totalUnits: 0,
      totalSpend: 0,
    };
  }
};

// --- Weekly Log --------------------------------------------------------

// Returns a WeeklyLog for the week containing the given date (defaults to today)
export const getWeeklyLog = async (date?: string): Promise<WeeklyLog> => {
  try {
    const targetDate = date ?? getTodayString();
    const weekStart = getWeekStart(targetDate);
    const weekEnd = getWeekEnd(targetDate);
    const weekDays = getWeekDays(targetDate);

    // Build a DailyLog for each day of the week
    const days = await Promise.all(weekDays.map((day) => getDailyLog(day)));

    return {
      weekStart,
      weekEnd,
      days,
      totalDrinks: days.reduce((sum, d) => sum + d.totalDrinks, 0),
      totalUnits: days.reduce((sum, d) => sum + d.totalUnits, 0),
      totalSpend: days.reduce((sum, d) => sum + d.totalSpend, 0),
    };
  } catch (error) {
    console.error('Failed to get weekly log:', error);
    const targetDate = date ?? getTodayString();
    return {
      weekStart: getWeekStart(targetDate),
      weekEnd: getWeekEnd(targetDate),
      days: getWeekDays(targetDate).map((d) => ({
        date: d,
        drinks: [],
        totalDrinks: 0,
        totalUnits: 0,
        totalSpend: 0,
      })),
      totalDrinks: 0,
      totalUnits: 0,
      totalSpend: 0,
    };
  }
};

// --- Settings --------------------------------------------------------

// Saves the user's weekly unit goal
export const saveWeeklyUnitGoal = async (goal: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.weeklyUnitGoal, goal.toString());
  } catch (error) {
    console.error('Failed to save weekly goal:', error);
    throw new Error('Could not save your goal. Please try again.');
  }
};

// Returns the user's weekly unit goal (defaults to 14 - NHS recommendation)
export const getWeeklyUnitGoal = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(KEYS.weeklyUnitGoal);
    return value ? parseInt(value, 10) : 14;
  } catch (error) {
    console.error('Failed to get weekly goal:', error);
    return 14;
  }
};

// --- Reset --------------------------------------------------------

// Deletes all app data - triggered by reset option in settings (S14)
export const resetAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  } catch (error) {
    console.error('Failed to reset data:', error);
    throw new Error('Could not reset data. Please try again.');
  }
};
