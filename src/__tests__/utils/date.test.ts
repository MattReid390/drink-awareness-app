import {
  getTodayString,
  formatDateLong,
  formatDateShort,
  formatTime,
  getWeekStart,
  getWeekEnd,
  getWeekDays,
  getPreviousDay,
  getNextDay,
  getDayName,
  getTodayDayName,
} from '../../utils/date';

describe('Date Utilities', () => {
  describe('getTodayString', () => {
    it('should return today in YYYY-MM-DD format', () => {
      const today = getTodayString();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should match actual today', () => {
      const today = getTodayString();
      const expectedToday = new Date().toISOString().split('T')[0];
      expect(today).toBe(expectedToday);
    });
  });

  describe('formatDateLong', () => {
    it('should format date in long format with day, month, year', () => {
      const formatted = formatDateLong('2026-08-26');
      // Should contain numeric day, month name, and year (format varies by locale)
      expect(formatted).toMatch(/26/);
      expect(formatted).toMatch(/August|Aug/);
      expect(formatted).toMatch(/2026/);
    });

    it('should handle different dates', () => {
      const formatted = formatDateLong('2026-01-01');
      expect(formatted).toMatch(/2026/);
      expect(formatted).toMatch(/January|Jan/);
    });
  });

  describe('formatDateShort', () => {
    it('should format date in short format', () => {
      const formatted = formatDateShort('2026-08-26');
      // Should be shorter than long format and contain date/month/year
      expect(formatted).toMatch(/26/);
      expect(formatted).toMatch(/2026/);
    });
  });

  describe('formatTime', () => {
    it('should format ISO time with hour and minute', () => {
      const formatted = formatTime('2026-08-26T21:30:00');
      // Should contain time in various formats depending on locale
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should handle afternoon times', () => {
      const formatted = formatTime('2026-08-26T14:30:00');
      // Should contain time and pm indicator (may vary by locale)
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should handle morning times', () => {
      const formatted = formatTime('2026-08-26T09:15:00');
      // Should contain time and am indicator (may vary by locale)
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    });
  });

  describe('getWeekStart', () => {
    it('should return Monday of the week', () => {
      // 2026-08-26 is a Wednesday
      const weekStart = getWeekStart('2026-08-26');
      expect(weekStart).toBe('2026-08-24'); // Monday
    });

    it('should return same date if already Monday', () => {
      // 2026-08-24 is a Monday
      const weekStart = getWeekStart('2026-08-24');
      expect(weekStart).toBe('2026-08-24');
    });

    it('should handle Sunday correctly', () => {
      // 2026-08-23 is a Sunday
      const weekStart = getWeekStart('2026-08-23');
      expect(weekStart).toBe('2026-08-17'); // Previous Monday
    });
  });

  describe('getWeekEnd', () => {
    it('should return Sunday of the week', () => {
      // 2026-08-26 is a Wednesday
      const weekEnd = getWeekEnd('2026-08-26');
      expect(weekEnd).toBe('2026-08-30'); // Sunday
    });

    it('should be 6 days after week start', () => {
      const date = '2026-08-26';
      const weekStart = getWeekStart(date);
      const weekEnd = getWeekEnd(date);

      const startDate = new Date(weekStart);
      const endDate = new Date(weekEnd);
      const diff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

      expect(diff).toBe(6);
    });
  });

  describe('getWeekDays', () => {
    it('should return array of 7 days', () => {
      const days = getWeekDays('2026-08-24');
      expect(days.length).toBe(7);
    });

    it('should start on Monday and end on Sunday', () => {
      const days = getWeekDays('2026-08-24');
      expect(days[0]).toBe('2026-08-24'); // Monday
      expect(days[6]).toBe('2026-08-30'); // Sunday
    });

    it('should have consecutive dates', () => {
      const days = getWeekDays('2026-08-24');
      for (let i = 1; i < days.length; i++) {
        const current = new Date(days[i]);
        const previous = new Date(days[i - 1]);
        const diff = (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24);
        expect(diff).toBe(1);
      }
    });
  });

  describe('getPreviousDay', () => {
    it('should return previous day', () => {
      const prevDay = getPreviousDay('2026-08-26');
      expect(prevDay).toBe('2026-08-25');
    });

    it('should handle month boundaries', () => {
      const prevDay = getPreviousDay('2026-09-01');
      expect(prevDay).toBe('2026-08-31');
    });

    it('should handle year boundaries', () => {
      const prevDay = getPreviousDay('2026-01-01');
      expect(prevDay).toBe('2025-12-31');
    });
  });

  describe('getNextDay', () => {
    it('should return next day', () => {
      const nextDay = getNextDay('2026-08-26');
      expect(nextDay).toBe('2026-08-27');
    });

    it('should handle month boundaries', () => {
      const nextDay = getNextDay('2026-08-31');
      expect(nextDay).toBe('2026-09-01');
    });

    it('should handle year boundaries', () => {
      const nextDay = getNextDay('2025-12-31');
      expect(nextDay).toBe('2026-01-01');
    });
  });

  describe('getDayName', () => {
    it('should return short day name', () => {
      expect(getDayName('2026-08-24')).toBe('Mon');
      expect(getDayName('2026-08-26')).toBe('Wed');
      expect(getDayName('2026-08-30')).toBe('Sun');
    });
  });

  describe('getTodayDayName', () => {
    it('should return lowercase day name', () => {
      const dayName = getTodayDayName();
      const validDays = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      expect(validDays).toContain(dayName);
    });

    it('should be lowercase', () => {
      const dayName = getTodayDayName();
      expect(dayName).toBe(dayName.toLowerCase());
    });
  });
});
