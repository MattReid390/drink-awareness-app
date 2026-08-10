# Testing Strategy — Phase 6

**Status:** Planning (Jest setup deferred due to dependency conflicts)  
**Priority:** After real data integration  
**Target:** 60% coverage before production release

---

## Recommended Testing Stack

**Unit Testing:**
- **Jest 30.x** with React Native preset
- **@testing-library/react-native** for component testing
- **Manual Jest setup** deferred to Phase 6.2 (resolve Babel/Jest conflicts)

**Integration Testing:**
- **Detox** for E2E testing (UI flows)
- **AsyncStorage mock** for data layer testing

**Manual Testing Checklist:**
- User journey tests (documented below)
- Cross-platform (iOS/Android/Web)
- Performance profiling

---

## Test Coverage Plan

### Tier 1: Critical (Must Test)

#### A. Drink Logging Flow
```typescript
// User journey: Log a drink → Calculate units → Save → Display in summary
Test: Can user log a drink with all fields?
Test: Does validation catch invalid price/units?
Test: Do calculations match NHS guidelines?
Test: Does drink appear in daily summary immediately?
```

**Test data:**
- Pint of beer: 2.3 units
- Wine glass (175ml): 2.1 units
- Spirit (25ml): 1 unit

#### B. Data Persistence
```typescript
// Test: AsyncStorage operations under all conditions
Test: Save drink → refresh app → drink still there?
Test: Delete drink → verify removed from log?
Test: Reset all data → all screens show empty state?
Test: Handle corrupted data gracefully?
```

#### C. Weekly/Daily Calculations
```typescript
// Test: Summary accuracy
Test: Weekly total = sum of daily totals?
Test: Units over 14 = alert user?
Test: Spent calculation correct?
```

#### D. Navigation
```typescript
// Test: All screen transitions work
Test: Log screen → navigate to summary?
Test: Tap day in weekly → open daily for that day?
Test: Back button works in nested stacks?
Test: Age gate blocks access on first launch?
```

### Tier 2: Important (Should Test)

- AI insights generation (fallback works on timeout)
- Settings (edit goal, reset data)
- Venue search and filtering
- Map functionality (if using live data)
- Empty states (no drinks logged, no venues)

### Tier 3: Nice-to-Have (Can Test)

- Responsiveness on different screen sizes
- Offline functionality verification
- Memory leaks under repeated operations
- Accessibility (screen reader support)

---

## Manual Testing Checklist

### Before Each Release

**Drink Logging:**
- [ ] Log a drink with all fields
- [ ] Log a drink with only required fields
- [ ] Try invalid price (negative, > 1000)
- [ ] Try invalid units (0, > 100)
- [ ] Rapid-click save button (should only save once)
- [ ] Log drink offline, verify saved when online

**Summary Views:**
- [ ] Daily summary shows today's drinks
- [ ] Can navigate to previous/next days
- [ ] Weekly summary shows 7 days
- [ ] Can navigate between weeks
- [ ] Unit totals are calculated correctly
- [ ] Empty state appears when no drinks logged

**Settings:**
- [ ] Can change weekly unit goal
- [ ] Goal persists after app restart
- [ ] Reset all data works
- [ ] Reset returns to initial state

**Navigation:**
- [ ] Age gate appears on first launch
- [ ] Can't access app without confirming age
- [ ] All 5 tabs accessible
- [ ] Back button works throughout
- [ ] Deep links work (if testing)

**Edge Cases:**
- [ ] Log 20 drinks in one day
- [ ] Log drinks over entire week
- [ ] Exceed 100-unit limit
- [ ] Spend over £1000
- [ ] Navigate between screens rapidly
- [ ] Kill and restart app during operation

---

## Automated Testing Approach (Phase 6.2)

### Step 1: Resolve Dependency Conflicts
```bash
# Jest setup has Babel/version conflicts
# Solution: Use @react-native-community/test-setup or upgrade to compatible versions

npm install --save-dev --legacy-peer-deps jest@28.1.0 @react-native-community/test-setup
```

### Step 2: Create Test Structure
```
src/
  __tests__/
    utils/
      id.test.ts          # ✅ Ready (see below)
      units.test.ts       # ✅ Ready
      date.test.ts        # ✅ Ready
    services/
      storage.test.ts     # ✅ Ready
      insights.test.ts    # ⏳ Pending
    screens/
      LogDrinkScreen.test.tsx    # ⏳ Component testing
      DailySummaryScreen.test.tsx
      HomeScreen.test.tsx
```

### Step 3: Starter Test Suite (Ready to Use)

**See `/test-examples` directory:**
- `id.test.ts` — UUID generation
- `units.test.ts` — Unit calculations
- `date.test.ts` — Date utilities
- `storage.test.ts` — AsyncStorage operations

Copy these into `src/__tests__/` once Jest is configured.

---

## CI/CD Integration

Once Jest is working, add to validation pipeline:

```json
"scripts": {
  "test": "jest",
  "test:coverage": "jest --coverage",
  "validate": "npm run type-check && npm run lint && npm run format:check && npm run test --  --coverage --passWithNoTests"
}
```

**GitHub Actions:** Add test step to `.github/workflows/ci.yml`
```yaml
- name: Run tests
  run: npm run test:coverage
```

---

## Testing Priorities by Phase

### Phase 6.1: Real Data Integration
- Manual testing only (checklist above)
- Focus on backend API testing separately
- Verify UI + backend integration

### Phase 6.2: Stabilization
- Resolve Jest/Babel conflicts
- Implement automated unit tests
- Set coverage threshold to 60%

### Phase 6.3: Beta Release
- Full integration test suite
- E2E tests with Detox
- Performance benchmarks
- Accessibility audit

---

## Known Testing Challenges

1. **Expo + Jest Conflicts:** Version mismatches between Expo, React Native, Jest, Babel
   - **Workaround:** Use react-native preset + simple configs
   - **Fix:** Update to Expo 55+ when released

2. **AsyncStorage Mocking:** Mocking persists across tests
   - **Workaround:** Clear mocks in `beforeEach`
   - **Solution:** Use `@react-native-async-storage/async-storage` v2.0+ test utils

3. **Navigation Mocking:** React Navigation complex to test
   - **Workaround:** Mock useNavigation and useRoute
   - **Best practice:** Test navigation logic, not Navigation component itself

4. **Component Testing:** React Native components harder than Web
   - **Solution:** @testing-library/react-native (already in package.json)
   - **Focus:** Test user interactions, not implementation details

---

## Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Unit test coverage | 60% | 0% (Phase 6.2) |
| Critical flow tests | 100% | Manual tests ready |
| Daily build time | < 5 min | 1 min ✅ |
| Type-check failures | 0 | 0 ✅ |
| Lint failures | 0 | 0 ✅ |
| Deploy confidence | High | Medium (manual testing) |

---

## Timeline

- **Week 1:** Manual testing checklist + real data integration
- **Week 2:** Backend API integration + manual regression testing
- **Week 3:** Jest setup (Phase 6.2) + unit tests
- **Week 4:** E2E testing + performance optimization
- **Week 5:** Release readiness + final QA

---

**Next Step:** Proceed to Phase 6.1 — Real Data Integration (Backend + Real Venues)

