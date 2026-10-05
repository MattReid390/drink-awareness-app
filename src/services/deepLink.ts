// Deep link parsing and routing service
// Handles drinkawareness:// URI scheme and https:// universal links

export interface DeepLinkData {
  route: string;
  params?: Record<string, any>;
  error?: string;
}

class DeepLinkManager {
  parseDeepLink(url: string): DeepLinkData {
    try {
      if (!url) {
        return { route: 'MainTabs', error: 'Empty URL' };
      }

      const uri = new URL(url);

      // Handle drinkawareness:// custom scheme
      if (uri.protocol === 'drinkawareness:') {
        return this.handleCustomScheme(uri);
      }

      // Handle https:// universal links
      if (uri.protocol === 'https:' || uri.protocol === 'http:') {
        return this.handleUniversalLink(uri);
      }

      return { route: 'MainTabs', error: 'Unknown protocol' };
    } catch (error) {
      console.error('Failed to parse deep link:', error);
      return { route: 'MainTabs', error: 'Invalid URL format' };
    }
  }

  private handleCustomScheme(uri: URL): DeepLinkData {
    const path = uri.hostname || uri.pathname.slice(1);
    const params = Object.fromEntries(uri.searchParams);

    switch (path) {
      case 'log-drink':
        return {
          route: 'LogDrink',
          params: {
            prefillDrink: params.drinkId ? { id: params.drinkId } : undefined,
          },
        };

      case 'view-drink':
        return {
          route: 'MainTabs',
          params: {
            screen: 'Log',
            params: {
              screen: 'LogDrink',
              params: { drinkId: params.drinkId },
            },
          },
        };

      case 'venue':
        return {
          route: 'MainTabs',
          params: {
            screen: 'Venues',
            params: {
              screen: 'VenueDetail',
              params: { venue: { id: params.venueId } },
            },
          },
        };

      case 'summary':
        return {
          route: 'MainTabs',
          params: {
            screen: 'Summary',
            params: {
              screen: 'WeeklySummary',
            },
          },
        };

      case 'goal':
        return {
          route: 'MainTabs',
          params: {
            screen: 'Summary',
            params: {
              screen: 'GoalProgress',
            },
          },
        };

      case 'premium':
        return {
          route: 'MainTabs',
          params: {
            screen: 'Summary',
            params: {
              screen: 'Premium',
            },
          },
        };

      case 'coaching':
        return {
          route: 'MainTabs',
          params: {
            screen: 'Summary',
            params: {
              screen: 'Coaching',
            },
          },
        };

      case 'health':
        return {
          route: 'MainTabs',
          params: {
            screen: 'Summary',
            params: {
              screen: 'HealthIntegration',
            },
          },
        };

      case 'settings':
        return {
          route: 'MainTabs',
          params: {
            screen: 'Settings',
          },
        };

      default:
        return {
          route: 'MainTabs',
          error: `Unknown route: ${path}`,
        };
    }
  }

  private handleUniversalLink(uri: URL): DeepLinkData {
    const pathname = uri.pathname;

    // Parse: /drink/:id
    const drinkMatch = pathname.match(/^\/drink\/([a-f0-9-]+)$/i);
    if (drinkMatch) {
      return {
        route: 'MainTabs',
        params: {
          screen: 'Log',
          params: {
            screen: 'LogDrink',
            params: { drinkId: drinkMatch[1] },
          },
        },
      };
    }

    // Parse: /venue/:id
    const venueMatch = pathname.match(/^\/venue\/([a-f0-9-]+)$/i);
    if (venueMatch) {
      return {
        route: 'MainTabs',
        params: {
          screen: 'Venues',
          params: {
            screen: 'VenueDetail',
            params: { venue: { id: venueMatch[1] } },
          },
        },
      };
    }

    // Parse: /summary
    if (pathname === '/summary') {
      return {
        route: 'MainTabs',
        params: {
          screen: 'Summary',
          params: {
            screen: 'WeeklySummary',
          },
        },
      };
    }

    // Parse: /premium
    if (pathname === '/premium') {
      return {
        route: 'MainTabs',
        params: {
          screen: 'Summary',
          params: {
            screen: 'Premium',
          },
        },
      };
    }

    return {
      route: 'MainTabs',
      error: `Unknown path: ${pathname}`,
    };
  }

  validateDeepLink(url: string): boolean {
    try {
      const data = this.parseDeepLink(url);
      return !data.error && data.route !== 'MainTabs';
    } catch {
      return false;
    }
  }

  generateDeepLink(route: string, params?: Record<string, any>): string {
    const base = 'drinkawareness://';

    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.set(key, String(value));
        }
      });
    }

    const query = queryParams.toString();
    return `${base}${route}${query ? `?${query}` : ''}`;
  }
}

export const deepLinkManager = new DeepLinkManager();
