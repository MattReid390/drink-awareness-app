// S20 — User Profile Management
// View and edit user profile (name, email)

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors, Typography, Spacing } from '../constants';
import { useFocusEffect } from '@react-navigation/native';
import { getUserProfile, updateUserProfile } from '../services/userProfile';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface UserData {
  id: string;
  email: string;
  name: string;
  verified: boolean;
}

export const UserProfileScreen: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          setLoading(true);
          const profile = await getUserProfile();
          if (profile) {
            setUser(profile);
            setEditName(profile.name);
            setEditEmail(profile.email);
          }
        } catch (error) {
          console.error('Failed to load profile:', error);
          Alert.alert('Error', 'Failed to load profile');
        } finally {
          setLoading(false);
        }
      };
      loadProfile();
    }, [])
  );

  const handleSave = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert('Validation', 'Name and email are required');
      return;
    }

    try {
      setSaving(true);
      const updated = await updateUserProfile(editName.trim(), editEmail.trim());
      if (updated) {
        setUser(updated);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.blue} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.label}>Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Enter email"
                placeholderTextColor={Colors.textMuted}
                editable={!saving}
              />
            ) : (
              <Text style={styles.value}>{user.email}</Text>
            )}
          </View>

          <View style={[styles.section, styles.borderTop]}>
            <Text style={styles.label}>Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter name"
                placeholderTextColor={Colors.textMuted}
                editable={!saving}
              />
            ) : (
              <Text style={styles.value}>{user.name || 'Not set'}</Text>
            )}
          </View>

          <View style={[styles.section, styles.borderTop]}>
            <Text style={styles.label}>Verification Status</Text>
            <Text style={[styles.value, { color: user.verified ? Colors.green : Colors.orange }]}>
              {user.verified ? '✓ Verified' : 'Pending verification'}
            </Text>
          </View>

          <View style={[styles.section, styles.borderTop]}>
            <Text style={styles.label}>Member Since</Text>
            <Text style={styles.value}>{new Date(user.id).toLocaleDateString()}</Text>
          </View>
        </View>

        {isEditing ? (
          <View style={styles.buttonGroup}>
            <Pressable
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              disabled={saving}
            >
              <Text style={[styles.buttonText, { color: Colors.navy }]}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable style={[styles.button, styles.editButton]} onPress={() => setIsEditing(true)}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </Pressable>
        )}
      </ScrollView>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize.heading,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.navy,
  },
  card: {
    backgroundColor: Colors.surfaceGrey,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  section: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
  },
  label: {
    fontSize: Typography.fontSize.label,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Typography.fontSize.body,
    color: Colors.textPrimary,
  },
  buttonGroup: {
    gap: Spacing.sm,
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: Colors.blue,
  },
  saveButton: {
    backgroundColor: Colors.green,
  },
  cancelButton: {
    backgroundColor: Colors.surfaceGrey,
  },
  buttonText: {
    fontSize: Typography.fontSize.body,
    fontWeight: '600',
    color: Colors.white,
    textAlign: 'center',
  },
  errorText: {
    fontSize: Typography.fontSize.body,
    color: Colors.red,
    textAlign: 'center',
  },
});
