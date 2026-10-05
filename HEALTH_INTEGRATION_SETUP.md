# Health App Integration Setup

## Overview

The app now supports real integration with Apple Health (iOS) and Google Fit (Android) for comprehensive health tracking. This requires OAuth setup on your backend.

## Backend Requirements

### Environment Variables

```env
# Apple Health OAuth (if using Apple OAuth provider)
APPLE_OAUTH_CLIENT_ID=...
APPLE_OAUTH_TEAM_ID=...
APPLE_OAUTH_KEY_ID=...

# Google Fit OAuth
GOOGLE_OAUTH_CLIENT_ID=com.example.drinkaware.android
GOOGLE_OAUTH_CLIENT_SECRET=...
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/oauth/google-fit/callback
```

### API Endpoints

#### 1. Connect Health Provider

```
POST /health/connect
```

**Request Body:**
```json
{
  "provider": "apple_health" | "google_fit",
  "accessToken": "token_value",
  "refreshToken": "refresh_token_value",
  "expiresIn": 3600
}
```

**Response:**
```json
{
  "provider": "apple_health",
  "connected": true,
  "accessToken": "token_value",
  "syncedAt": "2026-10-05T20:00:00Z"
}
```

#### 2. Refresh OAuth Token

```
POST /health/refresh-token
```

**Request Body:**
```json
{
  "provider": "apple_health" | "google_fit",
  "refreshToken": "refresh_token_value"
}
```

**Response:**
```json
{
  "accessToken": "new_token_value",
  "expiresIn": 3600
}
```

#### 3. Sync Health Data

```
POST /health/sync
```

**Request Body:**
```json
{
  "provider": "apple_health" | "google_fit"
}
```

**Response:**
```json
{
  "stepsToday": 8432,
  "sleepHours": 7.5,
  "heartRate": 72,
  "lastUpdated": "2026-10-05T20:00:00Z"
}
```

#### 4. Disconnect Health Provider

```
POST /health/disconnect
```

**Request Body:**
```json
{
  "provider": "apple_health" | "google_fit"
}
```

**Response:**
```json
{
  "success": true
}
```

## OAuth Setup

### Apple Health on iOS

1. **Framework Integration**
   - Use HealthKit framework to request health data permissions
   - App must declare health data usage in Info.plist

2. **Permission Keys** (Info.plist)
   ```xml
   <key>NSHealthShareUsageDescription</key>
   <string>We use your health data to provide personalized coaching and insights</string>
   <key>NSHealthUpdateUsageDescription</key>
   <string>We need to log health events when you log drinks</string>
   ```

3. **Scopes Requested**
   - HKQuantityTypeIdentifierStepCount
   - HKQuantityTypeIdentifierHeartRate
   - HKCategoryTypeIdentifierSleepAnalysis

### Google Fit on Android

1. **OAuth Configuration**
   - Register your app at Google Cloud Console
   - Create OAuth 2.0 credentials (Android)
   - Add redirect URI: `http://localhost:3000/oauth/google-fit/callback`

2. **Permissions** (AndroidManifest.xml)
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="com.google.android.gms.permission.ACTIVITY_RECOGNITION" />
   ```

3. **Scopes Requested**
   - `https://www.googleapis.com/auth/fitness.activity.read`
   - `https://www.googleapis.com/auth/fitness.heart_rate.read`
   - `https://www.googleapis.com/auth/fitness.sleep.read`

## Implementation Flow

### iOS (Apple Health)

```
User taps "Connect Apple Health"
        ↓
App calls healthAuthService.initiateAppleHealthOAuth()
        ↓
HealthKit permission prompt appears
        ↓
User grants permissions
        ↓
Backend exchanges permission for OAuth token
        ↓
Token stored in AsyncStorage
        ↓
Health data synced automatically
```

### Android (Google Fit)

```
User taps "Connect Google Fit"
        ↓
App initiates OAuth flow via expo-auth-session
        ↓
Browser opens with Google login/consent screen
        ↓
User grants scopes
        ↓
Redirects back with authorization code
        ↓
Backend exchanges code for access/refresh tokens
        ↓
Tokens stored in AsyncStorage
        ↓
Health data synced automatically
```

## Data Caching

- Health data cached locally for offline access
- Token refresh happens automatically when within 5 minutes of expiry
- Cache persists across app restarts
- Max cache age: 24 hours

## Error Handling

### User Cancelled
- Show friendly message, allow retry
- No data lost, connection not established

### Insufficient Permissions
- Guide user to Health app settings
- Show which permissions are needed

### Token Expired
- Automatic refresh attempt
- If refresh fails, prompt user to reconnect

### Network Offline
- Use cached health data when available
- Queue sync for next online opportunity

## Privacy & Security

✅ **What We Do**
- Request minimum necessary permissions
- Store tokens securely in AsyncStorage
- Auto-refresh tokens before expiry
- Sync aggregated data only

❌ **What We Don't Do**
- Share health data with third parties
- Store raw health data
- Sync personal details (name, DOB, etc.)
- Share data between users

## Testing

### Development Setup

```bash
# 1. Create test user in Apple Health (iOS Simulator)
# 2. Create test Google Fit account (Android Emulator)
# 3. Use mock endpoints for local testing

export HEALTH_MOCK_MODE=true
```

### Mock Response

```javascript
const mockHealthData = {
  stepsToday: 8432,
  sleepHours: 7.5,
  heartRate: 72,
};
```

### Integration Test

```bash
# Test Apple Health connection
npm run test -- health.integration.apple

# Test Google Fit connection  
npm run test -- health.integration.google

# Test sync without network
npm run test -- health.offline
```

## Future Enhancements

- [ ] Wearable device integration (Fitbit, Garmin)
- [ ] Historical data sync (last 30 days)
- [ ] Real-time activity tracking
- [ ] Calorie and nutrition tracking
- [ ] Medical records integration
- [ ] Multi-device sync
