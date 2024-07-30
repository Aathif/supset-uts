import { getXAxisFormatter } from './getXAxisFormatter'; // Adjust the import path as needed
import { getTimeFormatter, smartDateFormatter } from '@superset-ui/core';

// Mock the getTimeFormatter function and smartDateFormatter.id for isolated testing
jest.mock('@superset-ui/core', () => ({
  getTimeFormatter: jest.fn((format: string) => `formatted-${format}`),
  smartDateFormatter: { id: 'smart_date' },
}));

describe('getXAxisFormatter', () => {
  it('should return undefined when format is smartDateFormatter.id', () => {
    const formatter = getXAxisFormatter(smartDateFormatter.id);
    expect(formatter).toBeUndefined();
  });

  it('should return undefined when format is not provided (undefined)', () => {
    const formatter = getXAxisFormatter(undefined);
    expect(formatter).toBeUndefined();
  });

  it('should return time formatter when a valid format string is provided', () => {
    const format = 'YYYY-MM-DD';
    const formatter = getXAxisFormatter(format);
    expect(formatter).toBe(`formatted-${format}`);
  });

  it('should return String when format is null', () => {
    const formatter = getXAxisFormatter(null);
    expect(formatter).toBe(String);
  });
});
