// Notification type definitions

export type NotificationType =
  | 'weekly_goal_achieved'
  | 'streak_milestone'
  | 'daily_reminder'
  | 'milestone_achievement'
  | 'achievement_earned';

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, string>;
  deepLink?: string;
}

export interface DeviceToken {
  token: string;
  platform: 'ios' | 'android' | 'web';
  lastUpdated: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  weeklyGoalAlerts: boolean;
  streakAlerts: boolean;
  dailyReminders: boolean;
  dailyReminderTime: string; // HH:MM format
  milestoneCelebrations: boolean;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLoggedDate: string;
}

export interface MilestoneEvent {
  type: 'first_drink' | 'drinks_logged' | 'weekly_goal' | 'streak_milestone';
  value: number;
  achieved: boolean;
}
