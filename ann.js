import moment from 'moment';

describe('parseMetricValue', () => {
  test('returns timestamp for valid ISO 8601 date string', () => {
    const dateString = '2023-08-06T12:00:00Z';
    const expectedTimestamp = moment.utc(dateString).valueOf();
    expect(parseMetricValue(dateString)).toBe(expectedTimestamp);
  });

  test('returns 0 for invalid date string', () => {
    const invalidDateString = 'invalid-date';
    expect(parseMetricValue(invalidDateString)).toBe(0);
  });

  test('returns the same number when metricValue is a number', () => {
    const numberValue = 42;
    expect(parseMetricValue(numberValue)).toBe(numberValue);
  });

  test('returns 0 when metricValue is null', () => {
    expect(parseMetricValue(null)).toBe(0);
  });

  test('returns 0 when metricValue is undefined', () => {
    expect(parseMetricValue(undefined)).toBe(0);
  });

  test('returns 0 for empty string', () => {
    expect(parseMetricValue('')).toBe(0);
  });
});
