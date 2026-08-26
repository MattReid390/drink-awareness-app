import {
  calculateUnits,
  getRemainingUnits,
  formatUnits,
  WEEKLY_UNIT_LIMIT,
  PRESET_UNITS,
} from '../../utils/units';

describe('Unit Utilities', () => {
  describe('calculateUnits', () => {
    it('should calculate units for a pint of lager (4% ABV)', () => {
      // Pint = 568ml at 4% = (568 * 4) / 1000 = 2.272 ≈ 2.3
      const units = calculateUnits(568, 4);
      expect(units).toBe(2.3);
    });

    it('should calculate units for a 175ml wine glass (12% ABV)', () => {
      // 175ml at 12% = (175 * 12) / 1000 = 2.1
      const units = calculateUnits(175, 12);
      expect(units).toBe(2.1);
    });

    it('should calculate units for a shot (25ml spirit, 40% ABV)', () => {
      // 25ml at 40% = (25 * 40) / 1000 = 1.0
      const units = calculateUnits(25, 40);
      expect(units).toBe(1.0);
    });

    it('should round to 1 decimal place', () => {
      // 500ml at 5% = (500 * 5) / 1000 = 2.5
      const units = calculateUnits(500, 5);
      expect(units).toBe(2.5);
    });

    it('should handle small volumes', () => {
      const units = calculateUnits(10, 40);
      expect(units).toBe(0.4);
    });

    it('should return 0 for 0 ABV', () => {
      const units = calculateUnits(568, 0);
      expect(units).toBe(0);
    });
  });

  describe('getRemainingUnits', () => {
    it('should return the difference between limit and logged', () => {
      const remaining = getRemainingUnits(5);
      expect(remaining).toBe(14 - 5);
    });

    it('should return 0 if already at limit', () => {
      const remaining = getRemainingUnits(14);
      expect(remaining).toBe(0);
    });

    it('should return 0 if over limit (not negative)', () => {
      const remaining = getRemainingUnits(20);
      expect(remaining).toBe(0);
    });

    it('should handle decimal logged units', () => {
      const remaining = getRemainingUnits(5.5);
      expect(remaining).toBe(8.5);
    });

    it('should use NHS weekly limit of 14 units', () => {
      expect(WEEKLY_UNIT_LIMIT).toBe(14);
    });
  });

  describe('formatUnits', () => {
    it('should format whole units without decimal', () => {
      expect(formatUnits(1)).toBe('1');
      expect(formatUnits(14)).toBe('14');
    });

    it('should format decimal units with 1 decimal place', () => {
      expect(formatUnits(2.3)).toBe('2.3');
      expect(formatUnits(1.4)).toBe('1.4');
    });

    it('should handle .0 as whole number', () => {
      expect(formatUnits(5.0)).toBe('5');
    });

    it('should format small decimals', () => {
      expect(formatUnits(0.5)).toBe('0.5');
      expect(formatUnits(0.1)).toBe('0.1');
    });
  });

  describe('PRESET_UNITS', () => {
    it('should have preset for pint of lager', () => {
      expect(PRESET_UNITS['pint-lager']).toBe(2.3);
    });

    it('should have preset for gin & tonic', () => {
      expect(PRESET_UNITS['gin-tonic']).toBe(1.4);
    });

    it('should have preset for wine glass', () => {
      expect(PRESET_UNITS['wine-175ml']).toBe(2.1);
    });

    it('should have preset for shot', () => {
      expect(PRESET_UNITS['shot']).toBe(1.0);
    });

    it('should have all expected presets', () => {
      const expectedKeys = [
        'pint-lager',
        'gin-tonic',
        'wine-175ml',
        'shot',
        'bottle-beer',
        'cider-pint',
      ];
      expectedKeys.forEach((key) => {
        expect(PRESET_UNITS[key]).toBeDefined();
      });
    });
  });
});
