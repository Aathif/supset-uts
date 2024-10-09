import { formatCellValue, formatDateCellValue } from './utils/formatCells'; // Adjust the import based on your file structure
import { formatNumber } from '@superset-ui/core';

// Mock the formatNumber function
jest.mock('@superset-ui/core', () => ({
  formatNumber: jest.fn((format, value) => `formatted(${value})`),
}));

describe('formatCellValue', () => {
  const columnFormats = {
    metric1: '.2f',
    metric2: '.1f',
  };
  const numberFormat = '.3s';
  const dateRegex = /^__timestamp:(-?\d*\.?\d*)$/;
  const dateFormatter = jest.fn((date) => date.toISOString());

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('should format numeric values correctly', () => {
    const result = formatCellValue(0, ['metric1', 'metric2'], '1234.567', columnFormats, numberFormat, dateRegex, dateFormatter);
    expect(result.textContent).toBe('formatted(1234.567)');
    expect(result.sortAttributeValue).toBe(1234.567);
  });

  test('should handle non-numeric values', () => {
    const result = formatCellValue(1, ['metric1', 'metric2'], 'some text', columnFormats, numberFormat, dateRegex, dateFormatter);
    expect(result.textContent).toBe('some text');
    expect(result.sortAttributeValue).toBe('some text');
  });

  test('should format date values correctly', () => {
    const result = formatCellValue(0, ['metric1'], '__timestamp:1633072800000', columnFormats, numberFormat, dateRegex, dateFormatter);
    expect(result.textContent).toBe('2021-10-01T00:00:00.000Z'); // ISO format from dateFormatter
    expect(result.sortAttributeValue).toBeInstanceOf(Date);
  });

  test('should return empty string and negative infinity for "null"', () => {
    const result = formatCellValue(0, ['metric1'], 'null', columnFormats, numberFormat, dateRegex, dateFormatter);
    expect(result.textContent).toBe('');
    expect(result.sortAttributeValue).toBe(Number.NEGATIVE_INFINITY);
  });
});

describe('formatDateCellValue', () => {
  const dateRegex = /^__timestamp:(-?\d*\.?\d*)$/;
  const dateFormatter = jest.fn((date) => date.toISOString());
  const verboseMap = { 'unknown': 'Unknown Value' };

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('should format date values correctly', () => {
    const result = formatDateCellValue('__timestamp:1633072800000', verboseMap, dateRegex, dateFormatter);
    expect(result).toBe('2021-10-01T00:00:00.000Z'); // ISO format from dateFormatter
  });

  test('should return verbose mapping for unknown values', () => {
    const result = formatDateCellValue('unknown', verboseMap, dateRegex, dateFormatter);
    expect(result).toBe('Unknown Value');
  });

  test('should return original text if no match and no verbose mapping', () => {
    const result = formatDateCellValue('unmatched', verboseMap, dateRegex, dateFormatter);
    expect(result).toBe('unmatched');
  });
});
