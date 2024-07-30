import { normalizeTimestamp } from '@superset-ui/core';
import DateWithFormatter from './DateWithFormatter';

jest.mock('@superset-ui/core', () => ({
  normalizeTimestamp: jest.fn(),
}));

describe('DateWithFormatter', () => {
  const mockTimestamp = '2024-07-28T14:20:00Z';
  const mockNormalizedTimestamp = new Date(mockTimestamp).toISOString();

  beforeEach(() => {
    normalizeTimestamp.mockImplementation((value) => {
      if (typeof value === 'string') {
        return mockNormalizedTimestamp;
      }
      return value;
    });
  });

  it('should retain the original input', () => {
    const input = mockTimestamp;
    const date = new DateWithFormatter(input);
    expect(date.input).toBe(input);
  });

  it('should normalize timestamp strings', () => {
    const input = mockTimestamp;
    const date = new DateWithFormatter(input);
    expect(normalizeTimestamp).toHaveBeenCalledWith(input);
    expect(date.toISOString()).toBe(mockNormalizedTimestamp);
  });

  it('should default to the String formatter', () => {
    const input = mockTimestamp;
    const date = new DateWithFormatter(input);
    expect(date.toString()).toBe(input);
  });

  it('should use the provided formatter', () => {
    const input = mockTimestamp;
    const formatter = jest.fn().mockReturnValue('formatted date');
    const date = new DateWithFormatter(input, { formatter });
    expect(date.toString()).toBe('formatted date');
    expect(formatter).toHaveBeenCalledWith(date);
  });

  it('should handle non-string input correctly', () => {
    const input = 1659031200000; // numeric timestamp
    const date = new DateWithFormatter(input);
    expect(date.input).toBe(input);
    expect(date.toISOString()).toBe(new Date(input).toISOString());
  });

  it('should return original input for non-string input with default formatter', () => {
    const input = 1659031200000; // numeric timestamp
    const date = new DateWithFormatter(input);
    expect(date.toString()).toBe(String(input));
  });

  it('should handle null input correctly', () => {
    const input = null;
    const date = new DateWithFormatter(input);
    expect(date.input).toBe(input);
    expect(date.toString()).toBe('null');
  });

  it('should handle undefined input correctly', () => {
    const input = undefined;
    const date = new DateWithFormatter(input);
    expect(date.input).toBe(input);
    expect(date.toString()).toBe('undefined');
  });
});
