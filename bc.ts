import moment from 'moment';
import { AdhocFilter } from '@superset-ui/core';
import { computeQueryBComparator, formatCustomComparator } from './path/to/your/module'; // Adjust the import path as needed

describe('computeQueryBComparator', () => {
  test('returns null for custom time comparison', () => {
    const adhocFilters: AdhocFilter[] = [
      { operator: 'TEMPORAL_RANGE', comparator: 'last_week' },
    ];
    const timeComparison = 'c';
    const extraFormData = {};

    const result = computeQueryBComparator(adhocFilters, timeComparison, extraFormData);

    expect(result).toBeNull();
  });

  test('computes previous year comparator', () => {
    const adhocFilters: AdhocFilter[] = [
      { operator: 'TEMPORAL_RANGE', comparator: '2023-01-01 : 2023-01-07' },
    ];
    const timeComparison = 'y';
    const extraFormData = {};

    const result = computeQueryBComparator(adhocFilters, timeComparison, extraFormData);

    expect(result).toBe('2022-01-01T00:00:00 2022-01-07T00:00:00');
  });

  test('computes previous week comparator', () => {
    const adhocFilters: AdhocFilter[] = [
      { operator: 'TEMPORAL_RANGE', comparator: '2023-01-01 : 2023-01-07' },
    ];
    const timeComparison = 'w';
    const extraFormData = {};

    const result = computeQueryBComparator(adhocFilters, timeComparison, extraFormData);

    expect(result).toBe('2022-12-25T00:00:00 2022-12-31T00:00:00');
  });

  test('computes custom time range comparator', () => {
    const adhocFilters: AdhocFilter[] = [
      { operator: 'TEMPORAL_RANGE', comparator: 'last_week' },
    ];
    const timeComparison = 'c';
    const extraFormData = { time_range: '2023-01-01 : 2023-01-07' };

    const result = computeQueryBComparator(adhocFilters, timeComparison, extraFormData);

    expect(result).toBeNull();
  });
});

describe('formatCustomComparator', () => {
  test('formats custom comparator correctly', () => {
    const adhocFilters: AdhocFilter[] = [
      { operator: 'TEMPORAL_RANGE', comparator: '2023-01-01 : 2023-01-07' },
    ];
    const extraFormData = {};

    const result = formatCustomComparator(adhocFilters, extraFormData);

    expect(result).toBe('2023-01-01T00:00:00 - 2023-01-07T00:00:00');
  });

  test('handles missing adhocFilters', () => {
    const adhocFilters: AdhocFilter[] = [];
    const extraFormData = { time_range: '2023-01-01 : 2023-01-07' };

    const result = formatCustomComparator(adhocFilters, extraFormData);

    expect(result).toBe('2023-01-01T00:00:00 - 2023-01-07T00:00:00');
  });

  test('returns empty string for missing time range', () => {
    const adhocFilters: AdhocFilter[] = [];
    const extraFormData = {};

    const result = formatCustomComparator(adhocFilters, extraFormData);

    expect(result).toBe('');
  });
});
