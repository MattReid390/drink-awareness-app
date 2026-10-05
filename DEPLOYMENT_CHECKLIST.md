# Deployment Checklist

## Pre-Release Verification

### Code Quality ✅
- [ ] All tests passing: `npm test`
- [ ] No type errors: `npm run type-check`
- [ ] No linting errors: `npm run lint`
- [ ] Code coverage > 80%: `npm run test:coverage`
- [ ] All E2E tests passing: `npm run test:e2e`

### Security ✅
- [ ] No hardcoded secrets in codebase
- [ ] API keys in environment variables only
- [ ] HTTPS enforced for all API calls
- [ ] Deep link validation prevents exploitation
- [ ] OAuth tokens stored securely
- [ ] Database passwords not in code
- [ ] Sensitive logs stripped in production
- [ ] Content Security Policy configured

### Performance ✅
- [ ] Bundle size optimized (< 150 MB)
- [ ] App startup time < 3 seconds
- [ ] Cold start sync completes < 10 seconds
- [ ] UI responsive (60 FPS target)
- [ ] Memory usage < 200 MB
- [ ] Battery impact < 5% per hour
- [ ] Network usage optimized
- [ ] Large images compressed

### Feature Completeness ✅
- [ ] Authentication flow complete
- [ ] Drink logging works offline
- [ ] Sync queues changes properly
- [ ] Premium subscriptions functional
- [ ] Push notifications working
- [ ] Deep links tested
- [ ] Health integration ready
- [ ] Coaching enabled

### User Experience ✅
- [ ] All screens tested on multiple devices
- [ ] Orientation changes handled
- [ ] Accessibility features working
- [ ] Loading states visible
- [ ] Error messages helpful
- [ ] Offline indicators clear
- [ ] Permissions requests proper
- [ ] Onboarding flow smooth

---

## iOS App Store Preparation

### Build Configuration
- [ ] Update `buildNumber` in app.json
- [ ] Update `version` in app.json (semantic versioning)
- [ ] Verify bundle identifier: `com.drinkaware.app`
- [ ] Set deployment target: 13.0 or higher
- [ ] Review all Info.plist permissions
- [ ] Configure associated domains for universal links
- [ ] Set up Apple Sign In (if applicable)

### App Store Metadata
- [ ] App name: "Drink Awareness"
- [ ] Subtitle: "Track drinking with AI coaching"
- [ ] Description (max 4000 chars): 
  ```
  Track your drinking habits with personalized AI coaching.
  
  Features:
  • Log every drink with type, ABV, and cost
  • Set weekly goals and track progress
  • Get AI-powered coaching recommendations
  • Sync across all your devices securely
  • Integrate with Apple Health
  • View detailed analytics and trends
  • Offline support with automatic sync
  
  Privacy-first: Your health data stays on your device.
  ```
- [ ] Keywords: drinking, health, tracking, goals, wellness, AI
- [ ] Support URL: https://drinkaware.app/support
- [ ] Privacy Policy URL: https://drinkaware.app/privacy
- [ ] Marketing URL: https://drinkaware.app

### Screenshots
- [ ] 5 screenshots (minimum)
  1. Log drink screen
  2. Summary/analytics screen
  3. Goals and tracking
  4. Premium features
  5. Settings/sync
- [ ] Screenshots sized correctly: 1170x2532 px
- [ ] Text overlays optional but recommended
- [ ] Show key features, not implementation details

### Privacy & Compliance
- [ ] Privacy policy published and accurate
- [ ] GDPR compliance verified
- [ ] Data deletion flow working
- [ ] No tracking without consent
- [ ] Age restriction: 18+ (alcohol tracking app)
- [ ] Health data usage disclosed
- [ ] Third-party service privacy reviewed

### Testing Build
```bash
eas build --platform ios --profile production
# Download build and test on TestFlight
```

### Submit to App Store
```bash
eas submit --platform ios --profile production
```

---

## Android Play Store Preparation

### Build Configuration
- [ ] Update `versionCode` in app.json
- [ ] Update `version` in app.json
- [ ] Verify package name: `com.drinkaware.app`
- [ ] Set `minSdkVersion`: 24 (Android 7.0)
- [ ] Set `targetSdkVersion`: 34 (Android 14)
- [ ] Review all AndroidManifest.xml permissions
- [ ] Configure intent filters for deep links

### App Store Metadata
- [ ] App name: "Drink Awareness"
- [ ] Short description (max 80 chars):
  ```
  Track drinking with AI coaching & health insights
  ```
- [ ] Full description:
  ```
  Track your drinking habits with intelligent AI coaching.
  
  ✓ Log every drink with details
  ✓ Set weekly goals & track progress
  ✓ Get personalized AI recommendations
  ✓ Sync seamlessly across devices
  ✓ Integrate with Google Fit
  ✓ Detailed analytics & trends
  ✓ Works offline with auto-sync
  
  Privacy matters: Your data stays on your device.
  ```
- [ ] Promotion text: "Now with AI coaching!"
- [ ] Recent changes: Version 1.0.0 initial release

### Graphics Assets
- [ ] Feature graphic: 1024x500 px
- [ ] Screenshots (4-8 recommended):
  1. Log drink
  2. Summary
  3. Goals tracking
  4. Analytics
  5. Health integration
  6. Premium features
- [ ] Icon: 512x512 px (PNG)
- [ ] Screenshots sized for Play Store specs

