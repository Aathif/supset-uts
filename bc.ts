import { guessFrame } from './path-to-your-file';  // adjust the import as necessary
import { COMMON_RANGE_VALUES_SET, CALENDAR_RANGE_VALUES_SET, NO_TIME_RANGE } from './path-to-your-constants'; // adjust
import { customTimeRangeDecode } from './path-to-your-utils'; // adjust

// Mock customTimeRangeDecode
jest.mock('./path-to-your-utils', () => ({
  customTimeRangeDecode: jest.fn(),
}));

describe('guessFrame', () => {
  it('returns "Common" if timeRange is in COMMON_RANGE_VALUES_SET', () => {
    const commonTimeRange = 'Last week';
    COMMON_RANGE_VALUES_SET.add(commonTimeRange);

    expect(guessFrame(commonTimeRange)).toBe('Common');
  });

  it('returns "Calendar" if timeRange is in CALENDAR_RANGE_VALUES_SET', () => {
    const calendarTimeRange = '2023-01-01 to 2023-12-31';
    CALENDAR_RANGE_VALUES_SET.add(calendarTimeRange);

    expect(guessFrame(calendarTimeRange)).toBe('Calendar');
  });

  it('returns "No filter" if timeRange is NO_TIME_RANGE', () => {
    expect(guessFrame(NO_TIME_RANGE)).toBe('No filter');
  });

  it('returns "Custom" if customTimeRangeDecode returns matchedFlag as true', () => {
    const customTimeRange = 'Last 5 days';
    (customTimeRangeDecode as jest.Mock).mockReturnValue({ matchedFlag: true });

    expect(guessFrame(customTimeRange)).toBe('Custom');
  });

  it('returns "Advanced" if none of the conditions are met', () => {
    const advancedTimeRange = 'Special Custom Time';
    (customTimeRangeDecode as jest.Mock).mockReturnValue({ matchedFlag: false });

    expect(guessFrame(advancedTimeRange)).toBe('Advanced');
  });
});
