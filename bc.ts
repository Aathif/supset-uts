import { getExploreLongUrl } from './getExploreLongUrl';
import { getURIDirectory } from './getURIDirectory';
import { safeStringify } from './safeStringify';
import URI from 'urijs';  // Mock URI library

jest.mock('./getURIDirectory');
jest.mock('./safeStringify');
jest.mock('urijs');

const MAX_URL_LENGTH = 2000;  // Mock the max URL length to use for overflow test

describe('getExploreLongUrl', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('should return undefined when formData has no datasource', () => {
    const formData = { viz_type: 'table' };
    const result = getExploreLongUrl(formData, 'json');
    expect(result).toBeUndefined();
  });

  test('should return a valid URL for a valid datasource and endpointType', () => {
    const formData = { datasource: '1__table', viz_type: 'table' };
    const mockURIInstance = {
      search: jest.fn().mockReturnThis(),
      directory: jest.fn().mockReturnThis(),
      toString: jest.fn().mockReturnValue('http://example.com/superset/explore_json/?form_data=mockedData'),
    };

    // Mock getURIDirectory and safeStringify
    (getURIDirectory as jest.Mock).mockReturnValue('/superset/explore_json/');
    (safeStringify as jest.Mock).mockReturnValue('mockedData');
    (URI as jest.Mock).mockImplementation(() => mockURIInstance);

    const result = getExploreLongUrl(formData, 'json');
    expect(result).toBe('http://example.com/superset/explore_json/?form_data=mockedData');

    // Check the correct functions were called
    expect(getURIDirectory).toHaveBeenCalledWith('json');
    expect(safeStringify).toHaveBeenCalledWith(formData);
  });

  test('should include extraSearch parameters in the URL', () => {
    const formData = { datasource: '1__table', viz_type: 'table' };
    const extraSearch = { key: 'value' };
    const mockURIInstance = {
      search: jest.fn().mockReturnThis(),
      directory: jest.fn().mockReturnThis(),
      toString: jest.fn().mockReturnValue('http://example.com/superset/explore_json/?key=value&form_data=mockedData'),
    };

    (getURIDirectory as jest.Mock).mockReturnValue('/superset/explore_json/');
    (safeStringify as jest.Mock).mockReturnValue('mockedData');
    (URI as jest.Mock).mockImplementation(() => mockURIInstance);

    const result = getExploreLongUrl(formData, 'json', true, extraSearch);
    expect(result).toBe('http://example.com/superset/explore_json/?key=value&form_data=mockedData');

    expect(mockURIInstance.search).toHaveBeenCalledWith(true);
    expect(getURIDirectory).toHaveBeenCalledWith('json');
    expect(safeStringify).toHaveBeenCalledWith(formData);
  });

  test('should handle URL length overflow and call recursively with minimal formData', () => {
    const formData = { datasource: '1__table', viz_type: 'table' };
    const minimalFormData = { datasource: '1__table', viz_type: 'table' };
    const mockURIInstance = {
      search: jest.fn().mockReturnThis(),
      directory: jest.fn().mockReturnThis(),
      toString: jest.fn().mockReturnValue('http://example.com/superset/explore_json/?form_data=mockedData'),
    };

    (getURIDirectory as jest.Mock).mockReturnValue('/superset/explore_json/');
    (safeStringify as jest.Mock).mockReturnValue('mockedData');
    (URI as jest.Mock).mockImplementation(() => mockURIInstance);

    // Mock overflow
    (mockURIInstance.toString as jest.Mock).mockReturnValueOnce('a'.repeat(MAX_URL_LENGTH + 1)); // Overflow case

    const result = getExploreLongUrl(formData, 'json', false);
    expect(result).toBe('http://example.com/superset/explore_json/?form_data=mockedData');
    
    expect(getURIDirectory).toHaveBeenCalledWith('json');
    expect(safeStringify).toHaveBeenCalledWith(minimalFormData);
  });

  test('should add standalone param if endpointType is standalone', () => {
    const formData = { datasource: '1__table', viz_type: 'table' };
    const mockURIInstance = {
      search: jest.fn().mockReturnThis(),
      directory: jest.fn().mockReturnThis(),
      toString: jest.fn().mockReturnValue('http://example.com/superset/explore_json/?form_data=mockedData&standalone=true'),
    };

    (getURIDirectory as jest.Mock).mockReturnValue('/superset/explore_json/');
    (safeStringify as jest.Mock).mockReturnValue('mockedData');
    (URI as jest.Mock).mockImplementation(() => mockURIInstance);

    const result = getExploreLongUrl(formData, 'standalone');
    expect(result).toBe('http://example.com/superset/explore_json/?form_data=mockedData&standalone=true');
  });
});
