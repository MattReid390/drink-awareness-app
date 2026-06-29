// Utility functions for date formatting and manipulation
// Used across summary screens and drink entry rows

// Returns today's date as a YYYY-MM-DD string
export const getTodayString = (): string => {
    return new Date().toISOString().split('T')[0];
};

// Formats a YYYY-MM-DD string for display (e.g. Tuesday 17 June 2026)
export const formatDateLong = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric', 
    });
};

// Formats a YYYY-MM-DD string for display (e.g. Tue 17 June 2026)
export const formatDateShort = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric', 
    });
};

// Formats a time string for display (e.g. 9:41pm)
export const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

// Returns the Monday of the week containing the given date
export const getWeekStart = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDay();
    // Adjust so Monday = 0 (getDay returns 0 for Sunday)
    const diff = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + diff);
    return date.toISOString().split('T')[0];
};

// Returns the Sunday of the week containing the given date
export const getWeekEnd = (dateString: string): string => {
    const weekStart = new Date(getWeekStart(dateString));
    weekStart.setDate(weekStart.getDate() + 6);
    return weekStart.toISOString().split('T')[0];
};

// Returns and array of 7 day strings (Mon-Sun) for a given week
export const getWeekDays = (weekStart: string): string[] => {
    const days: string[] = [];
    const start = new Date(weekStart);
    for (let i = 0; i < 7; i++) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        days.push(day.toISOString().split('T')[0]);
    };
    return days
};

// Returns the previous day as YYYY-MM-DD string
export const getPreviousDay = (dateString: string): string => {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
};

// Returns the next day as a YYYY-MM-DD string
export const getNextDay = (dateString: string): string => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
};

// Returns the short day name for a YYYY-MM-DD string (e.g. Mon, Tue, Wed)
export const getDayName = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        weekday: 'short',
    });
};