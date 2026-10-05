// Performance monitoring and optimization utilities

let performanceMetrics: Record<string, { count: number; totalMs: number }> = {};

export const performance = {
  // Track operation timing
  measureAsync: async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    const start = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - start;
      recordMetric(name, duration);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      recordMetric(`${name}:error`, duration);
      throw error;
    }
  },

  // Get average duration for a metric
  getMetric: (name: string): { avgMs: number; count: number } | null => {
    const metric = performanceMetrics[name];
    if (!metric) return null;
    return {
      avgMs: Math.round(metric.totalMs / metric.count),
      count: metric.count,
    };
  },

  // Reset all metrics
  resetMetrics: () => {
    performanceMetrics = {};
  },

  // Get all metrics
  getAllMetrics: () => ({ ...performanceMetrics }),
};

function recordMetric(name: string, durationMs: number): void {
  if (!performanceMetrics[name]) {
    performanceMetrics[name] = { count: 0, totalMs: 0 };
  }
  performanceMetrics[name].count++;
  performanceMetrics[name].totalMs += durationMs;

  // Slow operations (>500ms) logged by monitoring system
}
