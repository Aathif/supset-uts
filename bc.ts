import moment from 'moment';
import { dttmToString } from './path-to-your-file';
import { dttmToMoment } from './path-to-your-dttmToMoment'; // Import the function we rely on

// Define a mock value for the MOMENT_FORMAT constant
const MOMENT_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

jest.mock('./path-to-your-dttmToMoment', () => ({
  dttmToMoment: jest.fn(),
}));

describe('dttmToString', () => {
  it('should format "now" according to MOMENT_FORMAT', () => {
    const mockNow = moment('2023-10-10T10:10:10Z').utc().startOf('second');
    (dttmToMoment as jest.Mock).mockReturnValue(mockNow);

    const result = dttmToString('now');

    expect(result).toBe(mockNow.format(MOMENT_FORMAT));  // Ensure correct formatting of "now"
  });

  it('should format "today" according to MOMENT_FORMAT', () => {
    const mockToday = moment('2023-10-10T00:00:00Z').utc().startOf('day');
    (dttmToMoment as jest.Mock).mockReturnValue(mockToday);

    const result = dttmToString('today');

    expect(result).toBe(mockToday.format(MOMENT_FORMAT));  // Ensure correct formatting of "today"
  });

  it('should format a date string according to MOMENT_FORMAT', () => {
    const mockDate = moment('2023-10-10T10:10:10Z');
    (dttmToMoment as jest.Mock).mockReturnValue(mockDate);

    const result = dttmToString('2023-10-10T10:10:10Z');

    expect(result).toBe(mockDate.format(MOMENT_FORMAT));  // Ensure correct formatting of date string
  });

  afterEach(() => {
    jest.clearAllMocks();  // Clear mocks after each test to avoid side effects
  });
});
