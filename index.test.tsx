import handleResourceExport from './handleResourceExport';
import parseCookie from 'src/utils/parseCookie';
import rison from 'rison';
import { nanoid } from 'nanoid';

// Mock the dependencies
jest.mock('nanoid');
jest.mock('src/utils/parseCookie');

describe('handleResourceExport', () => {
  const resource = 'example_resource';
  const ids = [1, 2, 3];
  const token = 'test_token';
  const done = jest.fn();
  const interval = 200;

  beforeEach(() => {
    jest.clearAllMocks();
    nanoid.mockReturnValue(token);
  });

  it('should create an iframe and set its src', () => {
    const appendChildMock = jest.spyOn(document.body, 'appendChild');
    const createElementMock = jest.spyOn(document, 'createElement').mockImplementation(() => {
      return { style: {}, src: '' };
    });
    handleResourceExport(resource, ids, done, interval);

    const expectedUrl = `/api/v1/${resource}/export/?q=${rison.encode(ids)}&token=${token}`;
    expect(createElementMock).toHaveBeenCalledWith('iframe');
    expect(appendChildMock).toHaveBeenCalled();
    expect(appendChildMock.mock.calls[0][0].src).toBe(expectedUrl);
    expect(appendChildMock.mock.calls[0][0].style.display).toBe('none');
  });

  it('should call done() and remove iframe when cookie is set', () => {
    const removeChildMock = jest.spyOn(document.body, 'removeChild');
    const setIntervalMock = jest.spyOn(window, 'setInterval');
    const clearIntervalMock = jest.spyOn(window, 'clearInterval');

    parseCookie.mockReturnValue({ [token]: 'done' });

    handleResourceExport(resource, ids, done, interval);

    expect(setIntervalMock).toHaveBeenCalled();

    const intervalCallback = setIntervalMock.mock.calls[0][0];
    intervalCallback();

    expect(clearIntervalMock).toHaveBeenCalled();
    expect(removeChildMock).toHaveBeenCalled();
    expect(done).toHaveBeenCalled();
  });

  it('should not call done() or remove iframe when cookie is not set', () => {
    const removeChildMock = jest.spyOn(document.body, 'removeChild');
    const setIntervalMock = jest.spyOn(window, 'setInterval');

    parseCookie.mockReturnValue({});

    handleResourceExport(resource, ids, done, interval);

    const intervalCallback = setIntervalMock.mock.calls[0][0];
    intervalCallback();

    expect(removeChildMock).not.toHaveBeenCalled();
    expect(done).not.toHaveBeenCalled();
  });
});
