// Local notification scheduling and management

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationPreferences } from '../types/notification';

const PREFERENCES_KEY = 'notification_preferences';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  weeklyGoalAlerts: true,
  streakAlerts: true,
  dailyReminders: true,
  dailyReminderTime: '09:00',
  milestoneCelebrations: true,
};

class LocalNotificationsManager {
  async getPreferences(): Promise<NotificationPreferences> {
    try {
      const data = await AsyncStorage.getItem(PREFERENCES_KEY);
      return data ? JSON.parse(data) : DEFAULT_PREFERENCES;
    } catch (error) {
      return DEFAULT_PREFERENCES;
    }
  }

  async updatePreferences(
    prefs: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const current = await this.getPreferences();
    const updated = { ...current, ...prefs };
    await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
    return updated;
  }

  async scheduleDailyReminder(time: string): Promise<void> {
    try {
      const [hours, minutes] = time.split(':').map(Number);
      const now = new Date();
      const scheduledTime = new Date(now);
      scheduledTime.setHours(hours, minutes, 0, 0);

      // If time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const trigger = {
        type: 'daily' as const,
        hour: hours,
        minute: minutes,
      };

      await Notifications.scheduleNotificationAsync({
        identifier: 'daily_reminder',
        content: {
          title: '📝 Log your drinks',
          body: 'Time to record your drinks from last night',
          data: {
            type: 'daily_reminder',
            deepLink: 'drinkawareness://log-drink',
          },
        },
        trigger,
      });
    } catch (error) {
      console.error('Failed to schedule daily reminder:', error);
    }
  }

  async scheduleStreakMilestone(milestone: number): Promise<void> {
    const trigger = 5; // 5 seconds for demo

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔥 Streak Achievement!',
        body: `You've reached a ${milestone}-day logging streak!`,
        data: {
          type: 'streak_milestone',
          value: milestone.toString(),
          deepLink: 'drinkawareness://summary',
        },
      },
      trigger,
    });
  }

  async scheduleWeeklyGoalAlert(): Promise<void> {
    const trigger = 5; // 5 seconds for demo

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎯 Weekly Goal Achieved',
        body: "Great work! You've hit your weekly drinking goal.",
        data: {
          type: 'weekly_goal_achieved',
          deepLink: 'drinkawareness://summary',
        },
      },
      trigger,
    });
  }

  async scheduleMilestoneNotification(milestone: string, value: number): Promise<void> {
    const messages: Record<string, string> = {
      first_drink: '🎉 You logged your first drink!',
      drinks_logged_10: `🎊 You've logged ${value} drinks!`,
      drinks_logged_25: `🎊 You've logged ${value} drinks!`,
      drinks_logged_50: `🎊 You've logged ${value} drinks!`,
      drinks_logged_100: `🎊 You've logged ${value} drinks!`,
      drinks_logged_250: `🎊 You've logged ${value} drinks!`,
      drinks_logged_500: `🎊 You've logged ${value} drinks!`,
    };

    const message = messages[`${milestone}_${value}`] || messages[milestone];

    if (message) {
      const trigger = 5; // 5 seconds for demo

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Achievement Unlocked',
          body: message,
          data: {
            type: 'milestone_achievement',
            milestone,
            value: value.toString(),
            deepLink: 'drinkawareness://summary',
          },
        },
        trigger,
      });
    }
  }

  async cancelReminder(identifier: string): Promise<void> {
    try {
      // Cancel all notifications with this identifier
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      const toCancel = notifications.filter((n) => n.identifier === identifier);

      for (const notification of toCancel) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier as string);
      }
    } catch (error) {
      console.error('Failed to cancel reminder:', error);
    }
  }
}

export const localNotificationsManager = new LocalNotificationsManager();
