// formatColumnValue.test.js
import { formatColumnValue } from './formatColumnValue';
import { formatValue } from './utils/formatValue'; // Adjust the import path
import { getNumberFormatter } from './utils/formatters'; // Adjust the import path
import { GenericDataType } from '@superset-ui/core'; // Adjust the import path

jest.mock('./utils/formatValue');
jest.mock('./utils/formatters');

describe('formatColumnValue', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('should use the small number formatter for small numeric values', () => {
    const mockFormatter = jest.fn();
    const mockSmallNumberFormatter = jest.fn();
    const column = {
      dataType: GenericDataType.Numeric,
      formatter: mockFormatter,
      config: { d3SmallNumberFormat: '0.0e' },
    };
    const value = 0.0001;

    getNumberFormatter.mockReturnValue(mockSmallNumberFormatter);

    formatColumnValue(column, value);

    expect(getNumberFormatter).toHaveBeenCalledWith('0.0e');
    expect(formatValue).toHaveBeenCalledWith(mockSmallNumberFormatter, value);
  });

  test('should use the default formatter for large numeric values', () => {
    const mockFormatter = jest.fn();
    const column = {
      dataType: GenericDataType.Numeric,
      formatter: mockFormatter,
      config: {},
    };
    const value = 12345;

    formatColumnValue(column, value);

    expect(formatValue).toHaveBeenCalledWith(mockFormatter, value);
  });

  test('should use the default formatter for non-numeric values', () => {
    const mockFormatter = jest.fn();
    const column = {
      dataType: GenericDataType.String,
      formatter: mockFormatter,
    };
    const value = 'Hello';

    formatColumnValue(column, value);

    expect(formatValue).toHaveBeenCalledWith(mockFormatter, value);
  });

  test('should handle undefined and null values correctly', () => {
    const mockFormatter = jest.fn();
    const column = {
      dataType: GenericDataType.Numeric,
      formatter: mockFormatter,
    };

    formatColumnValue(column, undefined);
    formatColumnValue(column, null);

    expect(formatValue).toHaveBeenCalledWith(mockFormatter, undefined);
    expect(formatValue).toHaveBeenCalledWith(mockFormatter, null);
  });

  test('should use custom formatter if provided', () => {
    const mockCustomFormatter = jest.fn();
    const column = {
      dataType: GenericDataType.Numeric,
      formatter: mockCustomFormatter,
    };
    const value = 0.5;

    formatColumnValue(column, value);

    expect(formatValue).toHaveBeenCalledWith(mockCustomFormatter, value);
  });
});