### Content Rating Questionnaire
- [ ] Alcohol: **Yes** (app is about tracking alcohol)
- [ ] Violence: No
- [ ] Sexual content: No
- [ ] Profanity: No
- [ ] Gambling: No

### Privacy & Compliance
- [ ] Privacy policy published
- [ ] Data safety form completed accurately
- [ ] Google Play policies compliance checked
- [ ] Permissions justified in store listing
- [ ] Health data usage properly disclosed
- [ ] Age gate: 18+ enforced
- [ ] COPPA compliance verified (no under-13 users)

### Testing Build
```bash
eas build --platform android --profile production
# Download AAB and test on internal testing track
```

### Submit to Play Store
```bash
eas submit --platform android --profile production
```

---

## Production Environment Setup

### Backend Configuration
- [ ] Production API endpoint configured
- [ ] Database backups enabled
- [ ] SSL certificates valid
- [ ] Rate limiting configured
- [ ] CORS properly restricted
- [ ] Monitoring and alerting set up
- [ ] Error tracking enabled (Sentry, etc.)
- [ ] Logging aggregation working

### Third-Party Services
- [ ] Stripe production keys in place
- [ ] Anthropic Claude API keys configured
- [ ] Apple Health OAuth credentials
- [ ] Google Fit OAuth credentials
- [ ] Push notification service configured
- [ ] Email service configured (if used)
- [ ] SMS service configured (if used)

### Analytics Setup
- [ ] Event tracking enabled
- [ ] User segmentation configured
- [ ] Funnel tracking set up
- [ ] Crash reporting active
- [ ] Performance monitoring enabled
- [ ] Custom events documented

### Monitoring & Alerts
- [ ] API response time monitoring
- [ ] Error rate alerts (> 1%)
- [ ] Database performance alerts
- [ ] Storage usage alerts
- [ ] User acquisition tracking
- [ ] Retention metrics configured
- [ ] Daily reports scheduled

---

## Release Process

### Day Before Release
1. [ ] Final smoke test on staging
2. [ ] Review all changes one more time
3. [ ] Update CHANGELOG.md
4. [ ] Tag release in git: `git tag v1.0.0`
5. [ ] Push tag to GitHub: `git push --tags`

### Release Day - iOS
```bash
# 1. Create production build
eas build --platform ios --profile production

# 2. Test on TestFlight (internal testers)
# 3. Wait 24 hours for approval
eas submit --platform ios --profile production

# 4. Monitor App Store processing
# 5. Release to users in App Store Connect
```

### Release Day - Android
```bash
# 1. Create production build
eas build --platform android --profile production

# 2. Test on internal testing track
# 3. Promote to closed testing
# 4. Wait for review (typically 2-4 hours)
eas submit --platform android --profile production

# 5. Release to production
```

### Post-Release Monitoring (First 24 Hours)
- [ ] Monitor crash reports closely
- [ ] Check error rate dashboard
- [ ] Review user feedback
- [ ] Monitor server load
- [ ] Check payment processing
- [ ] Verify sync functionality
- [ ] Monitor API latency
- [ ] Check user session quality

---

## Rollback Plan

### If Critical Bug Found

**iOS:**
1. Pull build from App Store Connect
2. Fix issue in code
3. Increment build number
4. Build and submit new version
5. Mark previous version as unavailable

**Android:**
1. Pull app from Play Store
2. Fix issue in code
3. Increment versionCode
4. Build and submit new version
5. Remove previous version from listing

---

## Version Numbering

Format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes, major features
- **MINOR**: New features, non-breaking changes
- **PATCH**: Bug fixes only

Examples:
- `1.0.0` - Initial release
- `1.1.0` - New features added
- `1.0.1` - Bug fix
- `2.0.0` - Major redesign

---

## Release Notes Template

```markdown
# Version 1.0.0 - Initial Release

## Features
- Track drinks with detailed information
- Set and manage weekly goals
- View personalized AI coaching recommendations
- Sync data across devices securely
- Integrate with Apple Health and Google Fit
- Detailed analytics and spending tracking
- Offline support with automatic sync
- Push notifications for milestones
- Deep linking and universal links support

## Fixes
- Initial release

## Known Issues
- None at this time

## Requirements
- iOS 13.0+ / Android 7.0+
- Active internet for first setup and sync

## Support
- Website: https://drinkaware.app
- Email: support@drinkaware.app
```

---

## Post-Launch Tasks

### Week 1
- [ ] Monitor crash reports
- [ ] Track key metrics
- [ ] Respond to user reviews
- [ ] Watch for performance issues
- [ ] Monitor server stability

### Week 2-4
- [ ] Gather user feedback
- [ ] Plan next release
- [ ] Fix any critical issues
- [ ] Monitor retention rates
- [ ] Track acquisition sources

### Month 2
- [ ] Release bug fix patch if needed
- [ ] Analyze feature usage
- [ ] Plan next major feature
- [ ] Review analytics deeply
- [ ] Update documentation

---

## Maintenance Schedule

### Weekly
- [ ] Review error logs
- [ ] Check server health
- [ ] Monitor payment processing
- [ ] Update dependencies

### Monthly
- [ ] Security audit
- [ ] Performance review
- [ ] Database optimization
- [ ] User feedback analysis

### Quarterly
- [ ] Major version planning
- [ ] Architecture review
- [ ] Security penetration testing
- [ ] Competitive analysis
