import DateWithFormatter from './DateWithFormatter';
import { TimeFormatFunction } from '@superset-ui/core';

describe('DateWithFormatter', () => {
  const defaultDate = '2023-10-10T12:34:56';
  const dateWithTimeZone = '2023-10-10T12:34:56Z';
  
  it('should initialize correctly with default parameters', () => {
    const date = new DateWithFormatter(defaultDate);
    
    // Should retain the original input
    expect(date.input).toBe(defaultDate);
    
    // Default formatter should return the input as a string
    expect(date.toString()).toBe(defaultDate);
  });
  
  it('should append "Z" to timestamp without timezone when forceUTC is true', () => {
    const date = new DateWithFormatter(defaultDate, { forceUTC: true });
    
    // Date should be adjusted to UTC
    expect(date.toISOString()).toBe(new Date(`${defaultDate}Z`).toISOString());
  });

  it('should not append "Z" when forceUTC is false', () => {
    const date = new DateWithFormatter(defaultDate, { forceUTC: false });
    
    // Date should not be adjusted
    expect(date.toISOString()).toBe(new Date(defaultDate).toISOString());
  });

  it('should apply a custom formatter correctly', () => {
    const customFormatter: TimeFormatFunction = (date: Date) => `Formatted: ${date.getFullYear()}`;
    const date = new DateWithFormatter(defaultDate, { formatter: customFormatter });
    
    // Custom formatter should format the date correctly
    expect(date.toString()).toBe('Formatted: 2023');
  });

  it('should handle timezone-aware dates correctly', () => {
    const date = new DateWithFormatter(dateWithTimeZone, { forceUTC: true });
    
    // Should retain the original input and parse correctly
    expect(date.toISOString()).toBe(new Date(dateWithTimeZone).toISOString());
  });

  it('should return input string when formatter is String', () => {
    const date = new DateWithFormatter(dateWithTimeZone, { formatter: String });
    
    // Should return the original input string
    expect(date.toString()).toBe(dateWithTimeZone);
  });

  it('should behave like a native Date when no formatter is provided', () => {
    const date = new DateWithFormatter(defaultDate, { formatter: undefined });
    
    // Should behave like a native Date
    expect(date.toString()).toBe(new Date(defaultDate).toString());
  });
});
