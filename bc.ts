import moment, { Moment } from 'moment';
import { dttmToMoment } from './path-to-your-file';

describe('dttmToMoment', () => {
  it('should return the current moment at the start of the second when dttm is "now"', () => {
    const mockNow = moment('2023-10-10T10:10:10Z').utc().startOf('second');
    jest.spyOn(moment.prototype, 'startOf').mockReturnThis();  // Mock startOf to return the mock moment

    const result = dttmToMoment('now');

    expect(result.isSame(mockNow, 'second')).toBe(true);  // Ensure it returns a moment object set to start of second
  });

  it('should return the current day starting at midnight when dttm is "today"', () => {
    const mockToday = moment('2023-10-10T00:00:00Z').utc().startOf('day');
    jest.spyOn(moment.prototype, 'startOf').mockReturnThis();  // Mock startOf to return the mock day start

    const result = dttmToMoment('today');

    expect(result.isSame(mockToday, 'day')).toBe(true);  // Ensure it returns moment object set to start of day
  });

  it('should return a moment object based on the given date string', () => {
    const dttm = '2023-10-10T10:10:10Z';
    const result = dttmToMoment(dttm);

    expect(result.isSame(moment(dttm))).toBe(true);  // Ensure it returns the correct moment object
  });

  afterEach(() => {
    jest.clearAllMocks();  // Clear mocks after each test to avoid side effects
  });
});
