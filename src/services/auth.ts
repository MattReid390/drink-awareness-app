import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

interface AuthCredentials {
  email: string;
  password: string;
}

interface SignUpData extends AuthCredentials {
  name?: string;
}

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export const signup = async (data: SignUpData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const authResponse: AuthResponse = await response.json();
    await storeAuthTokens(authResponse.token, authResponse.refreshToken);
    return authResponse;
  } catch (error) {
    console.error('Signup failed:', error);
    throw error;
  }
};

export const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const authResponse: AuthResponse = await response.json();
    await storeAuthTokens(authResponse.token, authResponse.refreshToken);
    return authResponse;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const token = await getAuthToken();
    if (token) {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Logout request failed:', error);
  } finally {
    await clearAuthTokens();
  }
};

export const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      await clearAuthTokens();
      return null;
    }

    const data: AuthResponse = await response.json();
    await storeAuthTokens(data.token, data.refreshToken);
    return data.token;
  } catch (error) {
    console.error('Token refresh failed:', error);
    await clearAuthTokens();
    return null;
  }
};

export const verifyEmail = async (token: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('Email verification failed:', error);
    throw error;
  }
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/request-password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('Password reset request failed:', error);
    throw error;
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
};

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('daa:auth_token');
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('daa:refresh_token');
  } catch (error) {
    console.error('Failed to get refresh token:', error);
    return null;
  }
};

const storeAuthTokens = async (token: string, refreshToken: string): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      ['daa:auth_token', token],
      ['daa:refresh_token', refreshToken],
      ['daa:authenticated', 'true'],
    ]);
  } catch (error) {
    console.error('Failed to store auth tokens:', error);
    throw error;
  }
};

const clearAuthTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(['daa:auth_token', 'daa:refresh_token', 'daa:authenticated']);
  } catch (error) {
    console.error('Failed to clear auth tokens:', error);
    throw error;
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getAuthToken();
    return !!token;
  } catch (error) {
    console.error('Failed to check authentication status:', error);
    return false;
  }
};

export const getCurrentUser = async (): Promise<any> => {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        await clearAuthTokens();
      }
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};
