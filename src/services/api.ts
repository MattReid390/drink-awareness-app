import { getAuthToken, refreshAuthToken } from './auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiRequestOptions {
  requiresAuth?: boolean;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: string;
}

interface ApiResponse<T> {
  data: T;
  status: number;
}

class ApiClient {
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (_token: string) => void;
    reject: (_error: Error) => void;
  }> = [];

  private processQueue = (_token: string, _error?: Error) => {
    this.failedQueue.forEach((prom) => {
      if (_error) {
        prom.reject(_error);
      } else {
        prom.resolve(_token);
      }
    });

    this.isRefreshing = false;
    this.failedQueue = [];
  };

  async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    const requiresAuth = options.requiresAuth !== false;
    const url = `${API_URL}${endpoint}`;

    try {
      const headers = new Headers(options.headers || {});
      headers.set('Content-Type', 'application/json');

      if (requiresAuth) {
        const token = await getAuthToken();
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401 && requiresAuth) {
        return this.handleUnauthorized<T>(endpoint, options);
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.error(`API request failed (${endpoint}):`, error);
      throw error;
    }
  }

  private async handleUnauthorized<T>(
    endpoint: string,
    options: ApiRequestOptions
  ): Promise<ApiResponse<T>> {
    if (this.isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      }).then((token) => this.retryRequest<T>(endpoint, options, token));
    }

    this.isRefreshing = true;

    const newToken = await refreshAuthToken();
    if (!newToken) {
      this.processQueue('', new Error('Token refresh failed'));
      throw new Error('Authentication failed');
    }

    this.processQueue(newToken);
    return this.retryRequest<T>(endpoint, options, newToken);
  }

  private async retryRequest<T>(
    endpoint: string,
    options: ApiRequestOptions,
    token: string
  ): Promise<ApiResponse<T>> {
    const url = `${API_URL}${endpoint}`;
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    headers.set('Authorization', `Bearer ${token}`);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return { data, status: response.status };
  }

  async get<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    const { data } = await this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
    return data;
  }

  async post<T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T> {
    const { data } = await this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
    return data;
  }

  async put<T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T> {
    const { data } = await this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
    return data;
  }

  async delete<T>(endpoint: string, options?: ApiRequestOptions): Promise<T> {
    const { data } = await this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
    return data;
  }

  async patch<T>(endpoint: string, body?: any, options?: ApiRequestOptions): Promise<T> {
    const { data } = await this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
    return data;
  }
}

export const api = new ApiClient();
