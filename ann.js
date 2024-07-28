import { extractTimeseriesSeries } from './path_to_your_functions_file';

describe('extractTimeseriesSeries', () => {
  it('should return an empty array when data is empty', () => {
    const data = [];
    const result = extractTimeseriesSeries(data);
    expect(result).toEqual([]);
  });

  it('should return timeseries data correctly', () => {
    const data = [
      { __timestamp: 1627815600000, value1: 10, value2: 20 },
      { __timestamp: 1627902000000, value1: 15, value2: 25 },
    ];
    const result = extractTimeseriesSeries(data);
    expect(result).toEqual([
      {
        id: 'value1',
        name: 'value1',
        data: [
          [new Date(1627815600000), 10],
          [new Date(1627902000000), 15],
        ],
      },
      {
        id: 'value2',
        name: 'value2',
        data: [
          [new Date(1627815600000), 20],
          [new Date(1627902000000), 25],
        ],
      },
    ]);
  });
});


import { extractNonTimeseriesSeries } from './path_to_your_functions_file';

describe('extractNonTimeseriesSeries', () => {
  it('should return an empty array when data is empty', () => {
    const data = [];
    const metric = [];
    const result = extractNonTimeseriesSeries(data, metric);
    expect(result).toEqual([]);
  });

  it('should return non-timeseries data correctly', () => {
    const data = [
      { metric1: 10, metric2: 20 },
      { metric1: 15, metric2: 25 },
    ];
    const metric = ['metric1', 'metric2'];
    const result = extractNonTimeseriesSeries(data, metric);
    expect(result).toEqual([
      { id: 'metric1', name: 'metric1', data: [10, 15] },
      { id: 'metric2', name: 'metric2', data: [20, 25] },
    ]);
  });
});


import { formatSeriesName } from './path_to_your_functions_file';
import { GenericDataType } from '@superset-ui/core';

describe('formatSeriesName', () => {
  it('should return NULL_STRING for undefined or null name', () => {
    expect(formatSeriesName(undefined)).toBe('N/A');
    expect(formatSeriesName(null)).toBe('N/A');
  });

  it('should format numbers correctly', () => {
    expect(formatSeriesName(123)).toBe('123');
  });

  it('should format dates correctly', () => {
    const date = new Date('2021-08-01T00:00:00Z');
    expect(formatSeriesName(date)).toBe(date.toISOString());
  });

  it('should format strings and booleans correctly', () => {
    expect(formatSeriesName('test')).toBe('test');
    expect(formatSeriesName(true)).toBe('true');
  });
});


import { getColtypesMapping } from './path_to_your_functions_file';

describe('getColtypesMapping', () => {
  it('should map coltypes to colnames correctly', () => {
    const coltypes = ['string', 'number'];
    const colnames = ['name', 'age'];
    const result = getColtypesMapping({ coltypes, colnames });
    expect(result).toEqual({ name: 'string', age: 'number' });
  });
});


import { extractGroupbyLabel } from './path_to_your_functions_file';

describe('extractGroupbyLabel', () => {
  it('should extract groupby label correctly', () => {
    const datum = { name: 'John', age: 30 };
    const groupby = ['name', 'age'];
    const result = extractGroupbyLabel({ datum, groupby });
    expect(result).toBe('John, 30');
  });
});


import { getLegendProps } from './path_to_your_functions_file';
import { LegendOrientation } from '../types';

describe('getLegendProps', () => {
  it('should return legend properties correctly', () => {
    const result = getLegendProps('line', LegendOrientation.Top, true, false);
    expect(result).toEqual({ orient: 'horizontal', show: true, type: 'line', top: 0, right: 0 });
  });
});


import { getChartPadding } from './path_to_your_functions_file';
import { LegendOrientation } from '../types';

describe('getChartPadding', () => {
  it('should return chart padding correctly', () => {
    const result = getChartPadding(true, LegendOrientation.Top, null, { top: 10, bottom: 10, left: 10, right: 10 });
    expect(result).toEqual({ top: 10, bottom: 10, left: 10, right: 10 });
  });
});


import { dedupSeries } from './path_to_your_functions_file';

describe('dedupSeries', () => {
  it('should deduplicate series correctly', () => {
    const series = [
      { id: 'series1', name: 'Series 1' },
      { id: 'series1', name: 'Series 1' },
    ];
    const result = dedupSeries(series);
    expect(result).toEqual([
      { id: 'series1', name: 'Series 1' },
      { id: 'series1 (1)', name: 'Series 1' },
    ]);
  });
});
