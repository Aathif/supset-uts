import { stringifyTimeRange } from './stringifyTimeRange';

describe('stringifyTimeRange', () => {
  it('should return null if any element in the extent does not have toISOString method', () => {
    const extentWithInvalidDate = [new Date(), { notADate: true }];
    expect(stringifyTimeRange(extentWithInvalidDate)).toBeNull();
  });

  it('should return a string representation of the date range', () => {
    const date1 = new Date('2024-01-01T00:00:00Z');
    const date2 = new Date('2024-12-31T23:59:59Z');
    const extent = [date1, date2];

    expect(stringifyTimeRange(extent)).toBe('2024-01-01T00:00:00 : 2024-12-31T23:59:59');
  });

  it('should handle an extent with the same date', () => {
    const sameDate = new Date('2024-01-01T00:00:00Z');
    const extent = [sameDate, sameDate];

    expect(stringifyTimeRange(extent)).toBe('2024-01-01T00:00:00 : 2024-01-01T00:00:00');
  });

  it('should return null for an empty extent', () => {
    expect(stringifyTimeRange([])).toBeNull();
  });

  it('should return null if extent contains a non-date object', () => {
    const extentWithNonDate = [new Date(), 'not a date'];
    expect(stringifyTimeRange(extentWithNonDate)).toBeNull();
  });
});
