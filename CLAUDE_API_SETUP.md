# Claude API Integration Setup

## Overview

The coaching feature now uses Claude AI to generate personalized drinking recommendations based on user patterns. This requires a backend service to handle Claude API calls.

## Backend Requirements

### Environment Variables

Set these in your backend `.env`:

```env
CLAUDE_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_API_VERSION=2023-06-01
```

### API Endpoints

The following endpoints must be implemented in your backend:

#### 1. Generate Coaching Recommendation

```
POST /claude/coaching/generate
```

**Request Body:**
```json
{
  "recentDrinks": [
    {
      "id": "drink_1",
      "type": "beer",
      "abv": 5.0,
      "quantity": 12,
      "time": "2026-10-05T20:00:00Z",
      "venue": "The Bar"
    }
  ],
  "dismissedTopics": [1, 2, 3]
}
```

**Response:**
```json
{
  "id": 123,
  "topic": "Daily Limits",
  "recommendation": "You've exceeded daily recommendations 3 times this week...",
  "severity": "warning",
  "createdAt": "2026-10-05T20:00:00Z",
  "reasoning": "User had 2 beers today, exceeding recommended 1-2 units"
}
```

**Logic:**
- Analyze recent drinks (14-day window)
- Use Claude API to generate personalized recommendation
- Determine severity based on drinking patterns
- Store recommendation with UUID and timestamp
- Filter out dismissed topics
- Consider user's weekly goals and streak status

#### 2. Dismiss Recommendation

```
POST /claude/coaching/{id}/dismiss
```

**Response:**
```json
{
  "success": true
}
```

### Claude Prompt Template

```
You are a health coach specialized in helping people develop healthier drinking habits.

Analyze the user's recent drinking data and provide ONE specific, actionable recommendation.

User's Recent Drinks (past 14 days):
{recentDrinks}

User's Weekly Goal: {weeklyGoal} units/week
Current Streak: {streakDays} days
Average Daily: {averageDaily} units/day

Create a recommendation addressing:
1. Patterns you notice in their drinking (timing, frequency, volume)
2. One specific, actionable suggestion
3. Positive reinforcement if they're doing well

Format response as JSON:
{
  "topic": "one-two word category",
  "recommendation": "2-3 sentence recommendation",
  "severity": "info|warning|critical",
  "reasoning": "why you made this suggestion"
}

Severity guidelines:
- info: positive reinforcement, light suggestions
- warning: patterns emerging that need attention
- critical: concerning trends that need immediate action

Topics to avoid (already dismissed): {dismissedTopics}
```

## Rate Limiting

- Minimum 1 hour between recommendation generations per user
- Cache recommendations locally for 24 hours
- Clean up dismissed coaching after 30 days

## Testing

### Mock Response (Development)

For local testing without Claude API:

```javascript
const mockRecommendation = {
  id: Math.floor(Math.random() * 10000),
  topic: "Pace Control",
  recommendation: "Try spacing drinks further apart. Slower sipping helps you stay within goals.",
  severity: "info",
  createdAt: new Date().toISOString(),
};
```

### Sample Request

```bash
curl -X POST http://localhost:3000/claude/coaching/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -d '{
    "recentDrinks": [{
      "id": "drink_123",
      "type": "beer",
      "abv": 5.0,
      "quantity": 12,
      "time": "2026-10-05T20:00:00Z"
    }],
    "dismissedTopics": []
  }'
```

## Error Handling

The frontend handles these errors gracefully:

- `429 Too Soon` — User must wait before generating new recommendation (show cooldown message)
- `429 Rate Limited` — API rate limit exceeded (show generic error, retry after 60s)
- `500 Server Error` — Backend error (show error alert, allow retry)
- Network timeout — Offline (cached recommendations shown)

## Future Enhancements

- [ ] Stream recommendations for better UX
- [ ] Batch API calls for efficiency
- [ ] Track which recommendations users find most helpful
- [ ] A/B test different prompt styles
- [ ] Multilingual support with locale-aware prompts
- [ ] Integration with Apple HealthKit/Google Fit for holistic health analysis
