// AsyncStorage service for local data persistence
// All data is stored locally - no account or backend required (DAA-050)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Drink, DailyLog, WeeklyLog } from '../types';
import { getTodayString, getWeekStart, getWeekEnd, getWeekDays} from '../utils'

// Storage keys - all data is namespaced to avoid conflicts
const KEYS = {
    drinks: 'daa:drinks',                       // All logged drinks
    ageConfirmed: 'daa:age_confirmed',          // Age confirmation flag
    weeklyUnitGoal: 'daa:weekly_unit_goal',     // User's weekly unit goal
    currency: 'daa:currency',                   // User's preferred currency
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
    const value = await AsyncStorage.getItem(KEYS.drinks);
    return value ? JSON.parse(value) : [];
};

// Saves a new drink to storage
export const saveDrink = async (drink: Drink): Promise<void> => {
    const existing = await getAllDrinks();
    const updated = [...existing, drink];
    await AsyncStorage.setItem(KEYS.drinks, JSON.stringify(updated));
};

// Deletes a drink by ID
export const deleteDrink = async (id: String): Promise<void> => {
    const existing = await getAllDrinks();
    const updated = existing.filter((drink) => drink.id !== id);
    await AsyncStorage.setItem(KEYS.drinks, JSON.stringify(updated));
};

// --- Daily Log --------------------------------------------------------

// Returns a DailyLog for a given date (defaults to today)
export const getDailyLog = async (date?: string): Promise<DailyLog> => {
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
};

// --- Weekly Log --------------------------------------------------------

// Returns a WeeklyLog for the week containing the given date (defaults to today)
export const getWeeklyLog = async (date?: string): Promise<WeeklyLog> => {
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
        totalDrinks: days.reduce((sum, d) => + d.totalDrinks, 0),
        totalUnits: days.reduce((sum, d) => sum + d.totalUnits, 0),
        totalSpend: days.reduce((sum, d) => sum + d.totalSpend, 0),
    };
};

// --- Settings --------------------------------------------------------

// Saves the user's weekly unit goal
export const saveWeeklyUnitGoal = async (goal: number): Promise<void> => {
    await AsyncStorage.setItem(KEYS.weeklyUnitGoal, goal.toString());
};

// Returns the user's weekly unit goal (defaults to 14 - NHS recommendation)
export const getWeeklyUnitGoal = async (): Promise<number> => {
    const value = await AsyncStorage.getItem(KEYS.weeklyUnitGoal);
    return value ? parseInt(value, 10) : 14;
};

// --- Reset --------------------------------------------------------

// Deletes all app data - triggered by reset option in settings (S14)
export const resetAllData = async (): Promise<void> => {
    await AsyncStorage.multiRemove(Object.values(KEYS));
};