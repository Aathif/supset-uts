import { GenericDataType, getNumberFormatter, sanitizeHtml } from '@superset-ui/core';
import DateWithFormatter from './DateWithFormatter';
import { formatColumnValue } from './formatColumnValue';

jest.mock('@superset-ui/core', () => ({
  GenericDataType: {
    Numeric: 'NUMERIC',
  },
  getNumberFormatter: jest.fn(),
  sanitizeHtml: jest.fn(),
  isProbablyHTML: jest.fn(),
}));

describe('formatColumnValue', () => {
  const mockColumn = (overrides = {}) => ({
    dataType: GenericDataType.Numeric,
    formatter: jest.fn(),
    config: {},
    ...overrides,
  });

  const testValue = 0.5;

  it('should format undefined as an empty string', () => {
    const column = mockColumn();
    const result = formatColumnValue(column, undefined);
    expect(result).toEqual([false, '']);
  });

  it('should format null as "N/A"', () => {
    const column = mockColumn();
    const result = formatColumnValue(column, null);
    expect(result).toEqual([false, 'N/A']);
  });

  it('should format a DateWithFormatter with null input as "N/A"', () => {
    const column = mockColumn();
    const result = formatColumnValue(column, new DateWithFormatter(null, jest.fn()));
    expect(result).toEqual([false, 'N/A']);
  });

  it('should format using the provided formatter', () => {
    const formatter = jest.fn().mockReturnValue('formatted value');
    const column = mockColumn({ formatter });
    const result = formatColumnValue(column, testValue);
    expect(result).toEqual([false, 'formatted value']);
    expect(formatter).toHaveBeenCalledWith(testValue);
  });

  it('should sanitize HTML strings', () => {
    const column = mockColumn();
    const value = '<div>test</div>';
    sanitizeHtml.mockReturnValue('sanitized html');
    isProbablyHTML.mockReturnValue(true);

    const result = formatColumnValue(column, value);
    expect(result).toEqual([true, 'sanitized html']);
    expect(sanitizeHtml).toHaveBeenCalledWith(value);
  });

  it('should return plain strings as is', () => {
    const column = mockColumn();
    const value = 'plain text';
    isProbablyHTML.mockReturnValue(false);

    const result = formatColumnValue(column, value);
    expect(result).toEqual([false, value]);
  });

  it('should format small numbers with a specific formatter', () => {
    const smallNumberFormatter = jest.fn().mockReturnValue('small formatted value');
    getNumberFormatter.mockReturnValue(smallNumberFormatter);

    const column = mockColumn({
      config: { d3SmallNumberFormat: '.2f' },
    });
    const result = formatColumnValue(column, 0.01);
    expect(result).toEqual([false, 'small formatted value']);
    expect(smallNumberFormatter).toHaveBeenCalledWith(0.01);
  });

  it('should format small numbers with a currency formatter', () => {
    const currencyFormatter = jest.fn().mockReturnValue('currency formatted value');
    const mockCurrencyFormatter = jest.fn().mockReturnValue(currencyFormatter);
    jest.mock('@superset-ui/core', () => ({
      ...jest.requireActual('@superset-ui/core'),
      CurrencyFormatter: mockCurrencyFormatter,
    }));

    const column = mockColumn({
      config: { d3SmallNumberFormat: '.2f', currencyFormat: 'USD' },
    });
    const result = formatColumnValue(column, 0.01);
    expect(result).toEqual([false, 'currency formatted value']);
    expect(currencyFormatter).toHaveBeenCalledWith(0.01);
  });
});
