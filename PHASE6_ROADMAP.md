# Phase 6 Roadmap — Backend Integration & Enhanced Features

Strategic plan for scaling the Drink Awareness App beyond MVP.

---

## Executive Summary

**Phase 5 delivered:** Complete MVP with local-only data and AI insights.

**Phase 6 goal:** Real data integration, cloud sync, and user accounts.

**Timeline:** 3-4 months for full Phase 6  
**Team size:** 1-2 developers + 1 backend engineer  
**Priority:** Real venue data > User accounts > Enhanced features

---

## Phase 6 Roadmap (Prioritized)

### Sprint 1: Real Venue Data (Weeks 1-3)
**Goal:** Replace placeholder venues with real data  
**Effort:** 2 weeks

#### 1.1 Foursquare Places API Integration
- [ ] Set up Foursquare API account & credentials
- [ ] Implement venue search with user location
- [ ] Fetch venue details (address, hours, phone, category)
- [ ] Implement venue caching (avoid API quota limits)
- [ ] Add loading states during API calls
- [ ] Error handling for API failures
- [ ] Rate limiting & backoff strategy

**Files to modify:**
- `src/services/venues.ts` (new)
- `src/screens/VenueListScreen.tsx` (fetch real data)
- `src/screens/MapScreen.tsx` (show real locations)

**Dependencies to add:**
```json
{
  "@react-native-camera/camera": "^5.x",
  "react-native-geolocation-service": "^5.x"
}
```

**Effort estimate:** 40-50 hours

---

### Sprint 2: Real Drink Menu Data (Weeks 3-4)
**Goal:** Get actual drink menus from venues  
**Effort:** 1 week

#### 2.1 Menu Data Source Options
- **Option A:** Foursquare menu data (limited, not all venues)
- **Option B:** Custom partner venues with own data
- **Option C:** User-contributed menus (later phase)

**Recommended:** Start with Option B (partner venues only)

#### 2.2 Implementation
- [ ] Set up menu data database
- [ ] Create menu admin panel (or JSON upload)
- [ ] Link menus to venue IDs
- [ ] Fetch menu on venue detail view
- [ ] Cache menus locally

**Files to modify:**
- `src/services/menus.ts` (new)
- `src/screens/DrinkMenuScreen.tsx` (fetch real menus)

**Effort estimate:** 30-40 hours

---

### Sprint 3: Backend & Authentication (Weeks 5-8)
**Goal:** Enable cloud data sync and user accounts  
**Effort:** 4 weeks

#### 3.1 Backend Setup
**Technology choices:**
- Backend: Node.js + Express (or Firebase)
- Database: PostgreSQL (or MongoDB)
- Hosting: AWS / Vercel / Render
- Auth: Firebase Auth or Auth0

**Recommended Stack:** Node.js + Express + PostgreSQL (Render free tier)

#### 3.2 User Accounts
- [ ] User registration flow
- [ ] Email verification
- [ ] Login/logout
- [ ] Password reset
- [ ] JWT token management
- [ ] Secure token storage on device

**New screens:**
- SignUp screen
- Login screen
- Email verification screen
- Password reset flow

**Files to create:**
- `src/services/auth.ts`
- `src/services/api.ts` (authenticated API calls)
- `src/screens/SignUpScreen.tsx`
- `src/screens/LoginScreen.tsx`

#### 3.3 Cloud Data Sync
- [ ] Migrate local AsyncStorage to cloud
- [ ] Implement sync on login
- [ ] Handle offline-first sync queue
- [ ] Conflict resolution strategy
- [ ] Data privacy & encryption

**Effort estimate:** 80-100 hours

---

### Sprint 4: Enhanced Analytics (Weeks 8-10)
**Goal:** Advanced insights and trend tracking  
**Effort:** 2 weeks

#### 4.1 Trend Analytics
- [ ] 30-day drinking trend chart
- [ ] Goal progress tracker
- [ ] Cost analysis (total spent, average per drink)
- [ ] Venue frequency analysis (where you drink most)
- [ ] Drink type preferences

**New screen:**
- Analytics screen (S15)

