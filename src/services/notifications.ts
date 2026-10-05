// Push notifications and device token management

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api';
import { DeviceToken } from '../types/notification';

const DEVICE_TOKEN_KEY = 'push_notification_device_token';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationsManager {
  async requestPermissions(): Promise<boolean> {
    try {
      if (!Device.isDevice) {
        return false;
      }

      const result = await Notifications.getPermissionsAsync();
      const existingStatus = (result as any).status;

      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const result2 = await Notifications.requestPermissionsAsync();
        const status = (result2 as any).status;
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  }

  async getDeviceToken(): Promise<string | null> {
    try {
      // Check if we have cached token
      const cached = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Refresh token daily
        const lastUpdated = new Date(parsed.lastUpdated);
        const daysSinceUpdate = Math.floor(
          (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceUpdate < 1) {
          return parsed.token;
        }
      }

      if (!Device.isDevice) {
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync();
      const deviceToken: DeviceToken = {
        token: token.data,
        platform: Device.osName === 'iOS' ? 'ios' : 'android',
        lastUpdated: new Date().toISOString(),
      };

      await AsyncStorage.setItem(DEVICE_TOKEN_KEY, JSON.stringify(deviceToken));
      return token.data;
    } catch (error) {
      console.error('Failed to get device token:', error);
      return null;
    }
  }

  async registerDeviceToken(): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      const token = await this.getDeviceToken();
      if (!token) {
        return false;
      }

      // Register with backend
      await api.post('/api/notifications/register-device', {
        token,
        platform: Device.osName === 'iOS' ? 'ios' : 'android',
      });

      return true;
    } catch (error) {
      console.error('Failed to register device token:', error);
      return false;
    }
  }

  subscribeToNotifications(
    handler: (_notification: Notifications.Notification) => void
  ): () => void {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      handler(response.notification);
    });

    return () => subscription.remove();
  }

  subscribeToIncomingNotifications(
    handler: (_notification: Notifications.Notification) => void
  ): () => void {
    const subscription = Notifications.addNotificationReceivedListener((_notification) => {
      handler(_notification);
    });

    return () => subscription.remove();
  }
}

export const notificationsManager = new NotificationsManager();
