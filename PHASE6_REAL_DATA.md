# Phase 6 — Real Data Integration

**Duration:** 4-5 weeks  
**Goal:** Transform from prototype (placeholder data) → real product (live data)  
**Success:** Users can see real venues, log real drinks, get actionable insights

---

## Current State vs. Target State

| Aspect | Phase 5 (Current) | Phase 6 Target |
|--------|------------|-------|
| Venues | 3 hardcoded | 100+ real venues (DB or API) |
| Drink Menus | Empty | Real drinks with prices |
| User Data | Local storage | Cloud sync (optional) |
| Backend | None | REST API |
| Authentication | None | Optional user accounts |
| Real-time | No | No (not critical for MVP) |

---

## Phase 6.1: Backend Foundation (Week 1-2)

### Tech Stack
```
Frontend: Expo (✅ already set up)
Backend: Node.js + Express
Database: PostgreSQL
Hosting: Render.com (free tier)
API: REST (JSON)
```

### Initial Setup

#### 1. Create Express Server
```bash
mkdir drink-api
cd drink-api
npm init -y
npm install express cors dotenv axios
npm install --save-dev nodemon
```

**Basic structure:**
```
drink-api/
  src/
    server.js          # Express app
    routes/
      venues.js        # GET /venues, GET /venues/:id
      drinks.js        # GET /drinks/:venueId
    models/
      Venue.js
      Drink.js
    database.js        # PostgreSQL connection
  .env
  package.json
  README.md
```

#### 2. Set Up PostgreSQL

**Option A: Local (development)**
```bash
# Install PostgreSQL locally
# Create database: createdb drink_awareness
```

**Option B: Cloud (production)**
- Use **Render.com** PostgreSQL (free tier)
- Or **Supabase** (easier setup, Postgres + API built-in)

#### 3. Create API Endpoints

**GET /api/venues** → List all venues
```json
[
  {
    "id": 1,
    "name": "The Anchor",
    "type": "Pub",
    "address": "12 High Street, London",
    "coordinates": { "latitude": 51.505, "longitude": -0.09 },
    "hours": {
      "monday": "11:00-23:00",
      "tuesday": "11:00-23:00",
      ...
    },
    "phone": "020 7123 4567"
  }
]
```

**GET /api/venues/:id** → Venue detail with drink menu
```json
{
  "id": 1,
  "name": "The Anchor",
  ...,
  "drinks": [
    { "id": 1, "name": "Pint of Lager", "price": 4.50, "units": 2.3 },
    { "id": 2, "name": "Wine Glass", "price": 5.00, "units": 2.1 },
    ...
  ]
}
```

**POST /api/drinks/log** → Save drink (when user syncs)
```json
{
  "userId": "optional",
  "drink": { "name": "Pint of Lager", "units": 2.3, "price": 4.50 },
  "timestamp": "2026-08-10T15:30:00Z",
  "venue_id": 1
}
```

### Deliverable: Working API on localhost:5000

---

## Phase 6.2: Real Venue Data (Week 1-2)

### Data Source Options

| Source | Pros | Cons | Cost |
|--------|------|------|------|
| **Google Places API** | Real-time, comprehensive | Rate limited, requires key | $0.01-0.07/request |
| **OpenStreetMap** | Free, offline OK | Less detailed | Free |
| **Manual seeding** | Control, accuracy | Labor-intensive | Time |
| **Supabase + CSV** | Easiest, structured | Manual updates | Free |

### Recommended Approach: Manual Seed for MVP

**Create `db/seed.js`:**
```javascript
// Seed 10-20 real London pubs with:
// - Name, address, phone
// - Opening hours
// - Real drink menu (5-10 drinks each)
// - Prices (from pub websites or average)

const venues = [
  {
    name: "The Anchor",
    address: "12 High Street, London EC1A 1BB",
    phone: "020 7123 4567",
    type: "Pub",
    coordinates: { latitude: 51.505, longitude: -0.09 },
    hours: {...},
    drinks: [
      { name: "Guinness Pint", price: 4.80, units: 2.3 },
      { name: "Stella Artois Pint", price: 4.50, units: 2.3 },
      { name: "Peroni Pint", price: 5.00, units: 2.3 },
      { name: "House Wine Glass", price: 5.50, units: 2.1 },
      { name: "Spirits (Single)", price: 4.50, units: 1.0 },
    ]
  },
  // ... 10-20 more venues
];
```

### Data Collection Process

1. **Choose 10-20 real venues** in your target area (London, Manchester, etc.)
2. **Collect:**
   - Name, address, phone (Google Maps)
   - Opening hours (venue website/Google)
   - Typical drink prices (website, call, or average)
3. **Format** into seed data
4. **Load into DB** via `npm run seed`

### Deliverable: 20 real venues in database with drink menus

---

## Phase 6.3: Expo ↔ API Integration (Week 2-3)

### Connect App to Real Backend

#### 1. Update Venue Service
**Current:** `src/services/venues.js` returns `PLACEHOLDER_VENUES`  
**New:** Fetch from API

