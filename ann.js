import { getXAxisFormatter } from './yourFile';
import { smartDateFormatter, getTimeFormatter } from '@superset-ui/core';

jest.mock('@superset-ui/core', () => ({
  smartDateFormatter: { id: 'smart_date' },
  getTimeFormatter: jest.fn(),
}));

describe('getXAxisFormatter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return undefined when format is smartDateFormatter.id', () => {
    const formatter = getXAxisFormatter('smart_date');
    
    expect(formatter).toBeUndefined();
    expect(getTimeFormatter).not.toHaveBeenCalled();
  });

  test('should return undefined when format is falsy (undefined or null)', () => {
    const formatter = getXAxisFormatter(undefined);
    
    expect(formatter).toBeUndefined();
    expect(getTimeFormatter).not.toHaveBeenCalled();
  });

  test('should return getTimeFormatter when format is provided and not smartDateFormatter.id', () => {
    const mockFormat = 'custom_format';
    const mockTimeFormatter = jest.fn();
    (getTimeFormatter as jest.Mock).mockReturnValue(mockTimeFormatter);

    const formatter = getXAxisFormatter(mockFormat);

    expect(getTimeFormatter).toHaveBeenCalledWith(mockFormat);
    expect(formatter).toBe(mockTimeFormatter);
  });

  test('should return String when format is an empty string', () => {
    const formatter = getXAxisFormatter('');

    expect(formatter).toBeUndefined();  // For an empty string, it will be treated as falsy
    expect(getTimeFormatter).not.toHaveBeenCalled();
  });
});
