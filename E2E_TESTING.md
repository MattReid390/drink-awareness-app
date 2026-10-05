# End-to-End Testing Guide

## Overview

This document describes the comprehensive E2E test suite for the Drink Awareness App, validating all major user flows and feature interactions.

## Test Structure

```
e2e/
├── auth.e2e.ts              # Authentication & account management
├── drinking.e2e.ts          # Drink logging, tracking, goals
├── sync.e2e.ts              # Cloud sync, offline, optimistic updates
├── premium.e2e.ts           # Subscriptions, payments, coaching, health
├── deeplink.e2e.ts          # Deep linking, universal links, routing
└── notifications.e2e.ts     # Notifications, achievements, milestones
```

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Suite
```bash
npm test -- e2e/auth.e2e.ts
npm test -- e2e/drinking.e2e.ts
npm test -- e2e/sync.e2e.ts
npm test -- e2e/premium.e2e.ts
npm test -- e2e/deeplink.e2e.ts
npm test -- e2e/notifications.e2e.ts
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

## Test Suites

### 1. Authentication Flow (`auth.e2e.ts`)

**Tests account lifecycle:**
- ✅ Sign up with valid credentials
- ✅ Sign up validation (weak password, invalid email)
- ✅ Login with correct/incorrect password
- ✅ Session persistence
- ✅ Logout and session cleanup
- ✅ Age confirmation on first launch

**Key endpoints:**
- `POST /auth/signup` — Create account
- `POST /auth/login` — Authenticate user
- `POST /auth/logout` — End session
- `GET /auth/me` — Verify session

### 2. Drinking Tracking (`drinking.e2e.ts`)

**Tests drink logging and analytics:**
- ✅ Create new drink entry
- ✅ Retrieve daily log
- ✅ Validate drink data (ABV, quantity, cost)
- ✅ Set and track weekly goals
- ✅ Calculate goal progress
- ✅ Cost analysis
- ✅ Multiple drinks in same day

**Key services:**
- `saveDrink()` — Log a drink
- `getDailyLog()` — View today's drinks
- `getWeeklyLog()` — View week overview
- `getGoalProgress()` — Track goal status
- `getCostAnalysis()` — Spending summary

### 3. Sync & Offline (`sync.e2e.ts`)

**Tests data synchronization:**
- ✅ Optimistic create/update/delete
- ✅ Sync failure rollback
- ✅ Confirm sync completion
- ✅ Change tracking (field-level)
- ✅ Conflict detection with versioning
- ✅ Selective sync (only changed data)
- ✅ Offline detection

**Key components:**
- `optimisticStateManager` — Show changes immediately
- `changeTracker` — Track what changed
- `networkStatusManager` — Detect online/offline
- `syncManager` — Upload changes

### 4. Premium Features (`premium.e2e.ts`)

**Tests payment and premium features:**
- ✅ Retrieve subscription status
- ✅ Create checkout session
- ✅ List payment methods
- ✅ Add/remove payment methods
- ✅ View invoices
- ✅ Generate coaching recommendations
- ✅ Dismiss recommendations
- ✅ Health provider connection
- ✅ Premium feature access control
- ✅ Subscription cancellation

**Key services:**
- `stripeService` — Payment processing
- `claudeCoachingService` — AI coaching
- `healthIntegrationService` — Health data sync

### 5. Deep Linking (`deeplink.e2e.ts`)

**Tests navigation via links:**
- ✅ Parse custom scheme (drinkawareness://)
- ✅ Parse universal links (https://)
- ✅ Generate shareable links
- ✅ Extract route parameters
- ✅ Handle invalid links
- ✅ Route to correct screen
- ✅ Support nested navigation

**Routes tested:**
- `drinkawareness://log-drink` → Log screen
- `drinkawareness://summary` → Summary screen
- `drinkawareness://premium` → Premium screen
- `https://drinkaware.app/drink/123` → Drink detail
- `https://drinkaware.app/venue/456` → Venue detail

### 6. Notifications (`notifications.e2e.ts`)

**Tests notifications and achievements:**
- ✅ Request push notification permissions
- ✅ Register device token
- ✅ Schedule daily reminders
- ✅ Detect milestones (first drink, drink counts, streaks)
- ✅ Track streak data
- ✅ Prevent duplicate achievements
- ✅ Handle permission denials
- ✅ Multiple scheduled notifications

**Achievement types:**
- First drink milestone
- Drinks logged (10, 25, 50, 100, 250, 500)
- Streaks (7, 30, 90, 365 days)

## Test Data Setup

### Mock Authentication
```javascript
const testEmail = `test-${Date.now()}@example.com`;
const testPassword = 'SecurePass123!';

// Auto-cleanup in beforeEach
beforeEach(async () => {
  await logout().catch(() => {});
});
```

### Mock Drinks
```javascript
const drink: Drink = {
  id: uuidv4(),
  type: 'beer',
  abv: 5.0,
  quantity: 12,
  time: new Date().toISOString(),
  venue: 'Test Venue',
  cost: 5.99,
};
```

### Mock Health Data
```javascript
const mockHealthData = {
  stepsToday: 8432,
  sleepHours: 7.5,
  heartRate: 72,
};
```

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- e2e/
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## Performance Baselines

### Test Execution Time
- Auth tests: ~5 seconds
- Drinking tests: ~8 seconds
- Sync tests: ~6 seconds
- Premium tests: ~7 seconds
- Deep link tests: ~4 seconds
- Notification tests: ~5 seconds

**Total suite: ~35 seconds**

## Known Limitations

❌ **Not covered:**
- Actual Stripe payment processing (uses mock endpoints)
- Real Apple Health/Google Fit OAuth (mocked)
- Push notification delivery (local only)
- UI rendering and animations
- Network latency scenarios
- Memory/performance profiling

✅ **For production testing:**
- Use Detox for native UI testing
- Use BrowserStack for real devices
- Set up staging backend for Stripe testing
- Use actual health OAuth providers
- Monitor app performance metrics

## Debugging Tests

### Enable Debug Logging
```bash
DEBUG=* npm test
```

### Run Single Test
```bash
npm test -- auth.e2e.ts -t "should successfully create new account"
```

### Verbose Output
```bash
npm test -- --verbose
```

### Coverage for Specific File
```bash
npm run test:coverage -- e2e/sync.e2e.ts
```

## Future Enhancements

- [ ] Detox integration for native UI testing
- [ ] Visual regression testing
- [ ] Performance benchmarking
- [ ] API contract testing
- [ ] Database state validation
- [ ] Network failure simulations
- [ ] Cross-device testing
- [ ] Accessibility testing

## Maintenance

### Weekly
- Run full test suite
- Check for flaky tests
- Review coverage changes

### Monthly
- Update mock data
- Add tests for new features
- Refactor duplicated test code
- Review performance baselines

### Quarterly
- Evaluate new testing tools
- Update test documentation
- Plan future test coverage
- Archive old test data
