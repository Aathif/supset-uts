import { fetchTimeRange } from './path-to-your-file';  // adjust the import as necessary
import { SupersetClient } from '@superset-ui/core';
import rison from 'rison';
import { buildTimeRangeString, formatTimeRange, getClientErrorObject } from './path-to-your-utils';  // adjust imports as necessary

jest.mock('@superset-ui/core', () => ({
  SupersetClient: {
    get: jest.fn(),
  },
}));

jest.mock('rison', () => ({
  encode_uri: jest.fn(),
}));

jest.mock('./path-to-your-utils', () => ({
  buildTimeRangeString: jest.fn(),
  formatTimeRange: jest.fn(),
  getClientErrorObject: jest.fn(),
}));

describe('fetchTimeRange', () => {
  const mockTimeRange = 'last_week';
  const mockColumnPlaceholder = 'my_col';
  const mockEncodedQuery = 'encoded_time_range';

  beforeEach(() => {
    jest.clearAllMocks();
    rison.encode_uri.mockReturnValue(mockEncodedQuery);
  });

  it('should return formatted time range value on successful API call', async () => {
    const mockApiResponse = {
      json: {
        result: {
          since: '2023-01-01',
          until: '2023-01-07',
        },
      },
    };
    const mockTimeRangeString = '2023-01-01 - 2023-01-07';
    SupersetClient.get.mockResolvedValue(mockApiResponse);
    buildTimeRangeString.mockReturnValue(mockTimeRangeString);
    formatTimeRange.mockReturnValue('Formatted Time Range');

    const result = await fetchTimeRange(mockTimeRange, mockColumnPlaceholder);

    expect(rison.encode_uri).toHaveBeenCalledWith(mockTimeRange);
    expect(SupersetClient.get).toHaveBeenCalledWith({
      endpoint: `/api/v1/time_range/?q=${mockEncodedQuery}`,
    });
    expect(buildTimeRangeString).toHaveBeenCalledWith(
      mockApiResponse.json.result.since,
      mockApiResponse.json.result.until,
    );
    expect(formatTimeRange).toHaveBeenCalledWith(
      mockTimeRangeString,
      mockColumnPlaceholder,
    );
    expect(result).toEqual({ value: 'Formatted Time Range' });
  });

  it('should return error message on API failure', async () => {
    const mockErrorResponse = {
      statusText: 'Internal Server Error',
    };
    const mockClientError = {
      message: 'Error fetching time range',
    };
    SupersetClient.get.mockRejectedValue(mockErrorResponse);
    getClientErrorObject.mockResolvedValue(mockClientError);

    const result = await fetchTimeRange(mockTimeRange, mockColumnPlaceholder);

    expect(SupersetClient.get).toHaveBeenCalledWith({
      endpoint: `/api/v1/time_range/?q=${mockEncodedQuery}`,
    });
    expect(getClientErrorObject).toHaveBeenCalledWith(mockErrorResponse);
    expect(result).toEqual({
      error: mockClientError.message,
    });
  });

  it('should handle missing since and until in response', async () => {
    const mockApiResponse = {
      json: {
        result: {
          since: '',
          until: '',
        },
      },
    };
    SupersetClient.get.mockResolvedValue(mockApiResponse);
    buildTimeRangeString.mockReturnValue('');
    formatTimeRange.mockReturnValue('Formatted Time Range');

    const result = await fetchTimeRange(mockTimeRange, mockColumnPlaceholder);

    expect(buildTimeRangeString).toHaveBeenCalledWith('', '');
    expect(result).toEqual({ value: 'Formatted Time Range' });
  });
});
