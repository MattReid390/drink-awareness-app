# Deployment Guide

Complete step-by-step instructions for deploying Drink Awareness to production.

## Prerequisites

### Required Accounts
- [ ] GitHub account with repo access
- [ ] Expo account (free tier OK)
- [ ] App Store Connect account (Apple developer)
- [ ] Google Play Console account (Google developer)
- [ ] Stripe dashboard access
- [ ] Anthropic API account

### Required Software
- Node.js 18.x or higher
- npm 9.x or yarn 1.22.x
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Git

### Development Machine
- macOS (for iOS builds)
- Or use EAS Cloud Build (recommended)

---

## Step 1: Pre-Deployment Setup

### 1.1 Install Dependencies
```bash
npm install
```

### 1.2 Verify All Tests Pass
```bash
npm run type-check    # TypeScript
npm run lint          # ESLint
npm test              # Unit tests
npm run test:e2e      # E2E tests
npm run test:coverage # Coverage report
```

### 1.3 Update Version Numbers

Edit `app.json`:
```json
{
  "expo": {
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    },
    "android": {
      "versionCode": 1
    }
  }
}
```

### 1.4 Update Changelog

Add release notes to `CHANGELOG.md` with:
- Version number
- Release date
- New features
- Bug fixes
- Known issues

### 1.5 Create Git Tag
```bash
git tag v1.0.0
git push origin v1.0.0
```

---

## Step 2: Configure Environment

### 2.1 Expo Configuration

Create `.env.production`:
```
EXPO_TOKEN=your_expo_token_here
EAS_BUILD_PROFILE=production
```

### 2.2 Environment Variables

Create backend `.env.production`:
```
NODE_ENV=production
API_URL=https://api.drinkaware.app
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_FIT_CLIENT_ID=...
GOOGLE_FIT_CLIENT_SECRET=...
APPLE_TEAM_ID=...
```

### 2.3 Verify Configuration
```bash
# Check all environment variables
echo $API_URL
echo $STRIPE_SECRET_KEY
echo $ANTHROPIC_API_KEY
```

---

## Step 3: iOS Deployment

### 3.1 Prepare iOS Build

```bash
eas build --platform ios --profile production
```

### 3.2 Expected Output
- Build ID logged (save for reference)
- iOS app binary (.ipa)
- Build available in EAS Dashboard

### 3.3 Test on TestFlight

1. Go to App Store Connect
2. TestFlight → Internal Testing
3. Add testers (team members)
4. Test all major flows
5. Wait for App Store review (24 hours)

### 3.4 Submit to App Store

```bash
eas submit --platform ios --profile production
```

Or manually through App Store Connect:
1. Go to App Store Connect
2. App → Version
3. Upload build from Xcode or transporter
4. Fill in all metadata
5. Submit for Review

### 3.5 Monitor Review Status

- Check App Store Connect daily
- Respond to any reviewer questions
- Review typically takes 24-48 hours
- If rejected: fix issues and resubmit

### 3.6 Release to Users

Once approved in App Store Connect:
1. Click "Release This Version"
2. Choose rollout strategy:
   - Immediate: All users
   - Gradual: 10% → 50% → 100%
3. Monitor crash rates and reviews

---

## Step 4: Android Deployment

### 4.1 Prepare Android Build

```bash
eas build --platform android --profile production
```

Expected output:
- Android app bundle (.aab)
- Available in EAS Dashboard

### 4.2 Test on Internal Track

1. Go to Google Play Console
2. Internal testing → Testers
3. Add testers
4. Create internal testing release
5. Test all features thoroughly
6. Check device compatibility

### 4.3 Test on Closed Beta

Create staged rollout:
1. Closed testing → Testers
2. 1% of users initially
3. Monitor for 24 hours
4. Watch crash reports

### 4.4 Submit to Production

```bash
eas submit --platform android --profile production
```

Or manually:
1. Google Play Console
2. Release → Production
3. Review auto-generated content rating
4. Set pricing and distribution
5. Submit for review

### 4.5 Monitor Play Store Review

- Review typically takes 2-4 hours
- Monitor in real-time
- Check for content policy violations
- If rejected: fix and resubmit

### 4.6 Release to Users

