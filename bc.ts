import { buildQueryContext } from '@superset-ui/core';
import buildQuery from './path/to/your/buildQuery'; // Adjust the import path as needed
import { computeQueryBComparator } from '../utils'; // Adjust the import path as needed

// Mock dependencies
jest.mock('@superset-ui/core', () => ({
  buildQueryContext: jest.fn(),
}));

jest.mock('../utils', () => ({
  computeQueryBComparator: jest.fn(),
}));

describe('buildQuery', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.resetAllMocks();
  });

  test('builds query context correctly without time comparison', () => {
    const formData = {
      cols: ['column1'],
      time_comparison: 'c',
      extra_form_data: {},
      adhoc_filters: [{ operator: 'TEMPORAL_RANGE', comparator: 'last_week' }],
      adhoc_custom: [{ operator: 'TEMPORAL_RANGE', comparator: 'last_month' }],
    };

    buildQueryContext.mockImplementation((fd, baseQuery) => ({
      queries: baseQuery({
        filters: fd.adhoc_filters,
      }),
    }));

    const result = buildQuery(formData);

    expect(buildQueryContext).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      queries: [
        {
          filters: [{ operator: 'TEMPORAL_RANGE', comparator: 'last_week' }],
        },
        {
          filters: [{ operator: 'TEMPORAL_RANGE', comparator: 'last_month' }],
        },
      ],
    });
  });

  test('builds query context correctly with time comparison', () => {
    const formData = {
      cols: ['column1'],
      time_comparison: 'y',
      extra_form_data: {},
      adhoc_filters: [{ operator: 'TEMPORAL_RANGE', comparator: 'last_week' }],
    };

    computeQueryBComparator.mockReturnValue('last_year');

    buildQueryContext.mockImplementation((fd, baseQuery) => ({
      queries: baseQuery({
        filters: fd.adhoc_filters,
      }),
    }));

    const result = buildQuery(formData);

    expect(computeQueryBComparator).toHaveBeenCalledWith(
      [{ operator: 'TEMPORAL_RANGE', comparator: 'last_week' }],
      'y',
      {},
    );
    expect(buildQueryContext).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      queries: [
        {
          filters: [{ operator: 'TEMPORAL_RANGE', comparator: 'last_week' }],
        },
        {
          filters: [
            { operator: 'TEMPORAL_RANGE', comparator: 'last_year' },
          ],
        },
      ],
    });
  });

  test('handles missing adhoc_filters', () => {
    const formData = {
      cols: ['column1'],
      time_comparison: 'c',
      extra_form_data: {},
    };

    buildQueryContext.mockImplementation((fd, baseQuery) => ({
      queries: baseQuery({
        filters: fd.adhoc_filters,
      }),
    }));

    const result = buildQuery(formData);

    expect(buildQueryContext).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      queries: [
        {
          filters: undefined,
        },
        {
          filters: undefined,
        },
      ],
    });
  });

  // Additional tests for other scenarios can be added here
});
