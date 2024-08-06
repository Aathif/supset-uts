import {
  AdhocFilter,
  buildQueryContext,
  QueryFormData,
} from '@superset-ui/core';
import { computeQueryBComparator } from '../utils';

/**
 * The buildQuery function is used to create an instance of QueryContext that's
 * sent to the chart data endpoint. In addition to containing information of which
 * datasource to use, it specifies the type (e.g. full payload, samples, query) and
 * format (e.g. CSV or JSON) of the result and whether or not to force refresh the data from
 * the datasource as opposed to using a cached copy of the data, if available.
 *
 * More importantly though, QueryContext contains a property `queries`, which is an array of
 * QueryObjects specifying individual data requests to be made. A QueryObject specifies which
 * columns, metrics and filters, among others, to use during the query. Usually it will be enough
 * to specify just one query based on the baseQueryObject, but for some more advanced use cases
 * it is possible to define post processing operations in the QueryObject, or multiple queries
 * if a viz needs multiple different result sets.
 */

export default function buildQuery(formData: QueryFormData) {
  const {
    cols: groupby,
    time_comparison: timeComparison,
    extra_form_data: extraFormData,
  } = formData;

  const queryContextA = buildQueryContext(formData, baseQueryObject => [
    {
      ...baseQueryObject,
      groupby,
    },
  ]);

  const timeFilterIndex: number =
    formData.adhoc_filters?.findIndex(
      filter => 'operator' in filter && filter.operator === 'TEMPORAL_RANGE',
    ) ?? -1;

  const timeFilter: AdhocFilter | null =
    timeFilterIndex !== -1 && formData.adhoc_filters
      ? formData.adhoc_filters[timeFilterIndex]
      : null;

  let formDataB: QueryFormData;
  let queryBComparator = null;

  if (timeComparison !== 'c') {
    queryBComparator = computeQueryBComparator(
      formData.adhoc_filters || [],
      timeComparison,
      extraFormData,
    );

    const queryBFilter: any = {
      ...timeFilter,
      comparator: queryBComparator,
    };

    const otherFilters = formData.adhoc_filters?.filter(
      (_value: any, index: number) => timeFilterIndex !== index,
    );
    const queryBFilters = otherFilters
      ? [queryBFilter, ...otherFilters]
      : [queryBFilter];

    formDataB = {
      ...formData,
      adhoc_filters: queryBFilters,
      extra_form_data: {
        ...extraFormData,
        time_range: undefined,
      },
    };
  } else {
    formDataB = {
      ...formData,
      adhoc_filters: formData.adhoc_custom,
      extra_form_data: {
        ...extraFormData,
        time_range: undefined,
      },
    };
  }

  const queryContextB = buildQueryContext(formDataB, baseQueryObject => [
    {
      ...baseQueryObject,
      groupby,
    },
  ]);

  return {
    ...queryContextA,
    queries: [...queryContextA.queries, ...queryContextB.queries],
  };
}
