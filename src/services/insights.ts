// AI insights service - Anthropic API with rule-based fallback
// Every insight includes a data basis explanation (DAA-049)
// No medical advice or clinical language is used anywhere in this file

import { DailyLog, WeeklyLog } from "../types";
import { WEEKLY_UNIT_LIMIT } from "../utils";

// Structure for a single insight card
export interface Insight {
    id: string,         // Unique identifier for the insight
    text: string,       // Insight body copy - friendly, non-judgemental tone
    dataBasis: string,  // Explains what data the insight is based on (DAA-049)
};

// --- Anthropic API ---------------------------------------------------

// Calls the Anthropic API to generate an insight based on the user's log
const fetchAPIInsight = async (
    prompt: string
): Promise<string | null> => {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.EXPO_PUBLIC_ANTHROPIC_KEY ?? '',
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-haiku-4-5',  // Lightweight model for fast insights
                max_tokens: 120,            // Keep insights concise
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        const data = await response.json();
        return data?.content?.[0]?.text ?? null;
    } catch {
        // Return null if API call fails - fallback will handle it
        return null;
    };
};

// --- Prompt Builder ---------------------------------------------------

// Builds a safe, non-judgemental prompt for daily insights
const buildDailyPrompt = (log: DailyLog): string => {
    return `
        You are a friendly, non-judgemental drink awareness assistant.
        The user has logged ${log.totalDrinks} drinks today, totalling ${log.totalUnits} units and £${log.totalSpend.toFixed(2)}.
        Write one short, friendly observation (max 2 sentences) to help them stay aware of their drinking.
        Do not give medical advice. Do not use clinical language. Do not be preachy or alarming.
        Respond with the insight text only — no preamble or labels.
    `.trim();
};

// Builds a safe, non-judgemental prompt for weekly insights
const buildWeeklyPrompt = (log: WeeklyLog): string => {
    return `
        You are a friendly, non-judgmental drink awareness assistant.
        The user has logged ${log.totalDrinks} drinks this week, totalling ${log.totalUnits} units and £${log.totalSpend.toFixed(2)}.
        The UK weekly guideline is ${WEEKLY_UNIT_LIMIT} units.
        Write one short, friendly observation (max 2 sentences) to help them stay aware of their drinking.
        Do not give medical advice. Do not use clinical language. Do not be preachy or alarming.
        Respond with the insight text only — no preamble or labels.
    `.trim();
};

// --- Rule-Based Fallback ---------------------------------------------------

// Generates a simple insight without the API
// Used when the API is unavailable or returns no result
const getFallBackDailyInsight = (log: DailyLog): string => {
    if (log.totalDrinks === 0) {
        return "You haven't logged any drinks today - a good day to stay hydrated.";
    }
    if (log.totalUnits > 6) {
        return "You've logged ${log.totalUnits} units today. Worth keeping an eye on the rest of the week.";
    }
    return "You've logged ${log.totalDrinks} drink${log.totalDrinks > 1 ? 's' : ''} today, totalling ${log.totalUnits} units.";
};

const getFallbackWeeklyInsight = (log: WeeklyLog): string => {
    if (log.totalDrinks === 0) {
        return "No drinks logged this week - a great baseline to track from.";
    }
    if (log.totalUnits > WEEKLY_UNIT_LIMIT) {
        return "You've logged ${log.totalUnits} units this week, above the ${WEEKLY_UNIT_LIMIT}-unit guideline. Useful to know for planning ahead.";
    }
    return "You've logged ${log.totalUnits} units across ${log.totalDrinks} drink${log.totalDrinks > 1 ? 's' : ''} this week.";
};

// --- Public API ---------------------------------------------------

// Returns an insight for a given daily log
// Tries Anthropic API first, falls back to rule-based if unavailable
export const getDailyInsight = async (log: DailyLog): Promise<Insight> => {
    const prompt = buildDailyPrompt(log);
    const apiText = await fetchAPIInsight(prompt);

    return {
        id: `daily-${log.date}`,
        text: apiText ?? getFallBackDailyInsight(log),
        dataBasis: `Based on your ${log.totalDrinks} logged drink${log.totalDrinks !== 1 ? 's' : ''} today`,
    };
};

// Returns an insight for a given weekly log
// Tries Anthropic API first, falls back to rule-based if unavailable
export const getWeeklyInsight = async (log: WeeklyLog): Promise<Insight> => {
    const prompt = buildWeeklyPrompt(log);
    const apiText = await fetchAPIInsight(prompt);

    return {
        id: `weekly-${log.weekStart}`,
        text: apiText ?? getFallbackWeeklyInsight(log),
        dataBasis: `Based on your ${log.totalDrinks} logged drink${log.totalDrinks !== 1 ? 's' : ''} this week`,
    };
};