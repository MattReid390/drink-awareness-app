// Health app OAuth authentication service

import * as AuthSession from 'expo-auth-session';
import { Platform } from 'react-native';
import { healthIntegrationService } from './health';

// Google Fit configuration
const GOOGLE_FIT_SCOPES = [
  'https://www.googleapis.com/auth/fitness.activity.read',
  'https://www.googleapis.com/auth/fitness.heart_rate.read',
  'https://www.googleapis.com/auth/fitness.sleep.read',
];

// OAuth2 configuration - these should be configured in your backend
export interface OAuthConfig {
  clientId: string;
  clientSecret?: string;
  redirectUrl: string;
  discoveryUrl?: string;
}

class HealthAuthService {
  private googleOAuthConfig: OAuthConfig | null = null;

  setGoogleOAuthConfig(config: OAuthConfig) {
    this.googleOAuthConfig = config;
  }

  async initiateAppleHealthOAuth(): Promise<void> {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Health is only available on iOS');
    }

    try {
      // In a real implementation, you would:
      // 1. Check if HealthKit framework is available
      // 2. Request appropriate permissions
      // 3. Generate OAuth tokens through your backend OAuth provider

      // For now, we'll use a backend endpoint to initiate OAuth
      const redirectUrl = AuthSession.getRedirectUrl();

      const result = await AuthSession.startAsync({
        authUrl: `http://localhost:3000/oauth/apple-health?redirect_uri=${encodeURIComponent(redirectUrl)}`,
        returnUrl: redirectUrl,
      });

      if (result.type === 'success' && result.params.accessToken) {
        await healthIntegrationService.connectAppleHealth(
          result.params.accessToken,
          result.params.refreshToken,
          parseInt(result.params.expiresIn, 10)
        );
      } else if (result.type === 'cancel') {
        throw new Error('User cancelled Apple Health connection');
      }
    } catch (error) {
      console.error('Apple Health OAuth error:', error);
      throw error;
    }
  }

  async initiateGoogleFitOAuth(): Promise<void> {
    if (Platform.OS !== 'android') {
      throw new Error('Google Fit is only available on Android');
    }

    if (!this.googleOAuthConfig) {
      throw new Error('Google OAuth config not initialized');
    }

    try {
      const redirectUrl = AuthSession.getRedirectUrl();

      const result = await AuthSession.startAsync({
        authUrl:
          `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${this.googleOAuthConfig.clientId}&` +
          `redirect_uri=${encodeURIComponent(redirectUrl)}&` +
          `response_type=code&` +
          `scope=${encodeURIComponent(GOOGLE_FIT_SCOPES.join(' '))}&` +
          `access_type=offline`,
        returnUrl: redirectUrl,
      });

      if (result.type === 'success' && result.params.code) {
        // Exchange code for token via backend
        const tokenResponse = await this.exchangeGoogleAuthCode(result.params.code);

        await healthIntegrationService.connectGoogleFit(
          tokenResponse.accessToken,
          tokenResponse.refreshToken,
          tokenResponse.expiresIn
        );
      } else if (result.type === 'cancel') {
        throw new Error('User cancelled Google Fit connection');
      }
    } catch (error) {
      console.error('Google Fit OAuth error:', error);
      throw error;
    }
  }

  private async exchangeGoogleAuthCode(code: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
  }> {
    // This should be implemented in your backend
    const response = await fetch('http://localhost:3000/oauth/google-fit/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange Google auth code');
    }

    return response.json();
  }
}

export const healthAuthService = new HealthAuthService();
