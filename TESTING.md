# End-to-End Testing Guide — Phase 5

Complete testing checklist for the Drink Awareness App MVP. Test on both iOS and Android.

---

## 1. First-Time Launch & Age Gate

### Test Case 1.1: Age Confirmation Gate
- [ ] App shows age confirmation screen on first launch
- [ ] "I confirm I'm 18+" button exists and is accessible
- [ ] Tapping button confirms age
- [ ] Age gate never appears again (even after force-close)
- [ ] Back button doesn't return to age gate
- [ ] App proceeds to Home screen after confirmation

---

## 2. Home Screen (S03)

### Test Case 2.1: Today's Stats Display
- [ ] App bar shows "Drink Aware" title
- [ ] "Today" stats show correct values (0 if no drinks logged)
- [ ] Stats update after logging drinks
- [ ] "+ Log a drink" button is accessible

### Test Case 2.2: Insight Card
- [ ] Insight card displays when drinks logged today
- [ ] Insight is dismissible
- [ ] Insight doesn't reappear after dismissal
- [ ] "View all insights" shortcut navigates to AI Insights screen

### Test Case 2.3: Shortcuts
- [ ] "Venues" shortcut navigates to Venues tab
- [ ] "This week" shortcut navigates to Weekly Summary
- [ ] "View all insights" shortcut navigates to AI Insights
- [ ] All shortcuts are tappable and responsive

---

## 3. Drink Logging (S08)

### Test Case 3.1: Required Fields
- [ ] Drink name input accepts text
- [ ] Time input shows current time by default
- [ ] Save button disabled until name is provided (optional: check this)
- [ ] Save with only name and time succeeds

### Test Case 3.2: Optional Fields
- [ ] Price input accepts decimal values
- [ ] Venue input accepts venue names
- [ ] Type dropdown shows options (if implemented)
- [ ] Notes input accepts longer text
- [ ] All optional fields are truly optional

### Test Case 3.3: Quick-Select Pills
- [ ] Preset drink pills display (Pint of Lager, Gin & Tonic, etc.)
- [ ] Tapping pill pre-fills form (if implemented)
- [ ] Pre-filled drinks can be modified before saving

### Test Case 3.4: Save Flow
- [ ] Tapping "Save drink" saves to storage
- [ ] Success feedback appears (alert or toast)
- [ ] Screen can log multiple drinks in succession
- [ ] Cancel button returns to previous screen
- [ ] Logged drink appears in Daily Summary immediately

---

## 4. Daily Summary (S10)

### Test Case 4.1: Stats Display
- [ ] Drinks logged today count is accurate
- [ ] Units calculation is correct
- [ ] Spent total is accurate
- [ ] Stats update when logged drinks viewed

### Test Case 4.2: Date Navigation
- [ ] Can navigate to previous days (← button)
- [ ] Can navigate to future days (only up to today)
- [ ] Forward button (›) disabled when on today
- [ ] Date label shows correct date (e.g., "Tuesday 17 June 2026")

### Test Case 4.3: Drink List
- [ ] All drinks for the day display in a list
- [ ] Each drink shows name, time, type, units, price
- [ ] Empty state shows when no drinks logged for the day
- [ ] Tapping empty state CTA navigates to Log screen

### Test Case 4.4: Insights
- [ ] Daily insight shows if drinks logged
- [ ] Insight is dismissible
- [ ] "Log another drink" button navigates to Log screen

---

## 5. Weekly Summary (S11)

### Test Case 5.1: Week Navigation
- [ ] Week label shows correct date range
- [ ] Can navigate to previous weeks (← button)
- [ ] Can navigate to future weeks (only up to current week)
- [ ] Forward button (›) disabled on current week

### Test Case 5.2: Chart Display
- [ ] Bar chart displays for all 7 days
- [ ] Bar height represents drink count
- [ ] Today's bar is highlighted (navy color)
- [ ] Days with 0 drinks show empty bar (grey)
- [ ] Drink count labels appear above bars

### Test Case 5.3: Stats
- [ ] Weekly totals (drinks, units, spent) are accurate
- [ ] Stats reflect selected week's data
- [ ] Stats update when week changes

### Test Case 5.4: Day Rows
- [ ] Day rows display for all 7 days
- [ ] Today's row is highlighted (blue day name)
- [ ] Tapping day row navigates to Daily Summary for that date
- [ ] Day stats (drinks, units) match chart data
- [ ] Empty state shows when no drinks logged all week

---

## 6. AI Insights (S12)

