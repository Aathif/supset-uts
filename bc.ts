import handleResourceExport from './handleResourceExport'; // Adjust path as necessary
import parseCookie from 'src/utils/parseCookie';
import rison from 'rison';
import { nanoid } from 'nanoid';

// Mock dependencies
jest.mock('src/utils/parseCookie');
jest.mock('rison');
jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'mocked-token'),
}));

describe('handleResourceExport', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
    // Reset any changes to document.body or other global objects
    document.body.innerHTML = '';
  });

  it('should create an iframe and append it to the document body', () => {
    const resource = 'some-resource';
    const ids = [1, 2, 3];
    const done = jest.fn();

    handleResourceExport(resource, ids, done);

    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe?.src).toBe(`/api/v1/${resource}/export/?q=${rison.encode(ids)}&token=mocked-token`);
    expect(iframe?.style.display).toBe('none');
    expect(document.body.contains(iframe!)).toBe(true);
  });

  it('should call the done callback when cookie indicates export is done', () => {
    const resource = 'some-resource';
    const ids = [1, 2, 3];
    const done = jest.fn();
    const cookieMock = { 'mocked-token': 'done' };

    (parseCookie as jest.Mock).mockReturnValue(cookieMock);
    jest.useFakeTimers();

    handleResourceExport(resource, ids, done);

    // Fast-forward the timers
    jest.advanceTimersByTime(200);

    expect(done).toHaveBeenCalled();
  });

  it('should remove the iframe and clear the interval when export is done', () => {
    const resource = 'some-resource';
    const ids = [1, 2, 3];
    const done = jest.fn();
    const cookieMock = { 'mocked-token': 'done' };

    (parseCookie as jest.Mock).mockReturnValue(cookieMock);
    jest.useFakeTimers();

    handleResourceExport(resource, ids, done);

    // Fast-forward the timers
    jest.advanceTimersByTime(200);

    const iframe = document.querySelector('iframe');
    expect(iframe).toBeNull();
    expect(clearInterval).toHaveBeenCalled();
  });

  it('should handle the case when cookie does not indicate export is done', () => {
    const resource = 'some-resource';
    const ids = [1, 2, 3];
    const done = jest.fn();
    const cookieMock = { 'mocked-token': 'not-done' };

    (parseCookie as jest.Mock).mockReturnValue(cookieMock);
    jest.useFakeTimers();

    handleResourceExport(resource, ids, done);

    // Advance time but should not trigger done callback
    jest.advanceTimersByTime(200);

    expect(done).not.toHaveBeenCalled();
  });
});