1. Once approved, release is live
2. Choose rollout strategy
3. Monitor crash reports
4. Watch for negative reviews

---

## Step 5: Post-Deployment Monitoring

### 5.1 First Hour Checklist
- [ ] App loads without crashes
- [ ] Authentication works
- [ ] Can log a drink
- [ ] Sync functions
- [ ] Push notifications send
- [ ] Deep links work
- [ ] Premium features accessible

### 5.2 First Day Monitoring
- [ ] Crash reports < 1%
- [ ] Error rate < 0.5%
- [ ] API latency normal
- [ ] Payment processing working
- [ ] User feedback positive
- [ ] Database performance good

### 5.3 First Week Metrics
- [ ] Daily active users tracking
- [ ] Feature adoption rates
- [ ] Retention rates (D1, D7)
- [ ] Crash rate trending down
- [ ] Performance stable

### 5.4 Dashboard Setup

Monitor in real-time:
- Sentry dashboard (crashes)
- App Store Connect (reviews)
- Google Play Console (analytics)
- Cloud monitoring (server health)
- Stripe dashboard (payments)

---

## Step 6: Rollback Procedure

If critical issue discovered:

### 6.1 iOS Rollback
```bash
# Remove version from App Store Connect
# Create fix and new build
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

### 6.2 Android Rollback
```bash
# Stop rollout in Play Console
# Create fix and new build
eas build --platform android --profile production
eas submit --platform android --profile production
```

### 6.3 Communicate Issue
1. Post status update
2. Notify affected users
3. Provide ETA for fix
4. Thank users for patience

---

## Troubleshooting

### Build Failures

**EAS Build Stuck:**
```bash
eas build:list      # Check build status
eas build:view <id> # View build details
```

**Dependency Issues:**
```bash
rm -rf node_modules
npm install
npm audit fix
```

### Submission Failures

**App Store Rejection:**
1. Read rejection reason carefully
2. Check Apple's review guidelines
3. Update code/metadata
4. Increment build number
5. Resubmit

**Play Store Rejection:**
1. Review content policy
2. Check app targeting
3. Verify permissions justified
4. Test on different devices
5. Resubmit with explanation

### Runtime Issues

**App Crashes:**
1. Check Sentry dashboard
2. Review crash logs
3. Reproduce locally
4. Fix and test thoroughly
5. Create hotfix release

**Performance Issues:**
1. Check API latency
2. Monitor database queries
3. Review memory usage
4. Profile with Profiler
5. Optimize bottlenecks

---

## Maintenance After Launch

### Weekly
- [ ] Monitor crash reports
- [ ] Review app reviews
- [ ] Check server health
- [ ] Verify payment processing
- [ ] Update status page

### Monthly
- [ ] Security audit
- [ ] Performance review
- [ ] Dependency updates
- [ ] Backup verification
- [ ] User feedback analysis

### Quarterly
- [ ] Major version planning
- [ ] Feature roadmap review
- [ ] Architecture audit
- [ ] Competitive analysis
- [ ] User research

---

## Deployment Timeline

| Phase | Duration | Activities |
|-------|----------|-----------|
| Pre-deployment | 2-3 days | Testing, configuration |
| iOS build & review | 2-3 days | Build, TestFlight, App Store review |
| Android build & review | 1-2 days | Build, closed beta, Play Store review |
| Monitoring | 1 week | Crash monitoring, user feedback |
| Stabilization | 2 weeks | Bug fixes, performance tuning |

**Total Timeline: ~2-3 weeks**

---

## Support Contacts

- **Technical Issues:** devops@drinkaware.app
- **App Store:** support-ios@drinkaware.app
- **Play Store:** support-android@drinkaware.app
- **General Support:** support@drinkaware.app
- **On-Call Engineer:** See incident channel

---

## Success Criteria

Launch is successful when:
- ✅ App available on both stores
- ✅ Crash rate < 1%
- ✅ Error rate < 0.5%
- ✅ Users can complete core flows
- ✅ Payment processing working
- ✅ Positive user reviews (3.5+ stars)
- ✅ No data loss reported
- ✅ API performance normal

---

**Next Release:** Plan v1.1.0 features in parallel