### Test Case 6.1: Insight Generation
- [ ] Insights load when screen opens
- [ ] Loading state shows during generation
- [ ] Daily insight displays (if drinks logged today)
- [ ] Weekly insight displays (if drinks logged this week)
- [ ] Each insight shows data basis (transparency)

### Test Case 6.2: Insight Quality
- [ ] Insights are friendly and non-judgmental
- [ ] Insights don't contain medical advice
- [ ] Insights are contextually relevant
- [ ] Insights use user's data (drink count, units, spend)

### Test Case 6.3: Dismissal & Refresh
- [ ] Individual insights are dismissible
- [ ] Dismissed insights don't reappear until screen refresh
- [ ] Refresh button (↻) regenerates all insights
- [ ] Insights update after logging new drinks

### Test Case 6.4: Empty State
- [ ] Empty state shows when no drinks logged
- [ ] Empty state CTA navigates to Log screen

---

## 7. Venues Discovery (S04, S05, S06, S07)

### Test Case 7.1: Venue List (S04)
- [ ] All venues display in list view
- [ ] Search filter works (type venue name)
- [ ] Category filter pills work (All, Pub, Bar, etc.)
- [ ] Tapping venue navigates to Venue Detail
- [ ] Map button in app bar navigates to Map view
- [ ] Empty state shows when no venues match filters

### Test Case 7.2: Map View (S05)
- [ ] Map displays with all venues as markers
- [ ] Markers show venue name on tap
- [ ] Tapping marker shows bottom sheet with venue info
- [ ] "View details" button navigates to Venue Detail
- [ ] "List" button returns to Venue List view
- [ ] Map is interactive (zoom, pan)

### Test Case 7.3: Venue Detail (S06)
- [ ] Venue name and type display prominently
- [ ] Address shows correctly
- [ ] Today's opening hours display
- [ ] Phone number displays (if available)
- [ ] "View drink menu" navigates to Drink Menu
- [ ] "Log a drink here" navigates to Log screen with venue pre-filled
- [ ] Back button returns to previous venue screen (List or Map)

### Test Case 7.4: Drink Menu (S07)
- [ ] Venue name shows in app bar
- [ ] All drinks display grouped by category
- [ ] Category tabs work (All, Beers, Wines, Spirits)
- [ ] Each drink shows name, ABV, price
- [ ] "+" button logs drink and navigates to Log screen
- [ ] Back button returns to Venue Detail

---

## 8. Settings (S14)

### Test Case 8.1: Weekly Goal
- [ ] Current weekly goal displays (default 14)
- [ ] Tapping row opens prompt to edit goal
- [ ] Entering number updates and saves goal
- [ ] Goal persists after app close/reopen

### Test Case 8.2: Info Rows
- [ ] "About this app" row displays disclaimer
- [ ] "UK unit guidelines" row navigates to NHS website
- [ ] "Support resources" row navigates to NHS website
- [ ] External links open in browser

### Test Case 8.3: Reset Data
- [ ] "Reset all data" row displays destructive styling (red)
- [ ] Tapping shows confirmation alert
- [ ] Confirming reset clears all data (drinks, goal, settings)
- [ ] After reset, app navigates to Home screen
- [ ] Drink count is 0 after reset

### Test Case 8.4: Footer
- [ ] "No account, no sign-in..." text displays
- [ ] Reassures user data is local-only

---

## 9. Data Persistence & Sessions

### Test Case 9.1: Drink Persistence
- [ ] Log a drink
- [ ] Force close the app
- [ ] Reopen the app
- [ ] Drink is still in Daily Summary (same date)
- [ ] Drink is still in Weekly Summary
- [ ] Drink count is accurate

### Test Case 9.2: Settings Persistence
- [ ] Change weekly goal in Settings
- [ ] Force close the app
- [ ] Reopen the app
- [ ] Weekly goal is unchanged
- [ ] Dismissing insights persists until new session

### Test Case 9.3: Navigation State
- [ ] Navigate to Weekly Summary, view past week
- [ ] Switch to Log tab
- [ ] Switch back to Summary tab
- [ ] Past week is still displayed (state preserved)

---

## 10. API Integration (AI Insights)

### Test Case 10.1: Anthropic API
- [ ] Insights generate using Claude API
- [ ] API key from env is properly used
- [ ] Response parsing works correctly
- [ ] Insights display with proper formatting

### Test Case 10.2: Fallback Behavior
- [ ] If API call fails, rule-based fallback generates insight
- [ ] Fallback insight is friendly and informative
- [ ] App doesn't crash if API fails
- [ ] User sees some insight regardless of API status

