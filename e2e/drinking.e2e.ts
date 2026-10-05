// E2E: Drinking tracking flow - Log drinks, view summaries, track goals

import {
  saveDrink,
  getAllDrinks,
  getDailyLog,
  getWeeklyLog,
  saveWeeklyUnitGoal,
  getWeeklyUnitGoal,
} from '../src/services/storage';
import { getGoalProgress, getCostAnalysis } from '../src/services/analytics';
import { Drink } from '../src/types/drink';
import { v4 as uuidv4 } from 'uuid';

describe('Drinking Tracking Flow', () => {
  const today = new Date().toISOString().split('T')[0];

  beforeEach(async () => {
    const drinks = await getAllDrinks();
    for (const drink of drinks) {
      if (drink.time.startsWith(today)) {
        // Clean up test drinks
      }
    }
  });

  describe('Log a Drink', () => {
    it('should create new drink entry', async () => {
      const drink: Drink = {
        id: uuidv4(),
        type: 'beer',
        abv: 5.0,
        quantity: 12,
        time: new Date().toISOString(),
        venue: 'Test Venue',
        cost: 5.99,
        notes: 'Test drink',
      };

      await saveDrink(drink);
      const all = await getAllDrinks();

      expect(all.some((d) => d.id === drink.id)).toBe(true);
    });

    it('should retrieve daily log', async () => {
      const drink: Drink = {
        id: uuidv4(),
        type: 'wine',
        abv: 12.0,
        quantity: 150,
        time: new Date().toISOString(),
        venue: 'Test',
        cost: 8.0,
      };

      await saveDrink(drink);
      const daily = await getDailyLog(today);

      expect(daily.length).toBeGreaterThan(0);
      expect(daily.some((d) => d.id === drink.id)).toBe(true);
    });

    it('should validate drink data', async () => {
      const invalidDrink: any = {
        id: uuidv4(),
        type: 'beer',
        abv: -5.0, // Invalid ABV
        quantity: 12,
        time: new Date().toISOString(),
      };

      expect(async () => {
        await saveDrink(invalidDrink);
      }).rejects.toThrow();
    });
  });

  describe('Weekly Goals', () => {
    it('should set weekly unit goal', async () => {
      const goal = 14; // UK guideline
      await saveWeeklyUnitGoal(goal);

      const retrieved = await getWeeklyUnitGoal();
      expect(retrieved).toBe(goal);
    });

    it('should track goal progress', async () => {
      await saveWeeklyUnitGoal(14);

      // Log 7 units (half the goal)
      for (let i = 0; i < 2; i++) {
        await saveDrink({
          id: uuidv4(),
          type: 'beer',
          abv: 5.0,
          quantity: 12,
          time: new Date().toISOString(),
          venue: 'Test',
          cost: 5.0,
        });
      }

      const progress = await getGoalProgress();
      expect(progress).toBeDefined();
      expect(progress.goalAmount).toBe(14);
      expect(progress.currentAmount).toBeGreaterThan(0);
    });
  });

  describe('Analytics', () => {
    it('should calculate cost analysis', async () => {
      await saveDrink({
        id: uuidv4(),
        type: 'beer',
        abv: 5.0,
        quantity: 12,
        time: new Date().toISOString(),
        venue: 'Test',
        cost: 5.99,
      });

      const analysis = await getCostAnalysis();
      expect(analysis).toBeDefined();
      expect(analysis.totalSpent).toBeGreaterThan(0);
      expect(analysis.averageCostPerDrink).toBeGreaterThan(0);
    });

    it('should generate weekly summary', async () => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekStartStr = weekStart.toISOString().split('T')[0];

      const weekly = await getWeeklyLog(weekStartStr);
      expect(Array.isArray(weekly)).toBe(true);
    });
  });

  describe('Multiple Drinks', () => {
    it('should handle multiple drinks in same day', async () => {
      const drinkIds = [];

      for (let i = 0; i < 3; i++) {
        const drink: Drink = {
          id: uuidv4(),
          type: i === 0 ? 'beer' : i === 1 ? 'wine' : 'spirit',
          abv: i === 0 ? 5 : i === 1 ? 12 : 40,
          quantity: i === 0 ? 12 : i === 1 ? 150 : 25,
          time: new Date(Date.now() + i * 3600000).toISOString(),
          venue: `Venue ${i}`,
          cost: 5 + i * 3,
        };

        await saveDrink(drink);
        drinkIds.push(drink.id);
      }

      const daily = await getDailyLog(today);
      const testDrinks = daily.filter((d) => drinkIds.includes(d.id));

      expect(testDrinks.length).toBe(3);
    });
  });
});
