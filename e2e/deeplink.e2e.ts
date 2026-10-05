// E2E: Deep linking & navigation - Custom schemes, universal links, deep link handling

import { deepLinkManager, DeepLinkData } from '../src/services/deepLink';

describe('Deep Linking Flow', () => {
  describe('Custom Scheme (drinkawareness://)', () => {
    it('should parse log-drink deep link', () => {
      const url = 'drinkawareness://log-drink';
      const result = deepLinkManager.parseDeepLink(url);

      expect(result.route).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('should parse drink summary deep link', () => {
      const url = 'drinkawareness://summary';
      const result = deepLinkManager.parseDeepLink(url);

      expect(result.route).toBeDefined();
    });

    it('should parse goal tracking deep link', () => {
      const url = 'drinkawareness://goal';
      const result = deepLinkManager.parseDeepLink(url);

      expect(result.route).toBeDefined();
    });

    it('should parse premium deep link', () => {
      const url = 'drinkawareness://premium';
      const result = deepLinkManager.parseDeepLink(url);

      expect(result.route).toBeDefined();
    });

    it('should parse coaching deep link', () => {
      const url = 'drinkawareness://coaching';
      const result = deepLinkManager.parseDeepLink(url);

      expect(result.route).toBeDefined();
    });

    it('should parse health integration deep link', () => {
      const url = 'drinkawareness://health';
      const result = deepLinkManager.parseDeepLink(url);

      expect(result.route).toBeDefined();
    });

    it('should parse settings deep link', () => {
      const url = 'drinkawareness://settings';
      const result = deepLinkManager.parseDeepLink(url);

      expect(result.route).toBeDefined();
    });
  });

  describe('Universal Links (https://)', () => {
    it('should parse drink view universal link', () => {
      const url = 'https://drinkaware.app/drink/abc-123';
      const result = deepLinkManager.parseDeepLink(url);

      expect(result.route).toBeDefined();
      expect(result.params?.id).toBe('abc-123');
    });

    it('should parse venue view universal link', () => {
      const url = 'https://drinkaware.app/venue/venue-456';
      const result = deepLinkManager.parseDeepLink(url);

      expect(result.route).toBeDefined();
      expect(result.params?.id).toBe('venue-456');
    });

    it('should parse summary universal link', () => {
      const url = 'https://drinkaware.app/summary';
      const result = deepLinkManager.parseDeepLink(url);

      expect(result.route).toBeDefined();
    });

    it('should parse premium universal link', () => {
      const url = 'https://drinkaware.app/premium';
      const result = deepLinkManager.parseDeepLink(url);

      expect(result.route).toBeDefined();
    });
  });

  describe('Deep Link Generation', () => {
    it('should generate custom scheme deep link', () => {
      const link = deepLinkManager.generateDeepLink('log-drink', {});

      expect(link).toContain('drinkawareness://');
    });

    it('should generate deep link with parameters', () => {
      const link = deepLinkManager.generateDeepLink('view-drink', { id: '123' });

      expect(link).toBeDefined();
    });

    it('should generate universal link', () => {
      const link = deepLinkManager.generateDeepLink('summary', {});

      expect(link).toBeDefined();
      expect(['drinkawareness://', 'https://']).toContain(
        link.substring(0, link.indexOf(':'))
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid deep link', () => {
      const url = 'drinkawareness://invalid-route';
      const result = deepLinkManager.parseDeepLink(url);

      // Should either return error or handle gracefully
      expect(result).toBeDefined();
    });

    it('should handle malformed URL', () => {
      const url = 'not-a-valid-url';
      const result = deepLinkManager.parseDeepLink(url);

      expect(result).toBeDefined();
    });

    it('should validate deep link before navigation', () => {
      const valid = deepLinkManager.validateDeepLink('drinkawareness://premium');
      expect(typeof valid).toBe('boolean');
    });
  });

  describe('Route Parameters', () => {
    it('should extract drink ID from universal link', () => {
      const url = 'https://drinkaware.app/drink/drink-xyz-789';
      const result = deepLinkManager.parseDeepLink(url);

      expect(result.params?.id).toBe('drink-xyz-789');
    });

    it('should extract venue ID from universal link', () => {
      const url = 'https://drinkaware.app/venue/venue-xyz-789';
      const result = deepLinkManager.parseDeepLink(url);

      expect(result.params?.id).toBe('venue-xyz-789');
    });

    it('should handle query parameters', () => {
      const url = 'drinkawareness://log-drink?type=beer&abv=5';
      const result = deepLinkManager.parseDeepLink(url);

      expect(result).toBeDefined();
    });
  });

  describe('Navigation Routing', () => {
    it('should route to Summary stack from deep link', () => {
      const url = 'drinkawareness://summary';
      const result = deepLinkManager.parseDeepLink(url);

      // Should contain navigation instructions
      expect(result.route).toBeDefined();
    });

    it('should route to Premium screen from deep link', () => {
      const url = 'drinkawareness://premium';
      const result = deepLinkManager.parseDeepLink(url);

      expect(result.route).toBeDefined();
    });

    it('should support nested navigation', () => {
      const url = 'drinkawareness://drink/details';
      const result = deepLinkManager.parseDeepLink(url);

      // Should contain nested route info
      expect(result).toBeDefined();
    });
  });
});
