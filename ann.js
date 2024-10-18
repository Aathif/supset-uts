import { getTooltipFormatter } from './yourFile';
import { smartDateFormatter, smartDateDetailedFormatter, getTimeFormatter } from '@superset-ui/core';

jest.mock('@superset-ui/core', () => ({
  smartDateFormatter: { id: 'smart_date' },
  smartDateDetailedFormatter: jest.fn(),
  getTimeFormatter: jest.fn(),
}));

describe('getTooltipFormatter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return smartDateDetailedFormatter when format is smartDateFormatter.id', () => {
    const formatter = getTooltipFormatter('smart_date');

    expect(formatter).toBe(smartDateDetailedFormatter);
    expect(smartDateDetailedFormatter).not.toHaveBeenCalled(); // Just return the function reference
  });

  test('should return getTimeFormatter when format is provided and not smartDateFormatter.id', () => {
    const mockFormat = 'custom_format';
    const mockTimeFormatter = jest.fn();
    (getTimeFormatter as jest.Mock).mockReturnValue(mockTimeFormatter);

    const formatter = getTooltipFormatter(mockFormat);

    expect(getTimeFormatter).toHaveBeenCalledWith(mockFormat);
    expect(formatter).toBe(mockTimeFormatter);
  });

  test('should return String when format is undefined', () => {
    const formatter = getTooltipFormatter(undefined);

    expect(formatter).toBe(String);
    expect(getTimeFormatter).not.toHaveBeenCalled();
  });

  test('should return String when format is an empty string', () => {
    const formatter = getTooltipFormatter('');

    expect(formatter).toBe(String);
    expect(getTimeFormatter).not.toHaveBeenCalled();
  });
});
