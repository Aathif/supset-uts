import buildQuery from './path_to_buildQuery';
import { buildQueryContext } from '@superset-ui/core';

jest.mock('@superset-ui/core', () => ({
  buildQueryContext: jest.fn(),
}));

describe('buildQuery', () => {
  const formData = {
    metric: 'some_metric',
    sort_by_metric: true,
  };

  const baseQueryObject = {
    metrics: [],
    orderby: [],
  };

  beforeEach(() => {
    buildQueryContext.mockImplementation((formData, buildQueryObject) => {
      return buildQueryObject(baseQueryObject);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should build query with orderby if sort_by_metric is true', () => {
    const result = buildQuery(formData);

    expect(buildQueryContext).toHaveBeenCalledWith(formData, expect.any(Function));
    expect(result).toEqual([
      {
        ...baseQueryObject,
        orderby: [['some_metric', false]],
      },
    ]);
  });

  it('should build query without orderby if sort_by_metric is false', () => {
    const formDataWithoutSortBy = {
      ...formData,
      sort_by_metric: false,
    };

    const result = buildQuery(formDataWithoutSortBy);

    expect(buildQueryContext).toHaveBeenCalledWith(formDataWithoutSortBy, expect.any(Function));
    expect(result).toEqual([
      {
        ...baseQueryObject,
      },
    ]);
  });

  it('should build query without orderby if sort_by_metric is not provided', () => {
    const formDataWithoutSortBy = {
      metric: 'some_metric',
    };

    const result = buildQuery(formDataWithoutSortBy);

    expect(buildQueryContext).toHaveBeenCalledWith(formDataWithoutSortBy, expect.any(Function));
    expect(result).toEqual([
      {
        ...baseQueryObject,
      },
    ]);
  });

  it('should build query without orderby if metric is not provided', () => {
    const formDataWithoutMetric = {
      sort_by_metric: true,
    };

    const result = buildQuery(formDataWithoutMetric);

    expect(buildQueryContext).toHaveBeenCalledWith(formDataWithoutMetric, expect.any(Function));
    expect(result).toEqual([
      {
        ...baseQueryObject,
      },
    ]);
  });
});
