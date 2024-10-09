export default function transformProps(chartProps) {
  const {
    height,
    datasource,
    formData,
    queriesData
  } = chartProps;
  const {
    timeGrainSqla,
    groupby,
    columns,
    numberFormat,
    dateFormat,
    customizeBgCondition,
    cellBgColor,
    pageLength,
    includeSearch,
    colsToHide,
    orderByCols
  } = formData;
  const {
    columnFormats,
    verboseMap
  } = datasource;

  return {
    columnFormats,
    data: queriesData[0].data,
    dateFormat,
    granularity: timeGrainSqla,
    height,
    numberFormat,
    numGroups: groupby.length,
    verboseMap,
    customizeBgCondition,
    cellBgColor,
    pageLength,
    includeSearch,
    groupby,
    columns,
    colsToHide,
    orderByCols
  };
}