#### 4.2 Goal Management
- [ ] Set weekly unit goal
- [ ] Track progress toward goal
- [ ] Weekly completion celebration
- [ ] Milestone notifications

**Effort estimate:** 40-50 hours

---

### Sprint 5: Social & Notifications (Weeks 10-12)
**Goal:** Social sharing and engagement  
**Effort:** 2 weeks

#### 5.1 Social Features
- [ ] Share weekly summary (social media)
- [ ] Friend leaderboard (optional)
- [ ] Achievement badges
- [ ] Share to story (Instagram, Snapchat)

#### 5.2 Push Notifications
- [ ] Reminder to log drinks
- [ ] Weekly goal summary
- [ ] Achievement unlocked notifications
- [ ] Venue recommendations nearby

**Dependencies:**
- Firebase Cloud Messaging (FCM)
- Expo Notifications

**Effort estimate:** 40-50 hours

---

### Sprint 6: Polish & Launch (Weeks 12-16)
**Goal:** Production readiness  
**Effort:** 4 weeks

#### 6.1 Accessibility (A11y)
- [ ] Screen reader support
- [ ] Color contrast audit
- [ ] Touch target sizing
- [ ] Keyboard navigation

#### 6.2 Performance
- [ ] Bundle size optimization
- [ ] Image optimization
- [ ] App startup time < 2s
- [ ] Memory profiling

#### 6.3 Internationalization (i18n)
- [ ] Support 3+ languages (EN, ES, FR)
- [ ] Date/time localization
- [ ] Currency localization

#### 6.4 App Store Submission
- [ ] TestFlight beta (iOS)
- [ ] Google Play beta (Android)
- [ ] ASO (App Store Optimization)
- [ ] Privacy policy & terms
- [ ] Screenshots & descriptions

**Effort estimate:** 60-80 hours

---

## Technical Architecture

### Current (Phase 5)
```
┌─────────────────┐
│   React Native  │
│      (App)      │
└────────┬────────┘
         │
    ┌────▼─────┐
    │AsyncStorage│ (Local only)
    └──────────┘
```

### Phase 6 Target
```
┌──────────────────────────────────────┐
│      React Native App                │
│  (with offline-first sync queue)     │
└─────────┬────────────────┬───────────┘
          │                │
    ┌─────▼──┐       ┌─────▼─────────┐
    │AsyncStorage│  │Firebase Auth  │
    │ (cache)   │   │   (JWT)       │
    └──────────┘    └────────┬──────┘
                             │
                    ┌────────▼────────┐
                    │  Node.js/Express│
                    │   Backend API   │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    └─────────────────┘
```

### Backend API Structure
```
POST   /auth/signup          — Register new user
POST   /auth/login           — Login & get JWT
POST   /auth/refresh         — Refresh token
POST   /auth/logout          — Logout

GET    /drinks               — Get all drinks (paginated)
POST   /drinks               — Create drink
PUT    /drinks/:id           — Update drink
DELETE /drinks/:id           — Delete drink

GET    /venues               — Search venues (location-based)
GET    /venues/:id           — Get venue details
GET    /venues/:id/menu      — Get venue menu

GET    /analytics            — Get analytics data
GET    /analytics/trends     — Get trend data

POST   /goals                — Set weekly goal
GET    /goals                — Get user goals
```

---

## Data Models (Backend)

### User
```typescript
interface User {
  id: string;              // UUID
  email: string;           // Unique, lowercase
  passwordHash: string;    // bcrypt hashed
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    weeklyUnitGoal: number;
    currency: 'GBP' | 'USD' | 'EUR';
    notificationsEnabled: boolean;
  };
}
```

