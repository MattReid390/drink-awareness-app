// Optimistic state updates - show changes immediately, revert if sync fails

import { Drink } from '../types/drink';
import { saveDrink, deleteDrink } from './storage';
import { changeTracker } from './changeTracking';

interface OptimisticUpdate {
  id: string;
  action: 'create' | 'update' | 'delete';
  data: Drink;
  originalData?: Drink;
  timestamp: number;
}

type OptimisticListener = (_updates: OptimisticUpdate[]) => void;

class OptimisticStateManager {
  private pendingUpdates: Map<string, OptimisticUpdate> = new Map();
  private listeners: OptimisticListener[] = [];

  async createDrinkOptimistic(drink: Drink): Promise<Drink> {
    const update: OptimisticUpdate = {
      id: drink.id,
      action: 'create',
      data: drink,
      timestamp: Date.now(),
    };

    this.pendingUpdates.set(drink.id, update);
    await saveDrink(drink);
    await changeTracker.recordChange(drink.id, Object.keys(drink), drink);
    this.notifyListeners();

    return drink;
  }

  async updateDrinkOptimistic(
    drinkId: string,
    updates: Partial<Drink>,
    originalDrink: Drink
  ): Promise<Drink> {
    const updated = { ...originalDrink, ...updates };

    const optimisticUpdate: OptimisticUpdate = {
      id: drinkId,
      action: 'update',
      data: updated,
      originalData: originalDrink,
      timestamp: Date.now(),
    };

    this.pendingUpdates.set(drinkId, optimisticUpdate);
    await saveDrink(updated);

    const changedFields = Object.keys(updates).filter(
      (key) => updates[key as keyof Drink] !== originalDrink[key as keyof Drink]
    );
    await changeTracker.recordChange(drinkId, changedFields, updated);
    this.notifyListeners();

    return updated;
  }

  async deleteDrinkOptimistic(drinkId: string, originalDrink: Drink): Promise<void> {
    const update: OptimisticUpdate = {
      id: drinkId,
      action: 'delete',
      data: originalDrink,
      originalData: originalDrink,
      timestamp: Date.now(),
    };

    this.pendingUpdates.set(drinkId, update);
    await deleteDrink(drinkId);
    await changeTracker.recordChange(drinkId, ['_deleted'], originalDrink);
    this.notifyListeners();
  }

  async rollback(drinkId: string): Promise<void> {
    const update = this.pendingUpdates.get(drinkId);

    if (update && update.action === 'update' && update.originalData) {
      await saveDrink(update.originalData);
    } else if (update && update.action === 'create') {
      await deleteDrink(drinkId);
    } else if (update && update.action === 'delete' && update.originalData) {
      await saveDrink(update.originalData);
    }

    this.pendingUpdates.delete(drinkId);
    this.notifyListeners();
  }

  getPendingUpdates(): OptimisticUpdate[] {
    return Array.from(this.pendingUpdates.values());
  }

  getPendingUpdate(drinkId: string): OptimisticUpdate | undefined {
    return this.pendingUpdates.get(drinkId);
  }

  async confirmSync(drinkIds: string[]): Promise<void> {
    for (const drinkId of drinkIds) {
      this.pendingUpdates.delete(drinkId);
    }
    await changeTracker.markSynced(drinkIds);
    this.notifyListeners();
  }

  hasPendingUpdates(): boolean {
    return this.pendingUpdates.size > 0;
  }

  subscribe(listener: OptimisticListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    const updates = this.getPendingUpdates();
    this.listeners.forEach((listener) => listener(updates));
  }
}

export const optimisticStateManager = new OptimisticStateManager();
