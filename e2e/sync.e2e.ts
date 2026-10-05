// E2E: Sync & Offline flow - Cloud sync, offline detection, conflict resolution

import { syncManager } from '../src/services/sync';
import { optimisticStateManager } from '../src/services/optimisticState';
import { changeTracker } from '../src/services/changeTracking';
import { networkStatusManager } from '../src/services/networkStatus';
import { saveDrink, getAllDrinks } from '../src/services/storage';
import { Drink } from '../src/types/drink';
import { v4 as uuidv4 } from 'uuid';

describe('Sync & Offline Flow', () => {
  beforeEach(async () => {
    await changeTracker.initialize();
  });

  describe('Optimistic Updates', () => {
    it('should create drink optimistically', async () => {
      const drink: Drink = {
        id: uuidv4(),
        type: 'beer',
        abv: 5.0,
        quantity: 12,
        time: new Date().toISOString(),
        venue: 'Test',
        cost: 5.0,
      };

      const result = await optimisticStateManager.createDrinkOptimistic(drink);
      expect(result.id).toBe(drink.id);

      const pending = optimisticStateManager.getPendingUpdates();
      expect(pending.some((p) => p.id === drink.id)).toBe(true);
    });

    it('should update drink optimistically', async () => {
      const drink: Drink = {
        id: uuidv4(),
        type: 'beer',
        abv: 5.0,
        quantity: 12,
        time: new Date().toISOString(),
        venue: 'Test',
        cost: 5.0,
      };

      await saveDrink(drink);

      const updated = await optimisticStateManager.updateDrinkOptimistic(
        drink.id,
        { venue: 'Updated Venue' },
        drink
      );

      expect(updated.venue).toBe('Updated Venue');

      const pending = optimisticStateManager.getPendingUpdates();
      expect(pending.some((p) => p.id === drink.id && p.action === 'update')).toBe(true);
    });

    it('should delete drink optimistically', async () => {
      const drink: Drink = {
        id: uuidv4(),
        type: 'beer',
        abv: 5.0,
        quantity: 12,
        time: new Date().toISOString(),
        venue: 'Test',
        cost: 5.0,
      };

      await saveDrink(drink);
      await optimisticStateManager.deleteDrinkOptimistic(drink.id, drink);

      const pending = optimisticStateManager.getPendingUpdates();
      expect(pending.some((p) => p.id === drink.id && p.action === 'delete')).toBe(true);
    });

    it('should rollback on sync failure', async () => {
      const drink: Drink = {
        id: uuidv4(),
        type: 'beer',
        abv: 5.0,
        quantity: 12,
        time: new Date().toISOString(),
        venue: 'Original',
        cost: 5.0,
      };

      await saveDrink(drink);
      await optimisticStateManager.updateDrinkOptimistic(
        drink.id,
        { venue: 'Modified' },
        drink
      );

      // Simulate sync failure - rollback
      await optimisticStateManager.rollback(drink.id);

      const pending = optimisticStateManager.getPendingUpdates();
      expect(pending.some((p) => p.id === drink.id)).toBe(false);
    });

    it('should confirm sync after successful upload', async () => {
      const drinkIds = [];

      for (let i = 0; i < 3; i++) {
        const drink: Drink = {
          id: uuidv4(),
          type: 'beer',
          abv: 5.0,
          quantity: 12,
          time: new Date().toISOString(),
          venue: 'Test',
          cost: 5.0,
        };

        await optimisticStateManager.createDrinkOptimistic(drink);
        drinkIds.push(drink.id);
      }

      await optimisticStateManager.confirmSync(drinkIds);

      const pending = optimisticStateManager.getPendingUpdates();
      expect(pending.length).toBe(0);
    });
  });

  describe('Change Tracking', () => {
    it('should record field-level changes', async () => {
      const drink: Drink = {
        id: uuidv4(),
        type: 'beer',
        abv: 5.0,
        quantity: 12,
        time: new Date().toISOString(),
        venue: 'Test',
        cost: 5.0,
      };

      await changeTracker.recordChange(drink.id, ['venue', 'cost'], drink);

      const unsynced = changeTracker.getUnsyncedChanges();
      expect(unsynced.some((c) => c.drinkId === drink.id)).toBe(true);
    });

    it('should mark changes as synced', async () => {
      const drinkIds = [uuidv4(), uuidv4()];

      for (const id of drinkIds) {
        await changeTracker.recordChange(id, ['type'], { id } as any);
      }

      await changeTracker.markSynced(drinkIds);

      const unsynced = changeTracker.getUnsyncedChanges();
      expect(unsynced.filter((c) => drinkIds.includes(c.drinkId)).length).toBe(0);
    });

    it('should track version numbers for conflicts', async () => {
      const drinkId = uuidv4();

      await changeTracker.recordChange(drinkId, ['type'], { id: drinkId } as any);
      const first = changeTracker.getChangesForDrink(drinkId);

      await changeTracker.recordChange(drinkId, ['venue'], { id: drinkId } as any);
      const second = changeTracker.getChangesForDrink(drinkId);

      expect(second!.version).toBeGreaterThan(first!.version);
    });
  });

  describe('Network Status', () => {
    it('should detect network status', async () => {
      const isOnline = networkStatusManager.isOnline;
      expect(typeof isOnline).toBe('boolean');
    });

    it('should track sync attempts', () => {
      const status = syncManager.getStatus();
      expect(status).toBeDefined();
    });
  });

  describe('Selective Sync', () => {
    it('should only sync changed data', async () => {
      const drink1: Drink = {
        id: uuidv4(),
        type: 'beer',
        abv: 5.0,
        quantity: 12,
        time: new Date().toISOString(),
        venue: 'Venue 1',
        cost: 5.0,
      };

      const drink2: Drink = {
        id: uuidv4(),
        type: 'wine',
        abv: 12.0,
        quantity: 150,
        time: new Date().toISOString(),
        venue: 'Venue 2',
        cost: 8.0,
      };

      await optimisticStateManager.createDrinkOptimistic(drink1);
      await optimisticStateManager.createDrinkOptimistic(drink2);

      const unsynced = changeTracker.getUnsyncedChanges();
      expect(unsynced.length).toBe(2);

      // Mark drink1 as synced
      await optimisticStateManager.confirmSync([drink1.id]);

      const stillUnsynced = changeTracker.getUnsyncedChanges();
      expect(stillUnsynced.some((c) => c.drinkId === drink2.id)).toBe(true);
      expect(stillUnsynced.some((c) => c.drinkId === drink1.id)).toBe(false);
    });
  });
});
