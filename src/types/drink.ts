// Data models for drink logging
// Matches the MVP data requirements from doc 11

export interface Drink {
  id: string; // Unique identifier (UUID)
  name: string; // Drink name - required (DAA-048)
  time: string; // ISO timestamp - required (DAA-048)
  type?: string; // Drink type - optional (e.g. Beer, Wine, Spirit)
  servingSize?: string; // Serving size - optional (e.g. Pint, 175ml)
  units?: number; // Alcohol units - calculated or entered
  price?: number; // Price in GBP - optional
  venue?: string; // Venue name - optional
  notes?: string; // Free text notes - optional
}

export interface DailyLog {
  date: string; // Date string in YYYY-MM-DD format
  drinks: Drink[]; // All drinks logged for this day
  totalDrinks: number; // Count of drinks for the day
  totalUnits: number; // Sum of units for the day
  totalSpend: number; // Sum of prices for the day in GBP
}

export interface WeeklyLog {
  weekStart: string; // Monday date in YYYY-MM-DD format
  weekEnd: string; // Sunday date in YYYY-MM-DD format
  days: DailyLog[]; // One entry per day of the week
  totalDrinks: number; // Sum of drinks for the week
  totalUnits: number; // Sum of units for the week
  totalSpend: number; // Sum of spend for the week in GBP
}

// Quick-select preset drink definition
export interface PresetDrink {
  id: string; // Unique identifier for the preset
  name: string; // Display name (e.g. Pint of lager)
  type: string; // Drink type (e.g. Beer)
  servingSize: string; // Serving size(e.g. Pint)
  units: number; // Pre-calculated units
}
