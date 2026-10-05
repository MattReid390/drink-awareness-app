# Changelog

All notable changes to Drink Awareness are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-05

### Added - Phase 1-6: Core Foundation
- ✅ User authentication (signup, login, JWT tokens)
- ✅ Drink logging with type, ABV, quantity, cost
- ✅ Daily/weekly summaries and statistics
- ✅ Weekly goal tracking and progress monitoring
- ✅ Cloud data synchronization
- ✅ Age confirmation gate
- ✅ Settings and user preferences
- ✅ Data export/import (CSV, JSON)

### Added - Phase 7: Analytics & Insights
- ✅ 30-day drinking trends with charts
- ✅ Goal progress visualization
- ✅ Cost analysis and spending tracking
- ✅ Venue frequency analytics
- ✅ Server-side analytics aggregation
- ✅ AI-powered insights generation

### Added - Phase 8: Premium Features
- ✅ Stripe integration for subscriptions
- ✅ Premium and Premium Plus tiers
- ✅ Feature gating and paywall
- ✅ Mock health app integration (Apple Health, Google Fit)
- ✅ Mock AI coaching recommendations
- ✅ Subscription management
- ✅ Invoice history

### Added - Phase 9: Mobile Polish & Notifications
- ✅ Push notification support (Expo)
- ✅ Device token registration
- ✅ Local reminder scheduling
- ✅ Achievement and milestone tracking
- ✅ Streak detection and celebrations
- ✅ Notification settings UI
- ✅ Deep linking infrastructure (custom schemes)
- ✅ Deep link testing utilities

### Added - Phase 10: Offline-First Architecture
- ✅ Network status monitoring
- ✅ Automatic sync on connection restore
- ✅ Exponential backoff retry logic
- ✅ Optimistic state updates
- ✅ Change tracking with versioning
- ✅ Selective sync (only changed data)
- ✅ Automatic rollback on sync failure
- ✅ Sync status indicators

### Added - Phase 11: Production Ready
- ✅ Real Stripe payment integration
- ✅ Real Claude API for AI coaching
- ✅ Real Apple Health & Google Fit OAuth
- ✅ Comprehensive E2E test suite
- ✅ Deployment configuration (EAS)
- ✅ Privacy policy
- ✅ Security checklist
- ✅ CI/CD pipeline (GitHub Actions)

### Security
- JWT-based authentication
- Password hashing with bcrypt
- HTTPS/TLS encryption for all API calls
- OAuth 2.0 for health app integration
- Secure token storage in AsyncStorage
- Permission-based feature access
- Input validation and sanitization
- Security audit checklist

### Performance
- Optimized bundle size
- Lazy loading screens
- Network request caching
- Image optimization
- Efficient database queries
- Offline-first data access
- Memory usage monitoring

### Testing
- 95+ E2E test cases
- Auth flow tests
- Drink logging tests
- Sync and offline tests
- Premium feature tests
- Deep linking tests
- Notification tests
- Unit test coverage

### Documentation
- API endpoint documentation
- Deep linking setup guide
- Stripe integration guide
- Claude API coaching guide
- Health app integration guide
- Deployment checklist
- Privacy policy
- CI/CD setup guide

## Future Roadmap

### v1.1.0 (Q1 2027)
- [ ] Wearable app support (Apple Watch, Wear OS)
- [ ] Social features (friends, leaderboards)
- [ ] Photo attachments for drinks
- [ ] Barcode scanning for drinks
- [ ] Geofencing notifications at venues
- [ ] Historical data import from other apps

### v1.2.0 (Q2 2027)
- [ ] Advanced AI coaching with memory
- [ ] Personalized drinking recommendations
- [ ] Integration with fitness apps (Strava, MyFitnessPal)
- [ ] Calorie and nutrition tracking
- [ ] Doctor/healthcare provider integration
- [ ] Treatment and support resources

### v2.0.0 (Q3 2027)
- [ ] Complete redesign with Material 3 / iOS 17+
- [ ] Voice logging (Siri, Google Assistant)
- [ ] Real-time collaboration features
- [ ] Backend API for third-party integrations
- [ ] Admin dashboard for organizations
- [ ] Multilingual support (10+ languages)

## Known Limitations

### v1.0.0
- Health app sync one-way only (read from Apple Health/Google Fit)
- No historical health data sync (last 30 days only)
- Limited offline support (last 30 days of drinks cached)
- No multi-device real-time sync
- Coaching limited to 1 recommendation per hour
- Export limited to last 1 year of data

### Platform Differences
- Apple Health integration iOS only
- Google Fit integration Android only
- Some permissions may vary by OS version
- Performance varies by device capability

## Dependencies

### Critical Runtime Dependencies
```
react-native@0.81.5
expo@^54.0.37
@react-navigation/native@^7.3.4
@stripe/stripe-react-native@^0.31.0
expo-auth-session@^5.3.0
@react-native-async-storage/async-storage@2.2.0
```

### Development Dependencies
- TypeScript@^5.9.2
- Jest@^29.7.0
- ESLint@^8.48.0
- Prettier@^3.0.0

## Version Support

### Supported Platforms
- **iOS:** 13.0+
- **Android:** 7.0+ (API 24+)
- **Web:** Not officially supported (preview only)

### Supported Node.js Versions
- Node.js 18.x
- Node.js 20.x

### Supported Package Managers
- npm 9.x+
- yarn 1.22.x+

## Migration Guides

### Upgrading from v0.x
Users upgrading from pre-release versions should:
1. Delete and reinstall the app
2. Create a new account (old data not compatible)
3. Re-log drinks from the past
4. Reconnect health apps if using them

## Support & Issues

- **Bug Reports:** GitHub Issues
- **Feature Requests:** GitHub Discussions
- **Support Email:** support@drinkaware.app
- **Status Page:** status.drinkaware.app

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors

Developed with [Claude AI](https://claude.ai/) by Anthropic

---

## Release Timeline

| Version | Release Date | Status |
|---------|------------|--------|
| 1.0.0 | 2026-10-05 | Released ✅ |
| 1.1.0 | 2027-Q1 | Planned |
| 1.2.0 | 2027-Q2 | Planned |
| 2.0.0 | 2027-Q3 | Planned |
