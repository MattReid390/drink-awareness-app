// Offline operation queue
// Stores operations to replay when connection is restored

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QueuedOperation {
  id: string;
  type: 'add' | 'delete' | 'update';
  data: any;
  timestamp: string;
}

const QUEUE_KEY = 'daa:sync_queue';
const MAX_QUEUE_SIZE = 1000; // Prevent unbounded growth

class OfflineQueue {
  private queue: QueuedOperation[] = [];
  private isLoaded = false;

  async initialize(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const stored = await AsyncStorage.getItem(QUEUE_KEY);
      this.queue = stored ? JSON.parse(stored) : [];
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load offline queue:', error);
      this.queue = [];
      this.isLoaded = true;
    }
  }

  async enqueue(operation: Omit<QueuedOperation, 'id' | 'timestamp'>): Promise<void> {
    await this.initialize();

    if (this.queue.length >= MAX_QUEUE_SIZE) {
      this.queue.shift();
    }

    const queuedOp: QueuedOperation = {
      ...operation,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    this.queue.push(queuedOp);
    await this.persist();
  }

  async getQueue(): Promise<QueuedOperation[]> {
    await this.initialize();
    return [...this.queue];
  }

  async dequeue(operationId: string): Promise<void> {
    await this.initialize();
    this.queue = this.queue.filter((op) => op.id !== operationId);
    await this.persist();
  }

  async clearQueue(): Promise<void> {
    await this.initialize();
    this.queue = [];
    await this.persist();
  }

  async getQueueSize(): Promise<number> {
    await this.initialize();
    return this.queue.length;
  }

  private async persist(): Promise<void> {
    try {
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to persist offline queue:', error);
    }
  }
}

export const offlineQueue = new OfflineQueue();
