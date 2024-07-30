import { getTooltipTimeFormatter } from './getTooltipTimeFormatter'; // Adjust the import path as needed
import { getTimeFormatter } from '@superset-ui/core'; // Adjust import path
import { smartDateFormatter, smartDateDetailedFormatter } from './path-to-smart-date-formatters'; // Adjust import path

jest.mock('@superset-ui/core', () => ({
  getTimeFormatter: jest.fn((format: string) => (value: any) => `Formatted(${value}) with format ${format}`),
}));

describe('getTooltipTimeFormatter', () => {
  it('should return smartDateDetailedFormatter when format is smartDateFormatter.id', () => {
    const formatter = getTooltipTimeFormatter(smartDateFormatter.id);
    expect(formatter).toBe(smartDateDetailedFormatter);
  });

  it('should return getTimeFormatter when format is a specific format', () => {
    const format = 'YYYY-MM-DD';
    const formatter = getTooltipTimeFormatter(format);
    expect(formatter).toEqual(expect.any(Function));
    expect(formatter('2024-07-30')).toBe('Formatted(2024-07-30) with format YYYY-MM-DD');
  });

  it('should return String when format is undefined or empty', () => {
    const formatterUndefined = getTooltipTimeFormatter(undefined);
    expect(formatterUndefined).toBe(String);

    const formatterEmpty = getTooltipTimeFormatter('');
    expect(formatterEmpty).toBe(String);
  });
});
