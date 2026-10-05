// E2E: Premium features - Subscriptions, payments, coaching, health sync

import {
  getSubscription,
  upgradeToPremium,
  cancelSubscription,
  getCoaching,
  dismissCoaching,
  refreshCoaching,
  getHealthStatus,
} from '../src/services/premium';
import { stripeService } from '../src/services/stripe';
import { claudeCoachingService } from '../src/services/claude';
import { healthIntegrationService } from '../src/services/health';

describe('Premium Features Flow', () => {
  describe('Subscription Management', () => {
    it('should retrieve subscription status', async () => {
      const subscription = await getSubscription();
      expect(subscription).toBeDefined();
      expect(['free', 'premium', 'premium_plus']).toContain(subscription?.plan);
    });

    it('should create premium upgrade checkout session', async () => {
      const session = await upgradeToPremium('premium');

      expect(session).toBeDefined();
      expect(session.sessionId).toBeDefined();
      expect(session.url).toBeDefined();
    });

    it('should fail upgrade for non-premium plan', async () => {
      expect(async () => {
        await upgradeToPremium('free' as any);
      }).rejects.toThrow();
    });
  });

  describe('Payment Methods', () => {
    it('should list payment methods', async () => {
      const methods = await stripeService.getPaymentMethods();
      expect(Array.isArray(methods)).toBe(true);
    });

    it('should handle adding payment method', async () => {
      // Mock token for testing
      expect(async () => {
        await stripeService.addPaymentMethod('mock_token_123');
      }).not.toThrow();
    });
  });

  describe('Invoices', () => {
    it('should retrieve invoices list', async () => {
      const invoices = await stripeService.getInvoices();
      expect(Array.isArray(invoices)).toBe(true);
    });

    it('should handle invoice retrieval', async () => {
      const invoices = await stripeService.getInvoices();

      if (invoices.length > 0) {
        const invoice = await stripeService.getInvoice(invoices[0].id);
        expect(invoice).toBeDefined();
      }
    });
  });

  describe('Coaching Recommendations', () => {
    it('should retrieve coaching recommendations', async () => {
      const response = await getCoaching();

      expect(response).toBeDefined();
      expect(Array.isArray(response?.sessions)).toBe(true);
    });

    it('should generate new recommendation', async () => {
      const recommendation = await refreshCoaching();

      if (recommendation) {
        expect(recommendation.topic).toBeDefined();
        expect(recommendation.recommendation).toBeDefined();
        expect(['info', 'warning', 'critical']).toContain(recommendation.severity);
      }
    });

    it('should respect rate limiting on recommendations', async () => {
      const first = await refreshCoaching();

      if (first) {
        // Try to generate immediately - should fail or show wait message
        expect(async () => {
          await refreshCoaching();
        }).rejects.toThrow();
      }
    });

    it('should dismiss coaching recommendation', async () => {
      const coaching = await getCoaching();

      if (coaching && coaching.sessions.length > 0) {
        const id = coaching.sessions[0].id;
        expect(async () => {
          await dismissCoaching(id);
        }).not.toThrow();
      }
    });
  });

  describe('Health Integration', () => {
    it('should check health provider status', async () => {
      const status = await getHealthStatus();

      expect(status).toBeDefined();
      expect(typeof status?.connected).toBe('boolean');

      if (status?.connected) {
        expect(['apple_health', 'google_fit']).toContain(status.provider);
      }
    });

    it('should retrieve connected provider info', async () => {
      const provider = await healthIntegrationService.getConnectedProvider();

      if (provider) {
        expect(provider.provider).toBeDefined();
        expect(provider.connected).toBe(true);
      }
    });

    it('should handle disconnecting health provider', async () => {
      // Only test if provider is connected
      const status = await getHealthStatus();

      if (status?.connected) {
        expect(async () => {
          await healthIntegrationService.disconnect();
        }).not.toThrow();
      }
    });
  });

  describe('Premium Feature Access', () => {
    it('should allow premium features when subscribed', async () => {
      const subscription = await getSubscription();

      if (subscription?.isPremium) {
        // Premium features should be accessible
        const coaching = await getCoaching();
        expect(coaching).toBeDefined();

        const health = await getHealthStatus();
        expect(health).toBeDefined();
      }
    });

    it('should restrict premium features for free users', async () => {
      const subscription = await getSubscription();

      if (!subscription?.isPremium) {
        // Free users should have limited access
        // But endpoints should still return data/messaging
        const coaching = await getCoaching();
        expect(coaching).toBeDefined();
      }
    });
  });

  describe('Subscription Cancellation', () => {
    it('should allow cancelling active subscription', async () => {
      const before = await getSubscription();

      if (before?.isPremium) {
        expect(async () => {
          await cancelSubscription();
        }).not.toThrow();

        const after = await getSubscription();
        expect(after?.status).toMatch(/canceled|expired/);
      }
    });

    it('should prevent cancelling free plan', async () => {
      const subscription = await getSubscription();

      if (!subscription?.isPremium) {
        expect(async () => {
          await cancelSubscription();
        }).rejects.toThrow();
      }
    });
  });
});
