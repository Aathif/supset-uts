import { SupersetClient, logging } from '@superset-ui/core';
import {
  assembleEndpoint,
  updateFilterKey,
  createFilterKey,
  getFilterValue,
  getPermalinkValue,
} from './yourModulePath'; // replace with the actual path

jest.mock('@superset-ui/core', () => ({
  SupersetClient: {
    put: jest.fn(),
    post: jest.fn(),
    get: jest.fn(),
  },
  logging: {
    error: jest.fn(),
  },
}));

describe('Dashboard Filter State Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('assembleEndpoint', () => {
    it('should assemble endpoint without key and tabId', () => {
      expect(assembleEndpoint('123')).toBe('api/v1/dashboard/123/filter_state');
    });

    it('should assemble endpoint with key', () => {
      expect(assembleEndpoint('123', 'key123')).toBe(
        'api/v1/dashboard/123/filter_state/key123',
      );
    });

    it('should assemble endpoint with key and tabId', () => {
      expect(assembleEndpoint('123', 'key123', 'tab123')).toBe(
        'api/v1/dashboard/123/filter_state/key123?tab_id=tab123',
      );
    });

    it('should assemble endpoint with tabId only', () => {
      expect(assembleEndpoint('123', null, 'tab123')).toBe(
        'api/v1/dashboard/123/filter_state?tab_id=tab123',
      );
    });
  });

  describe('updateFilterKey', () => {
    it('should update filter key', async () => {
      SupersetClient.put.mockResolvedValue({ json: { message: 'success' } });
      const result = await updateFilterKey('123', 'value123', 'key123');
      expect(result).toBe('success');
      expect(SupersetClient.put).toHaveBeenCalledWith({
        endpoint: 'api/v1/dashboard/123/filter_state/key123',
        jsonPayload: { value: 'value123' },
      });
    });

    it('should handle error in updating filter key', async () => {
      SupersetClient.put.mockRejectedValue(new Error('error'));
      const result = await updateFilterKey('123', 'value123', 'key123');
      expect(result).toBeNull();
      expect(logging.error).toHaveBeenCalledWith(new Error('error'));
    });
  });

  describe('createFilterKey', () => {
    it('should create filter key', async () => {
      SupersetClient.post.mockResolvedValue({ json: { key: 'key123' } });
      const result = await createFilterKey('123', 'value123');
      expect(result).toBe('key123');
      expect(SupersetClient.post).toHaveBeenCalledWith({
        endpoint: 'api/v1/dashboard/123/filter_state',
        jsonPayload: { value: 'value123' },
      });
    });

    it('should handle error in creating filter key', async () => {
      SupersetClient.post.mockRejectedValue(new Error('error'));
      const result = await createFilterKey('123', 'value123');
      expect(result).toBeNull();
      expect(logging.error).toHaveBeenCalledWith(new Error('error'));
    });
  });

  describe('getFilterValue', () => {
    it('should get filter value', async () => {
      SupersetClient.get.mockResolvedValue({ json: { value: '{"foo":"bar"}' } });
      const result = await getFilterValue('123', 'key123');
      expect(result).toEqual({ foo: 'bar' });
      expect(SupersetClient.get).toHaveBeenCalledWith({
        endpoint: 'api/v1/dashboard/123/filter_state/key123',
      });
    });

    it('should handle error in getting filter value', async () => {
      SupersetClient.get.mockRejectedValue(new Error('error'));
      const result = await getFilterValue('123', 'key123');
      expect(result).toBeNull();
      expect(logging.error).toHaveBeenCalledWith(new Error('error'));
    });
  });

  describe('getPermalinkValue', () => {
    it('should get permalink value', async () => {
      const permalinkValue = { someKey: 'someValue' };
      SupersetClient.get.mockResolvedValue({ json: permalinkValue });
      const result = await getPermalinkValue('key123');
      expect(result).toEqual(permalinkValue);
      expect(SupersetClient.get).toHaveBeenCalledWith({
        endpoint: '/api/v1/dashboard/permalink/key123',
      });
    });

    it('should handle error in getting permalink value', async () => {
      SupersetClient.get.mockRejectedValue(new Error('error'));
      const result = await getPermalinkValue('key123');
      expect(result).toBeNull();
      expect(logging.error).toHaveBeenCalledWith(new Error('error'));
    });
  });
});
