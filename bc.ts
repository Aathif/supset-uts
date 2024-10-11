import { formatLabel } from './formatLabel';

describe('formatLabel', () => {
  const TIME_SHIFT_PATTERN = /---/; // Define your TIME_SHIFT_PATTERN here if it's needed

  it('should return a formatted string when input is a single string', () => {
    const result = formatLabel('label1');
    expect(result).toBe('label1');
  });

  it('should return a formatted string when input is a single string present in verboseMap', () => {
    const verboseMap = { label1: 'Verbose Label 1' };
    const result = formatLabel('label1', verboseMap);
    expect(result).toBe('Verbose Label 1');
  });

  it('should return a formatted string when input is an array of strings', () => {
    const result = formatLabel(['label1', 'label2']);
    expect(result).toBe('label1, label2');
  });

  it('should return a formatted string with verbose mapping for an array of strings', () => {
    const verboseMap = { label1: 'Verbose Label 1', label2: 'Verbose Label 2' };
    const result = formatLabel(['label1', 'label2'], verboseMap);
    expect(result).toBe('Verbose Label 1, Verbose Label 2');
  });

  it('should return the original string if it contains TIME_SHIFT_PATTERN', () => {
    const result = formatLabel(['label1', 'label2', 'label---3']);
    expect(result).toBe('label1, label2, label---3');
  });

  it('should return a single value from an array that contains a time shift pattern', () => {
    const result = formatLabel(['label---1']);
    expect(result).toBe('label---1');
  });

  it('should return undefined for an empty array', () => {
    const result = formatLabel([]);
    expect(result).toBeUndefined();
  });

  it('should return undefined when input is undefined', () => {
    const result = formatLabel(undefined);
    expect(result).toBeUndefined();
  });

  it('should return the original string when the input is not in the verboseMap', () => {
    const verboseMap = { label1: 'Verbose Label 1' };
    const result = formatLabel('label2', verboseMap);
    expect(result).toBe('label2');
  });
});
