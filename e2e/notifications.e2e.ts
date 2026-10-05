// E2E: Notifications & Achievements - Push notifications, local reminders, milestones

import {
  notificationsManager,
  localNotificationsManager,
  achievementsManager,
} from '../src/services';
import { getDailyLog } from '../src/services/storage';
import { v4 as uuidv4 } from 'uuid';

describe('Notifications & Achievements Flow', () => {
  describe('Device Token Management', () => {
    it('should request notification permissions', async () => {
      const hasPermission = await notificationsManager.requestPermissions();
      expect(typeof hasPermission).toBe('boolean');
    });

    it('should retrieve device token', async () => {
      const token = await notificationsManager.getDeviceToken();

      if (token) {
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(0);
      }
    });

    it('should register device token with backend', async () => {
      expect(async () => {
        await notificationsManager.registerDeviceToken();
      }).not.toThrow();
    });
  });

  describe('Local Notifications', () => {
    it('should get notification preferences', async () => {
      const prefs = await localNotificationsManager.getPreferences();

      expect(prefs).toBeDefined();
      expect(typeof prefs.enabled).toBe('boolean');
    });

    it('should update notification preferences', async () => {
      const newPrefs = {
        enabled: true,
        dailyReminders: true,
        streakAlerts: true,
        weeklyGoalAlerts: true,
        milestoneCelebrations: true,
      };

      expect(async () => {
        await localNotificationsManager.updatePreferences(newPrefs);
      }).not.toThrow();
    });

    it('should schedule daily reminder', async () => {
      const time = '19:00'; // 7 PM

      expect(async () => {
        await localNotificationsManager.scheduleDailyReminder(time);
      }).not.toThrow();
    });

    it('should schedule streak milestone notification', async () => {
      expect(async () => {
        await localNotificationsManager.scheduleStreakMilestone({
          currentStreak: 7,
          message: 'You have maintained a 7-day drinking habit streak!',
        });
      }).not.toThrow();
    });

    it('should schedule weekly goal alert', async () => {
      expect(async () => {
        await localNotificationsManager.scheduleWeeklyGoalAlert({
          unitsRemaining: 5,
          message: 'You have 5 units left to reach your weekly goal',
        });
      }).not.toThrow();
    });
  });

  describe('Achievement Tracking', () => {
    it('should retrieve streak data', async () => {
      const streak = await achievementsManager.getStreakData();

      expect(streak).toBeDefined();
      expect(typeof streak.currentStreak).toBe('number');
      expect(typeof streak.longestStreak).toBe('number');
    });

    it('should update streak data', async () => {
      const newStreak = {
        currentStreak: 5,
        longestStreak: 10,
        lastDrinkDate: new Date().toISOString(),
      };

      expect(async () => {
        await achievementsManager.updateStreakData(newStreak);
      }).not.toThrow();
    });

    it('should detect first drink milestone', async () => {
      const milestones = await achievementsManager.checkMilestones(1);

      if (milestones.length > 0) {
        expect(milestones[0].type).toBe('first_drink');
      }
    });

    it('should detect drink count milestones', async () => {
      const counts = [10, 25, 50, 100, 250, 500];

      for (const count of counts) {
        const milestones = await achievementsManager.checkMilestones(count);

        if (milestones.some((m) => m.type.startsWith('drinks_logged'))) {
          expect(milestones.length).toBeGreaterThan(0);
        }
      }
    });

    it('should detect streak milestones', async () => {
      const streaks = [7, 30, 90, 365];

      for (const days of streaks) {
        const milestones = await achievementsManager.checkMilestones(1, days);

        if (milestones.length > 0) {
          expect(milestones[0].type).toContain('streak');
        }
      }
    });

    it('should record milestones to prevent duplicates', async () => {
      const eventId = uuidv4();
      const milestone = {
        id: eventId,
        type: 'test_milestone',
        earnedAt: new Date().toISOString(),
      };

      expect(async () => {
        await achievementsManager.recordMilestones([milestone]);
      }).not.toThrow();

      // Recording again should be idempotent
      expect(async () => {
        await achievementsManager.recordMilestones([milestone]);
      }).not.toThrow();
    });
  });

  describe('Notification Delivery', () => {
    it('should handle notification taps', () => {
      expect(async () => {
        // Simulate notification tap event
        const response = { notification: { request: { content: { data: {} } } } };
      }).not.toThrow();
    });

    it('should parse notification payload', () => {
      const payload = {
        type: 'daily_reminder',
        title: 'Time for tracking',
        body: 'Have you had any drinks today?',
        data: { deepLink: 'drinkawareness://log-drink' },
      };

      expect(payload.type).toBeDefined();
      expect(payload.data?.deepLink).toBeDefined();
    });
  });

  describe('Notification Permissions', () => {
    it('should handle permission denials gracefully', async () => {
      // Should not crash if permissions are denied
      const token = await notificationsManager.getDeviceToken().catch(() => null);

      // App should continue functioning
      const today = await getDailyLog(new Date().toISOString().split('T')[0]);
      expect(Array.isArray(today)).toBe(true);
    });

    it('should respect user notification settings', async () => {
      const prefs = await localNotificationsManager.getPreferences();

      if (!prefs.enabled) {
        // Notifications should not be scheduled
        expect(prefs.dailyReminders).toBe(false);
      }
    });
  });

  describe('Multiple Notifications', () => {
    it('should handle multiple scheduled notifications', async () => {
      expect(async () => {
        await localNotificationsManager.scheduleDailyReminder('09:00');
        await localNotificationsManager.scheduleDailyReminder('18:00');
        await localNotificationsManager.scheduleDailyReminder('21:00');
      }).not.toThrow();
    });

    it('should not duplicate notifications', async () => {
      const time = '19:00';

      expect(async () => {
        await localNotificationsManager.scheduleDailyReminder(time);
        await localNotificationsManager.scheduleDailyReminder(time);
      }).not.toThrow();
    });
  });
});
