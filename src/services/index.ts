// Central export for all services
// Import from here rather than individual files throughout the app

export {
  saveAgeConfirmed,
  getAgeConfirmed,
  getAllDrinks,
  saveDrink,
  deleteDrink,
  getDailyLog,
  getWeeklyLog,
  saveWeeklyUnitGoal,
  getWeeklyUnitGoal,
  resetAllData,
} from './storage';

export { getDailyInsight, getWeeklyInsight } from './insights';

export type { Insight } from './insights';

export { get30DayTrend, getGoalProgress, getCostAnalysis, getVenueFrequency } from './analytics';

export type { TrendDataPoint, GoalProgress, CostDataPoint, VenueFrequency } from './analytics';

export {
  signup,
  login,
  logout,
  refreshAuthToken,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  getAuthToken,
  getRefreshToken,
  isAuthenticated,
  getCurrentUser,
} from './auth';

export { api } from './api';

export { syncManager } from './sync';

export type { SyncStatus, SyncConflict } from './sync';

export { offlineQueue } from './offlineQueue';

export type { QueuedOperation } from './offlineQueue';

export {
  getUserProfile,
  getUserWithSettings,
  updateUserProfile,
  getUserSettings,
  updateUserSettings,
} from './userProfile';

export type { UserProfile, UserSettings, UserWithSettings } from './userProfile';

export { get30DayTrends, getStatistics, getInsights } from './serverAnalytics';

export type { TrendResponse, StatsResponse, InsightsResponse, Insight } from './serverAnalytics';

export {
  exportToCSV,
  exportToJSON,
  exportReport,
  validateCSV,
  importFromCSV,
} from './dataExportImport';

export type { ImportValidationResponse, ImportResponse } from './dataExportImport';
