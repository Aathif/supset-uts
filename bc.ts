import { buildQueryContext, getMetricLabel } from '@superset-ui/core';
export default function buildQuery(formData) {
  const {
    adhoc_filters,
    adhoc_filters_b,
    groupby,
    groupby_b,
    limit,
    limit_b,
    timeseries_limit_metric,
    timeseries_limit_metric_b,
    metrics,
    metrics_b,
    order_desc,
    order_desc_b,
    ...baseFormData
  } = formData;
  baseFormData.is_timeseries = true;
  const formData1 = { ...baseFormData,
    adhoc_filters,
    columns: groupby,
    limit,
    timeseries_limit_metric,
    metrics,
    order_desc
  };
  const formData2 = { ...baseFormData,
    adhoc_filters: adhoc_filters_b,
    columns: groupby_b,
    limit: limit_b,
    timeseries_limit_metric: timeseries_limit_metric_b,
    metrics: metrics_b,
    order_desc: order_desc_b
  };
  const queryContextA = buildQueryContext(formData1, baseQueryObject => {
    const metricLabels = (baseQueryObject.metrics || []).map(getMetricLabel);
    return [{ ...baseQueryObject,
      is_timeseries: true,
      post_processing: [{
        operation: 'pivot',
        options: {
          index: ['__timestamp'],
          columns: formData1.columns || [],
          // Create 'dummy' sum aggregates to assign cell values in pivot table
          aggregates: Object.fromEntries(metricLabels.map(metric => [metric, {
            operator: 'sum'
          }]))
        }
      }]
    }];
  });
  const queryContextB = buildQueryContext(formData2, baseQueryObject => {
    const metricLabels = (baseQueryObject.metrics || []).map(getMetricLabel);
    return [{ ...baseQueryObject,
      is_timeseries: true,
      post_processing: [{
        operation: 'pivot',
        options: {
          index: ['__timestamp'],
          columns: formData2.columns || [],
          // Create 'dummy' sum aggregates to assign cell values in pivot table
          aggregates: Object.fromEntries(metricLabels.map(metric => [metric, {
            operator: 'sum'
          }]))
        }
      }]
    }];
  });
  return { ...queryContextA,
    queries: [...queryContextA.queries, ...queryContextB.queries]
  };
}
