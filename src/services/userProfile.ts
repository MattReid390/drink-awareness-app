import { api } from './api';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  createdAt: string;
}

export interface UserSettings {
  dailyLimitUnits: number;
  weeklyLimitUnits: number;
  notificationsEnabled: boolean;
  darkMode: boolean;
  preferredUnits: string;
}

export interface UserWithSettings extends UserProfile {
  settings: UserSettings;
}

export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    return await api.get<UserProfile>('/users/me');
  } catch (error) {
    console.error('Failed to get user profile:', error);
    return null;
  }
};

export const getUserWithSettings = async (): Promise<UserWithSettings | null> => {
  try {
    return await api.get<UserWithSettings>('/users/me');
  } catch (error) {
    console.error('Failed to get user with settings:', error);
    return null;
  }
};

export const updateUserProfile = async (
  name?: string,
  email?: string
): Promise<UserProfile | null> => {
  try {
    const updates: Record<string, string> = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;

    if (Object.keys(updates).length === 0) return null;

    return await api.patch<UserProfile>('/users/me', updates);
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};

export const getUserSettings = async (): Promise<UserSettings | null> => {
  try {
    return await api.get<UserSettings>('/users/settings');
  } catch (error) {
    console.error('Failed to get user settings:', error);
    return null;
  }
};

export const updateUserSettings = async (
  settings: Partial<UserSettings>
): Promise<UserSettings | null> => {
  try {
    return await api.patch<UserSettings>('/users/settings', settings);
  } catch (error) {
    console.error('Failed to update user settings:', error);
    throw error;
  }
};
