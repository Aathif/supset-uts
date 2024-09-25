
 export default function transformProps(chartProps) {
  const { width, height, formData, queriesData } = chartProps;
  const { colorScheme, treemapRatio, treeMapColorOptions } = formData;
  let { numberFormat } = formData;

  if (!numberFormat && chartProps.datasource && chartProps.datasource.metrics) {
    chartProps.datasource.metrics.forEach(metric => {
      if (metric.metric_name === chartProps.formData.metrics[0] && metric.d3format) {
        numberFormat = metric.d3format;
      }
    });
  }

  return {
    width,
    height,
    data: queriesData[0].data,
    colorScheme,
    numberFormat,
    treemapRatio,
    treeMapColorOptions,
  };
}
