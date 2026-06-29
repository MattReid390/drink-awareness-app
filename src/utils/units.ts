// Utility functions for calculating alcohol units
// Used in LogDrinkScreen and drink entry rows

// Standard UK unit calculation formula:
// Units = (volume in ml x ABV%) / 1000
export const calculateUnits = (volumeMl: number, abvPercent: number): number => {
    const units = (volumeMl * abvPercent) / 1000;
    // Round to 1 decimal place for display
    return Math.round(units * 10) / 10;
};

// Weekly unit guideline for the UK (NHS recommendation)
export const WEEKLY_UNIT_LIMIT = 14;

// Pre-calculated units for quick-select preset drinks (DAA-047)
export const PRESET_UNITS: Record<string, number> = {
    'pint-lager': 2.3,      // Pint of lager at 4% ABV
    'gin-tonic': 1.4,       // Single gin & tonic at 37.5% ABV
    'wine-175ml': 2.1,      // 175ml wine at 12% ABV
    'shot': 1.0,            // 25ml spirit at 40% ABV
    'bottle-beer': 1.7,     // 330ml bottle at 5% ABV
    'cider-pint': 2.6,      // Pint of cider at 4.5% ABV
};

// Returns remaining units for the week based on logged total
export const getRemainingUnits = (loggedUnits: number): number => {
    const remaining = WEEKLY_UNIT_LIMIT - loggedUnits;
    // Return 0 if over the limit rather than a negative number
    return Math.max(0, Math.round(remaining * 10) / 10);
};

// Formats a unit count for display (e.g. 2.3, not 2.30)
export const formatUnits = (units: number): string => {
    return units % 1 === 0 ? units.toString() : units.toFixed(1);
}