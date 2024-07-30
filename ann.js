import { getXAxisFormatter } from './getXAxisFormatter';
import { getTimeFormatter, smartDateFormatter } from '@superset-ui/core';

jest.mock('@superset-ui/core', () => ({
  getTimeFormatter: jest.fn().mockImplementation((format: string) => format),
  smartDateFormatter: { id: 'smart_date' },
}));

describe('getXAxisFormatter', () => {
  it('should return undefined when format is smartDateFormatter.id', () => {
    const formatter = getXAxisFormatter(smartDateFormatter.id);
    expect(formatter).toBeUndefined();
  });

  it('should return undefined when format is undefined', () => {
    const formatter = getXAxisFormatter(undefined);
    expect(formatter).toBeUndefined();
  });

  it('should return time formatter when format is provided', () => {
    const format = 'YYYY-MM-DD';
    const formatter = getXAxisFormatter(format);
    expect(formatter).toBe(format);
    expect(getTimeFormatter).toHaveBeenCalledWith(format);
  });

  it('should return String function when format is null', () => {
    const formatter = getXAxisFormatter(null);
    expect(formatter).toBe(String);
  });
});
