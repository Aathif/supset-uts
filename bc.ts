import buildQuery from './buildQuery';
import { buildQueryContext, getMetricLabel } from '@superset-ui/core';

jest.mock('@superset-ui/core', () => ({
  buildQueryContext: jest.fn(),
  getMetricLabel: jest.fn(metric => metric.label || metric),
}));

describe('buildQuery', () => {
  const formData = {
    adhoc_filters: [{ clause: 'WHERE', expressionType: 'SIMPLE', subject: 'value', operator: '==', comparator: '1' }],
    adhoc_filters_b: [{ clause: 'WHERE', expressionType: 'SIMPLE', subject: 'value_b', operator: '==', comparator: '1' }],
    groupby: ['category'],
    groupby_b: ['subcategory'],
    limit: 10,
    limit_b: 5,
    timeseries_limit_metric: { label: 'sum__value' },
    timeseries_limit_metric_b: { label: 'sum__value_b' },
    metrics: [{ label: 'sum__value' }],
    metrics_b: [{ label: 'sum__value_b' }],
    order_desc: true,
    order_desc_b: false,
  };

  const mockQueryContext = (formData) => ({
    queries: [{
      metrics: formData.metrics || [],
      is_timeseries: formData.is_timeseries,
      post_processing: [{
        operation: 'pivot',
        options: {
          index: ['__timestamp'],
          columns: formData.columns || [],
          aggregates: Object.fromEntries(
            formData.metrics.map(metric => [
              getMetricLabel(metric),
              { operator: 'sum' },
            ]),
          ),
        },
      }],
    }],
  });

  beforeEach(() => {
    (buildQueryContext as jest.Mock).mockImplementation(mockQueryContext);
  });

  it('should build query context for both formData1 and formData2', () => {
    const queryContext = buildQuery(formData);

    // Verify formData1 query context
    expect(buildQueryContext).toHaveBeenCalledWith(
      expect.objectContaining({
        adhoc_filters: formData.adhoc_filters,
        columns: formData.groupby,
        limit: formData.limit,
        timeseries_limit_metric: formData.timeseries_limit_metric,
        metrics: formData.metrics,
        order_desc: formData.order_desc,
      }),
      expect.any(Function)
    );

    // Verify formData2 query context
    expect(buildQueryContext).toHaveBeenCalledWith(
      expect.objectContaining({
        adhoc_filters: formData.adhoc_filters_b,
        columns: formData.groupby_b,
        limit: formData.limit_b,
        timeseries_limit_metric: formData.timeseries_limit_metric_b,
        metrics: formData.metrics_b,
        order_desc: formData.order_desc_b,
      }),
      expect.any(Function)
    );

    // Verify the combined query context
    expect(queryContext).toEqual({
      queries: expect.any(Array),
    });

    // Check the number of queries generated
    expect(queryContext.queries).toHaveLength(2);
  });

  it('should create pivot post-processing for both queries', () => {
    const queryContext = buildQuery(formData);

    queryContext.queries.forEach(query => {
      const postProcessing = query.post_processing[0];
      expect(postProcessing).toEqual({
        operation: 'pivot',
        options: {
          index: ['__timestamp'],
          columns: expect.any(Array),
          aggregates: expect.any(Object),
        },
      });

      // Ensure pivot aggregates are correct
      expect(postProcessing.options.aggregates).toEqual({
        'sum__value': { operator: 'sum' },
        'sum__value_b': { operator: 'sum' },
      });
    });
  });
});
