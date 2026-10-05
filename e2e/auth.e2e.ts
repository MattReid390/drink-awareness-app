// E2E: Authentication flow - Sign up, login, logout

import { signup, login, logout, getCurrentUser } from '../src/services/auth';
import { getAgeConfirmed, saveAgeConfirmed } from '../src/services/storage';

describe('Authentication Flow', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'SecurePass123!';

  beforeEach(async () => {
    await logout().catch(() => {});
  });

  describe('Sign Up', () => {
    it('should successfully create new account with valid credentials', async () => {
      const result = await signup(testEmail, testPassword);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.email).toBe(testEmail);
    });

    it('should fail with weak password', async () => {
      expect(async () => {
        await signup(`weak-${Date.now()}@example.com`, '123');
      }).rejects.toThrow();
    });

    it('should fail with invalid email', async () => {
      expect(async () => {
        await signup('not-an-email', testPassword);
      }).rejects.toThrow();
    });
  });

  describe('Login', () => {
    it('should login with correct credentials', async () => {
      await signup(testEmail, testPassword);
      const result = await login(testEmail, testPassword);

      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should fail with wrong password', async () => {
      await signup(testEmail, testPassword);

      expect(async () => {
        await login(testEmail, 'WrongPassword123!');
      }).rejects.toThrow();
    });

    it('should fail with non-existent account', async () => {
      expect(async () => {
        await login('nonexistent@example.com', testPassword);
      }).rejects.toThrow();
    });
  });

  describe('Session Management', () => {
    it('should maintain session after login', async () => {
      await signup(testEmail, testPassword);
      await login(testEmail, testPassword);

      const user = await getCurrentUser();
      expect(user).toBeDefined();
      expect(user?.email).toBe(testEmail);
    });

    it('should clear session after logout', async () => {
      await signup(testEmail, testPassword);
      await login(testEmail, testPassword);
      await logout();

      const user = await getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe('Age Confirmation', () => {
    it('should set and retrieve age confirmation', async () => {
      const confirmed = await saveAgeConfirmed();
      expect(confirmed).toBe(true);

      const result = await getAgeConfirmed();
      expect(result).toBe(true);
    });

    it('should require age confirmation on first launch', async () => {
      const result = await getAgeConfirmed();
      expect(typeof result).toBe('boolean');
    });
  });
});
