import { buildQueryContext } from '@superset-ui/core';
import { CHART_TYPES, checkTimeSeries, has2Queries, MAX_FORM_CONTROLS, QueryMode, Sorting } from './utils'; // Not correctly imported form node_modules, so add it here

export default function buildQuery(formData, options) {
  return buildQueryContext(formData, baseQueryObject => {
    var _formData$groupby2, _formData$columns, _baseQueryObject$metr, _options$ownState;
    let orderby = formData?.orderby || [];
    if (orderby.length > 0) {
      orderby = orderby.map(order => JSON.parse(order));
    }
    const prefixYColumn = formData.query_mode === QueryMode.Raw ? 'y_column' : 'metric';
    const prefixXColumn = formData.query_mode === QueryMode.Raw ? 'x_column' : 'group_by';

    // for (let i = 0; i < MAX_FORM_CONTROLS; i++) {
    //   var _formData$metrics, _formData$groupby;

    //   const yColumn = formData.query_mode === QueryMode.Raw ? formData.y_column : (_formData$metrics = formData.metrics) === null || _formData$metrics === void 0 ? void 0 : _formData$metrics[i];

    //   if (formData[`use_order_by_${prefixYColumn}_${i}`] && yColumn) {
    //     orderby.push([yColumn, formData[`order_by_type_${prefixYColumn}_${i}`] === Sorting.ASC]);
    //   }

    //   const xColumn = formData.query_mode === QueryMode.Raw ? formData.x_column : (_formData$groupby = formData.groupby) === null || _formData$groupby === void 0 ? void 0 : _formData$groupby[i];

    //   if (formData[`use_order_by_${prefixXColumn}_${i}`] && xColumn) {
    //     orderby.push([xColumn, formData[`order_by_type_${prefixXColumn}_${i}`] === Sorting.ASC]);
    //   }
    // }

    let columns = [];
    let groupby = [...((_formData$groupby2 = formData.groupby) !== null && _formData$groupby2 !== void 0 ? _formData$groupby2 : []), ...((_formData$columns = formData.columns) !== null && _formData$columns !== void 0 ? _formData$columns : [])];

    if (formData.query_mode === QueryMode.Raw) {
      var _formData$columns2;

      columns = [formData.x_column, formData.y_column, ...((_formData$columns2 = formData.columns) !== null && _formData$columns2 !== void 0 ? _formData$columns2 : [])];
      groupby = [];
    }

    const metrics = [...((_baseQueryObject$metr = baseQueryObject.metrics) !== null && _baseQueryObject$metr !== void 0 ? _baseQueryObject$metr : [])];

    if (formData.z_dimension && formData.chart_type === CHART_TYPES.BUBBLE_CHART) {
      metrics.push(formData.z_dimension);
    }

    let {
      filters
    } = baseQueryObject;
    const ownState = (_options$ownState = options === null || options === void 0 ? void 0 : options.ownState) !== null && _options$ownState !== void 0 ? _options$ownState : {};

    if (ownState.filters) {
      // eslint-disable-next-line prefer-destructuring
      filters = ownState.filters;
    }

    if (ownState.groupBy) {
      groupby = ownState.groupBy;
    }

    let queries = [{ ...baseQueryObject,
      filters,
      metrics,
      orderby,
      is_timeseries: checkTimeSeries(formData.query_mode === QueryMode.Raw ? formData.x_column : formData.groupby, formData.granularity_sqla, formData.layout),
    }];

    if(formData.query_mode !== QueryMode.Raw){
      queries[0].series_columns = formData.columns;
      queries[0].columns = groupby;
     } 

    const secondMetric = has2Queries(formData);

    if (secondMetric) {
      const updatedMetrics = [...queries[0].metrics];
      updatedMetrics.splice(secondMetric.metricOrder, 1);
      queries[0].metrics = updatedMetrics; // @ts-ignore

      queries.push({ ...baseQueryObject,
        metrics: [metrics[secondMetric.metricOrder]],
        orderby,
        is_timeseries: checkTimeSeries(formData.query_mode === QueryMode.Raw ? formData.x_column : formData.groupby, formData.granularity_sqla, formData.layout),
        columns,
        groupby: groupby.filter(gb => {
          var _formData$columns3;

          return !((_formData$columns3 = formData.columns) === null || _formData$columns3 === void 0 ? void 0 : _formData$columns3.includes(gb));
        })
      });
    }

    return queries;
  });
}
