// Stripe payment processing service
import { api } from './api';

export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
  clientSecret?: string;
}

export interface StripeSubscriptionUpdate {
  subscriptionId: string;
  status: 'active' | 'past_due' | 'canceled' | 'unpaid';
  currentPeriodEnd: string;
  cancelAt?: string;
}

export interface StripePaymentIntent {
  clientSecret: string;
  status: 'succeeded' | 'processing' | 'requires_action' | 'requires_payment_method';
}

class StripeService {
  async createCheckoutSession(plan: 'premium' | 'premium_plus'): Promise<StripeCheckoutSession> {
    try {
      const response = await api.post<StripeCheckoutSession>('/stripe/checkout-session', {
        plan,
        successUrl: 'drinkawareness://payment-success',
        cancelUrl: 'drinkawareness://payment-cancel',
      });
      return response;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      throw new Error('Failed to create payment session');
    }
  }

  async handleCheckoutSuccess(sessionId: string): Promise<void> {
    try {
      await api.post('/stripe/checkout-session/confirm', {
        sessionId,
      });
    } catch (error) {
      console.error('Failed to confirm checkout:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  async getPaymentMethods(): Promise<any[]> {
    try {
      return await api.get<any[]>('/stripe/payment-methods');
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      return [];
    }
  }

  async addPaymentMethod(token: string): Promise<any> {
    try {
      return await api.post('/stripe/payment-methods', {
        token,
      });
    } catch (error) {
      console.error('Failed to add payment method:', error);
      throw new Error('Failed to save payment method');
    }
  }

  async updateDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await api.post('/stripe/payment-methods/default', {
        paymentMethodId,
      });
    } catch (error) {
      console.error('Failed to update default payment method:', error);
      throw new Error('Failed to update payment method');
    }
  }

  async removePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      await api.delete(`/stripe/payment-methods/${paymentMethodId}`);
    } catch (error) {
      console.error('Failed to remove payment method:', error);
      throw new Error('Failed to remove payment method');
    }
  }

  async retryFailedPayment(subscriptionId: string): Promise<StripePaymentIntent> {
    try {
      return await api.post<StripePaymentIntent>('/stripe/retry-payment', {
        subscriptionId,
      });
    } catch (error) {
      console.error('Failed to retry payment:', error);
      throw new Error('Failed to retry payment');
    }
  }

  async getInvoices(): Promise<any[]> {
    try {
      return await api.get<any[]>('/stripe/invoices');
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      return [];
    }
  }

  async getInvoice(invoiceId: string): Promise<any> {
    try {
      return await api.get<any>(`/stripe/invoices/${invoiceId}`);
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      throw new Error('Failed to fetch invoice');
    }
  }
}

export const stripeService = new StripeService();