### Test Case 10.3: Offline Mode
- [ ] If no network, fallback generates insight
- [ ] Fallback insights are helpful and relevant
- [ ] App remains stable without internet

---

## 11. Cross-Platform & Device

### Test Case 11.1: iOS
- [ ] All features work on iOS
- [ ] Safe area respected (notch, home indicator)
- [ ] Status bar styling correct
- [ ] All fonts render correctly
- [ ] Colors match design spec

### Test Case 11.2: Android
- [ ] All features work on Android
- [ ] Status bar respected
- [ ] Hardware back button navigates correctly
- [ ] Navigation gestures work
- [ ] All fonts render correctly

### Test Case 11.3: Screen Sizes
- [ ] Test on small phone (iPhone SE, small Android)
- [ ] Test on large phone (iPhone 15 Pro Max, Pixel 7 Pro)
- [ ] Test on tablet (iPad, Android tablet)
- [ ] Layouts scale correctly
- [ ] Text is readable at all sizes

---

## 12. Error Handling & Edge Cases

### Test Case 12.1: Invalid Input
- [ ] Empty drink name doesn't save
- [ ] Invalid price format handled gracefully
- [ ] Very long text fields truncated/scrollable
- [ ] Special characters in inputs handled

### Test Case 12.2: Navigation Edge Cases
- [ ] Rapid tab switching doesn't crash app
- [ ] Deep navigation (3+ levels) works correctly
- [ ] Back button from all screens works
- [ ] Can't navigate to invalid screens

### Test Case 12.3: Network Issues
- [ ] App works offline (except API calls)
- [ ] Reconnection triggers insight refresh
- [ ] No crashes due to network timeout
- [ ] Graceful degradation shown to user

### Test Case 12.4: Memory
- [ ] App doesn't crash after 100 logged drinks
- [ ] Rapid logging doesn't cause memory leak
- [ ] Switching tabs repeatedly is stable
- [ ] Long app session (1+ hour) is stable

---

## 13. User Flow Tests

### Test Case 13.1: Complete First-Time User Journey
1. Open app → Age gate
2. Confirm age
3. View Home screen (0 drinks)
4. Tap "+ Log a drink"
5. Log first drink (name, time only)
6. Save
7. See drink in Daily Summary
8. Tap "This week" shortcut
9. See drink in Weekly Summary
10. View AI Insights
11. Change weekly goal in Settings
12. Verify data persists

### Test Case 13.2: Venue-Based Logging
1. Tap Venues tab
2. Search for venue
3. Tap venue card
4. View venue details
5. Tap "View drink menu"
6. Tap "+" on a drink
7. Modify/save drink
8. Verify drink logged with venue name

### Test Case 13.3: Map Exploration
1. Tap Venues tab
2. Tap "Map" button
3. Tap marker
4. View bottom sheet
5. Tap "View details"
6. Tap "View drink menu"
7. Log drink
8. Verify drink has venue

### Test Case 13.4: Multi-Day Logging
1. Log drinks on Monday
2. Log drinks on Tuesday
3. Navigate to Wednesday (tomorrow)
4. Navigate back to Monday
5. Verify correct drinks per day
6. Check Weekly Summary totals
7. Check AI Insights for week

---

## Testing Checklist Summary

**Total Test Cases: 100+**

- [ ] Age gate & first launch
- [ ] Home screen display & actions
- [ ] Drink logging (all fields)
- [ ] Daily summary & navigation
- [ ] Weekly summary & analytics
- [ ] AI insights generation
- [ ] Venue list & search
- [ ] Map view & interaction
- [ ] Venue details & menu
- [ ] Settings & preferences
- [ ] Data persistence across sessions
- [ ] API integration
- [ ] Fallback behavior
- [ ] iOS functionality
- [ ] Android functionality
- [ ] Edge cases & errors
- [ ] Complete user journeys

---

## Known Limitations (Accepted for MVP)

- Venue data is placeholder (not real venues)
- Drink menu is placeholder (not real drinks)
- Deep linking not implemented
- Offline deep analytics not available
- API key in .env (should use backend in production)
- No user accounts or cloud sync
- No multi-language support

---

## Next Steps (Phase 6+)

- Real venue data integration (Foursquare, Google Places API)
- Real drink menu data integration
- Backend server for data sync
- User authentication & accounts
- Social features (share stats)
- Push notifications for milestones
- Advanced analytics & trends
- Accessibility improvements (A11y)

---

**Last Updated:** August 10, 2026
**Tester Instructions:** Work through each test case. Mark [ ] when complete. Report any failures as bugs with reproduction steps.
