import buildQuery from './path_to_buildQuery';
import { buildQueryContext } from '@superset-ui/core';

jest.mock('@superset-ui/core', () => ({
  buildQueryContext: jest.fn(),
  ensureIsArray: jest.fn((input) => Array.isArray(input) ? input : [input]),
}));

describe('buildQuery', () => {
  const mockFormData = {
    series_limit_metric: 'mock_metric',
    metrics: ['metric_1', 'metric_2'],
  };

  beforeEach(() => {
    buildQueryContext.mockClear();
  });

  it('should build a query with orderby set to series_limit_metric', () => {
    buildQuery(mockFormData);

    expect(buildQueryContext).toHaveBeenCalledWith(mockFormData, expect.any(Function));

    const queryObjectBuilder = buildQueryContext.mock.calls[0][1];
    const baseQueryObject = { metrics: ['metric_1'], orderby: [] };
    const queryObjects = queryObjectBuilder(baseQueryObject);

    expect(queryObjects[0].orderby).toEqual([['mock_metric', false]]);
  });

  it('should default to ordering by the first metric if series_limit_metric is not provided', () => {
    const formDataWithoutSortByMetric = {
      ...mockFormData,
      series_limit_metric: null,
    };

    buildQuery(formDataWithoutSortByMetric);

    expect(buildQueryContext).toHaveBeenCalledWith(formDataWithoutSortByMetric, expect.any(Function));

    const queryObjectBuilder = buildQueryContext.mock.calls[0][1];
    const baseQueryObject = { metrics: ['metric_1'], orderby: [] };
    const queryObjects = queryObjectBuilder(baseQueryObject);

    expect(queryObjects[0].orderby).toEqual([['metric_1', false]]);
  });

  it('should not override orderby if no metrics are provided', () => {
    const formDataWithoutMetrics = {
      ...mockFormData,
      metrics: [],
      series_limit_metric: null,
    };

    buildQuery(formDataWithoutMetrics);

    expect(buildQueryContext).toHaveBeenCalledWith(formDataWithoutMetrics, expect.any(Function));

    const queryObjectBuilder = buildQueryContext.mock.calls[0][1];
    const baseQueryObject = { metrics: [], orderby: [['some_metric', true]] };
    const queryObjects = queryObjectBuilder(baseQueryObject);

    expect(queryObjects[0].orderby).toEqual([['some_metric', true]]);
  });
});
