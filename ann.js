import buildQuery from './buildQuery';
import { buildQueryContext, getMetricLabel } from '@superset-ui/core';

jest.mock('@superset-ui/core', () => ({
  buildQueryContext: jest.fn((formData, callback) => callback({ columns: [], metrics: [] })),
  getMetricLabel: jest.fn(metric => metric),
}));

describe('buildQuery', () => {
  it('should build query context for Tukey whisker options', () => {
    const formData = {
      whiskerOptions: 'Tukey',
      columns: ['col1', 'col2'],
      metrics: ['metric1'],
      distributionColumns: ['col2'],
    };

    const result = buildQuery(formData);
    
    expect(buildQueryContext).toHaveBeenCalledWith(formData, expect.any(Function));
    expect(result).toEqual([
      {
        columns: ['col1', 'col2'],
        metrics: ['metric1'],
        is_timeseries: false,
        post_processing: [
          {
            operation: 'boxplot',
            options: {
              whisker_type: 'tukey',
              percentiles: undefined,
              groupby: ['col1'],
              metrics: ['metric1'],
            },
          },
        ],
      },
    ]);
  });

  it('should build query context for Min/max whisker options', () => {
    const formData = {
      whiskerOptions: 'Min/max (no outliers)',
      columns: ['col1', 'col2'],
      metrics: ['metric1'],
      distributionColumns: ['col2'],
    };

    const result = buildQuery(formData);
    
    expect(buildQueryContext).toHaveBeenCalledWith(formData, expect.any(Function));
    expect(result).toEqual([
      {
        columns: ['col1', 'col2'],
        metrics: ['metric1'],
        is_timeseries: false,
        post_processing: [
          {
            operation: 'boxplot',
            options: {
              whisker_type: 'min/max',
              percentiles: undefined,
              groupby: ['col1'],
              metrics: ['metric1'],
            },
          },
        ],
      },
    ]);
  });

  it('should build query context for percentile whisker options', () => {
    const formData = {
      whiskerOptions: '10/90 percentiles',
      columns: ['col1', 'col2'],
      metrics: ['metric1'],
      distributionColumns: ['col2'],
    };

    const result = buildQuery(formData);
    
    expect(buildQueryContext).toHaveBeenCalledWith(formData, expect.any(Function));
    expect(result).toEqual([
      {
        columns: ['col1', 'col2'],
        metrics: ['metric1'],
        is_timeseries: false,
        post_processing: [
          {
            operation: 'boxplot',
            options: {
              whisker_type: 'percentile',
              percentiles: [10, 90],
              groupby: ['col1'],
              metrics: ['metric1'],
            },
          },
        ],
      },
    ]);
  });

  it('should throw an error for unsupported whisker options', () => {
    const formData = {
      whiskerOptions: 'Unsupported',
      columns: ['col1', 'col2'],
      metrics: ['metric1'],
      distributionColumns: ['col2'],
    };

    expect(() => buildQuery(formData)).toThrowError('Unsupported whisker type: Unsupported');
  });
});