### Drink (extended)
```typescript
interface Drink {
  id: string;
  userId: string;          // FK to User
  name: string;
  time: ISO8601;
  type?: string;
  servingSize?: string;
  units: number;
  price?: number;
  venue?: string;
  venueId?: string;        // FK to Venue (if from directory)
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Venue (from API)
```typescript
interface Venue {
  id: string;
  fsqId?: string;          // Foursquare ID (for sync)
  name: string;
  type: string[];
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  website?: string;
  hours?: OpeningHours;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Menu
```typescript
interface Menu {
  id: string;
  venueId: string;         // FK to Venue
  items: MenuItem[];
  updatedAt: Date;
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  abv?: number;
  description?: string;
  available: boolean;
}
```

---

## Technology Stack Decisions

### Backend Framework
| Option | Pros | Cons | Recommendation |
|--------|------|------|---|
| **Node.js + Express** | JavaScript, fast to build, large ecosystem | Less structured than Django | ✅ **Choose** |
| Django + Python | Robust, batteries-included, ORM | Overkill for this app | |
| Firebase Backend | Serverless, no ops | Vendor lock-in, limited control | Alternative |

**Decision: Node.js + Express**

### Database
| Option | Pros | Cons | Recommendation |
|--------|------|------|---|
| **PostgreSQL** | Relational, scalable, reliable | Setup complexity | ✅ **Choose** |
| MongoDB | Flexible schema, easy to start | Not ideal for analytics | |
| Firebase Firestore | Serverless, real-time | Expensive at scale | Alternative |

**Decision: PostgreSQL**

### Hosting
| Option | Pros | Cons | Cost |
|--------|------|------|------|
| **Render** | Free tier, easy deploy, PostgreSQL included | Limited free tier | Free → $7/mo |
| Railway | Modern interface, generous free tier | Smaller company | Free → $5/mo |
| AWS | Scalable, industry standard | Complex setup | Varies |
| Vercel | Great for Next.js | Not ideal for Node | Varies |

**Decision: Render (free tier, PostgreSQL included)**

### Authentication
| Option | Pros | Cons | Cost |
|--------|------|------|------|
| **Firebase Auth** | Easy integration, multi-provider | Google dependency | Free |
| Auth0 | Flexible, enterprise features | Pricey | Free → $23/mo |
| JWT custom | Full control, lightweight | Manual implementation | Free |

**Decision: Firebase Auth (fastest to implement)**

### API Calls from App
```typescript
// Phase 6 API Service
const api = axios.create({
  baseURL: 'https://api.drinkaware.app',
  timeout: 10000,
});

// Add JWT to all requests
api.interceptors.request.use((config) => {
  const token = AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Retry failed requests
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, refresh and retry
      const newToken = await refreshToken();
      // Retry request with new token
    }
    throw error;
  }
);
```

---

## Migration Plan (AsyncStorage → Cloud)

### Phase 6.1: Parallel Sync
- Keep AsyncStorage as primary source
- Sync to cloud in background
- Cloud is backup/secondary

### Phase 6.2: Cloud Primary
- Cloud becomes primary source
- AsyncStorage is local cache
- Offline-first: queue changes locally, sync when online

### Migration Steps
1. Export all AsyncStorage data to JSON
2. Create user account
3. Upload JSON to cloud
4. Enable cloud sync
5. Delete local data (with confirmation)

---

## API Rate Limiting & Caching

### Foursquare API
- Rate limit: 99,999 calls/day (free tier)
- Cache venues for 7 days
- Cache menus for 30 days
- Implement exponential backoff on failures

### Backend API
- Rate limit: 100 requests/minute per user
- Cache API responses (60s for analytics, 24h for venues)
- Implement request deduplication

---

## Offline-First Strategy

### Drink Logging Offline
```typescript
// User logs drink without internet
const drink = {
  id: generateLocalId(),
  name: 'Pint of Lager',
  time: now(),
  synced: false,  // ← Mark as pending
};

// Save to AsyncStorage
await AsyncStorage.setItem('drinks', JSON.stringify(drinks));

// When internet returns
api.post('/drinks', drink)
  .then(() => {
    // Mark as synced in AsyncStorage
    drink.synced = true;
  })
  .catch(() => {
    // Retry later
  });
```

### Sync Queue
- Store all local changes in sync queue
- Process queue when online
- Retry with exponential backoff
- Show badge "X changes pending" if offline

---

## Security Considerations

### Authentication
- [ ] Never store password (use JWT)
- [ ] Use HTTPS only for API calls
- [ ] Implement token refresh (short-lived access token)
- [ ] Secure token storage on device (Keychain/Keystore)

### Data Privacy
- [ ] Encrypt sensitive data at rest
- [ ] Hash user passwords with bcrypt
- [ ] Implement role-based access control (RBAC)
- [ ] GDPR compliance (data export, deletion)

### API Security
- [ ] Validate all input on backend
- [ ] Rate limiting to prevent abuse
- [ ] CORS properly configured
- [ ] SQL injection prevention (use parameterized queries)

---

## Testing Strategy (Phase 6)

### Backend Testing
- Unit tests for API endpoints (Jest)
- Integration tests for database
- API contract testing
- Load testing (100 concurrent users)

### App Testing
- Integration tests (Detox for React Native)
- Cloud sync tests
- Offline/online transition tests
- Authentication flow tests

### Coverage Target
- Backend: 80%+ coverage
- Frontend: 60%+ coverage

---

## Metrics & Success Criteria

### Performance
- App startup time < 2 seconds
- API response time < 500ms (p95)
- 99.9% uptime

### Adoption
- 1,000 DAU by month 6
- 50% retention after 7 days
- 4.5+ star rating

### Quality
- < 1% crash rate
- < 5% error rate
- 60%+ test coverage

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|-----------|
| API quota exceeded | High | Medium | Caching + monitoring |
| Data breach | Critical | Low | Encryption + security audit |
| User churn | High | Medium | UX improvements + engagement |
| Scaling issues | High | Low | Load testing + optimization |
| Venue data stale | Medium | High | Regular sync + user reporting |

---

## Budget Estimate

### Hosting (annual)
- Backend: $84/year (Render)
- Database: Included in Render
- CDN/Storage: $100/year (if needed)
- **Total: ~$200/year**

### Third-party APIs (annual)
- Foursquare: Free → $500/year (at scale)
- Firebase: Free tier sufficient
- Anthropic Claude: $10-50/month (ongoing)
- **Total: ~$500-1,000/year**

### Development (internal)
- Phase 6 full scope: ~400-500 hours
- At $100/hr: $40,000-50,000
- Assumes 1 full-time dev for 3-4 months

---

## Phase 6 Milestones

| Milestone | Week | Deliverable |
|-----------|------|-------------|
| Real venue data | Week 3 | VenueListScreen shows real venues |
| Real menus | Week 4 | DrinkMenuScreen shows real drinks |
| Backend ready | Week 8 | API deployed, user auth working |
| Cloud sync | Week 10 | Drinks sync to cloud |
| Analytics | Week 12 | Advanced analytics screen |
| Social features | Week 14 | Share & notifications |
| Launch | Week 16 | TestFlight & Play Store |

---

## Next Steps

### Immediate (This Week)
1. [ ] Review this roadmap with team
2. [ ] Decide on backend stack (recommend: Node + Express + PostgreSQL)
3. [ ] Set up Render account for free tier
4. [ ] Get Foursquare API credentials

### Week 1 (Sprint 1 Setup)
1. [ ] Create Node.js backend project
2. [ ] Set up database schema
3. [ ] Implement user auth endpoint
4. [ ] Implement venue search endpoint

### Week 2-3 (Sprint 1 Execution)
1. [ ] Integrate Foursquare API in app
2. [ ] Implement venue loading state
3. [ ] Test venue search flow
4. [ ] Error handling & retry logic

---

## Questions & Decisions Needed

Before starting Phase 6, clarify:

1. **Backend preference:** Node.js + Express vs. Firebase?
2. **Database preference:** PostgreSQL vs. Firebase Firestore?
3. **Timeline priority:** How aggressively to pursue Phase 6?
4. **Team capacity:** Who will build the backend?
5. **Feature priority:** Start with real data or user accounts first?
6. **Budget:** Willing to invest in hosting/APIs?

---

## Conclusion

Phase 6 transforms the app from local prototype to production-ready service with real data, user accounts, and cloud sync. The roadmap is aggressive but achievable with proper planning and execution.

**Recommended starting point:** Real venue data integration (Sprint 1) provides immediate user value and validates the data pipeline before adding complexity of user accounts.

---

**Created:** August 10, 2026  
**Status:** Planning  
**Next Review:** When Phase 6 starts