```typescript
// src/services/venues.ts
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const getVenues = async () => {
  try {
    const response = await fetch(`${API_URL}/api/venues`);
    if (!response.ok) throw new Error('Failed to fetch venues');
    return await response.json();
  } catch (error) {
    console.error('Venues fetch failed:', error);
    // Fallback to placeholder venues for offline
    return PLACEHOLDER_VENUES;
  }
};

export const getVenueDetail = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/api/venues/${id}`);
    if (!response.ok) throw new Error('Venue not found');
    return await response.json();
  } catch (error) {
    console.error('Venue detail fetch failed:', error);
    return null;
  }
};
```

#### 2. Add API URL to `.env.local`
```
EXPO_PUBLIC_API_URL=http://localhost:5000
EXPO_PUBLIC_ANTHROPIC_API_KEY=your_key
```

#### 3. Update Screens to Use Real Data

**Before:** VenueListScreen uses PLACEHOLDER_VENUES  
**After:** VenueListScreen calls getVenues() on mount

```typescript
// src/screens/VenueListScreen.tsx
useFocusEffect(
  useCallback(() => {
    const loadVenues = async () => {
      try {
        const venues = await getVenues();
        setVenues(venues);
      } catch (error) {
        Alert.alert('Error', 'Could not load venues');
      }
    };
    loadVenues();
  }, [])
);
```

#### 4. Handle Loading States
```typescript
const [loading, setLoading] = useState(true);

useFocusEffect(
  useCallback(() => {
    const load = async () => {
      setLoading(true);
      try {
        const venues = await getVenues();
        setVenues(venues);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [])
);

return (
  <View>
    {loading && <ActivityIndicator />}
    {!loading && <FlatList data={venues} ... />}
  </View>
);
```

### Deliverable: App loads real venues from API

---

## Phase 6.4: Testing & Deployment (Week 3-4)

### Manual Testing Checklist

- [ ] Load app → venues appear (from API, not hardcoded)
- [ ] Tap venue → detail page shows real drinks
- [ ] Log a drink from real venue
- [ ] Daily summary shows logged drink with real price
- [ ] Weekly summary calculates totals correctly
- [ ] Offline mode shows placeholder venues
- [ ] Kill app, restart → data persists

### Deploy Backend

**Steps:**
1. Create Render account (free)
2. Connect GitHub repo `drink-api`
3. Set environment variables (DATABASE_URL)
4. Deploy: `git push`
5. Update app API_URL to production URL

**Example Render deployment:**
```
API_URL=https://drink-api-production.onrender.com
```

### Add Error Handling

```typescript
// Network retry logic
const fetchWithRetry = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
};
```

### Deliverable: App + API in production, users can use real data

---

## Phase 6.5: Polish & Optimization (Week 4-5)

### Add Features

**Optional enhancements:**
- [ ] Venue search/filtering
- [ ] Favorite venues
- [ ] User accounts (track drinks across devices)
- [ ] Export data as CSV
- [ ] Share weekly summary

### Optimize

- [ ] Cache venue data locally (don't refetch constantly)
- [ ] Paginate drinks list if venue has 100+ drinks
- [ ] Add analytics (which venues most visited)
- [ ] Performance: Load times < 2 sec

### Deliverable: Production-ready MVP

---

## Implementation Checklist

### Backend (Express)
- [ ] Basic Express server on port 5000
- [ ] PostgreSQL connection
- [ ] `/api/venues` endpoint working
- [ ] `/api/venues/:id` with drinks
- [ ] Error handling (404, 500, etc.)
- [ ] CORS enabled for Expo app

### Database (PostgreSQL)
- [ ] Tables: venues, drinks
- [ ] Seed script with 20 real venues
- [ ] Indexes on frequently queried columns

### Expo App
- [ ] Update API service to call backend
- [ ] Add loading states
- [ ] Add error states
- [ ] Remove hardcoded PLACEHOLDER_VENUES
- [ ] Test on iOS, Android, Web

### Deployment
- [ ] Backend on Render.com
- [ ] Environment variables configured
- [ ] Database backup plan
- [ ] CI/CD for backend (GitHub Actions)

### Testing
- [ ] Manual test all user journeys
- [ ] Test offline fallbacks
- [ ] Test network errors (bad WiFi, no connection)
- [ ] Performance: 100+ venues load < 2 sec

---

## Timeline

```
Week 1: Backend setup + API endpoints
Week 2: Real venue data + Expo integration
Week 3: Testing + deployment
Week 4: Polish + optional features
Week 5: Release prep + marketing
```

---

## What's Next After Phase 6

### Phase 6.5+: Advanced Features
- User accounts + cloud sync
- Social features (share with friends)
- Analytics dashboard
- AI recommendations
- Export/import data

### Phase 7: Scale
- Add more venues (expand to other UK cities)
- Real-time pub data sync
- Machine learning for drink recommendations
- Mobile app review process (App Store, Play Store)

---

## Success Metrics

| Metric | Target | Definition |
|--------|--------|-----------|
| Venues available | 50+ | Real, searchable |
| Drinks per venue | 5-20 | Realistic menu |
| Data accuracy | 95% | Price ± £0.50 |
| API response time | < 500ms | From anywhere |
| App load time | < 3s | From cold start |
| User can log drink | 100% | Critical flow |

---

**Next Step:** Start Phase 6.1 — Create Express backend and database schema

