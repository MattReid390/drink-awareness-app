// Navigation route parameter definitions
// Ensures type safety when navigating between screens

import { Drink } from "./drink";
import { Venue } from "./venue";

// Root stack - handles age confirmation gate before main app
export type RootStackParamList = {
    AgeConfirmation: undefined;     // No params - first launch only
    MainTabs: undefined;            // No params - entry to tab navigator
};

// Bottom tab navigator - 5 main tabs
export type TabParamList = {
    Home: undefined;                // S03 - no params
    Venues: undefined;              // S04 - no params
    Log: undefined;                 // S08 - no params
    Summary: undefined;             // S10 - no params
    Settings: undefined;            // S14 - no params
};

// Venue stack - nested inside Venues tab
export type VenueStackParamList = {
    VenueList: undefined;           // S04 - no params
    MapView: undefined;             // S05 - no params
    VenueDetail: { venue: Venue };  // S06 - requires venue object
    DrinkDetail: { venue: Venue };  // S07 - requires venue object
};

// Summary stack - nested inside Summary tab
export type SummaryStackParamList = {
    DailySummary: { date?: string };        // S10 - optional date (defaults to today)
    WeeklySummary: { weekStart?: string };  // S11 - optional week start date
    AIInsights: undefined;                  // S12 - no params
};

// Log stack - nested inside Log tab
export type LogStackParamList = {
    LogDrink: { prefillDrink?: Partial<Drink> };    // S08 - optional prefill from venue menu
};