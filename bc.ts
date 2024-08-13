const transformProps = (
  chartProps: TableChartProps,
): TableChartTransformedProps => {
  const {
    height,
    width,
    rawFormData: formData,
    queriesData = [],
    filterState,
    ownState: serverPaginationData,
    hooks: {
      onAddFilter: onChangeFilter,
      setDataMask = () => {},
      onContextMenu,
    },
    emitCrossFilters,
  } = chartProps;

  const {
    align_pn: alignPositiveNegative = true,
    color_pn: colorPositiveNegative = true,
    show_cell_bars: showCellBars = true,
    include_search: includeSearch = false,
    page_length: pageLength,
    server_pagination: serverPagination = false,
    export_all_data: exportAllData = false,
    server_page_length: serverPageLength = 10,
    order_desc: sortDesc = false,
    query_mode: queryMode,
    show_totals: showTotals,
    cellBgColor,
    columnNameAliasing,
    conditional_formatting: conditionalFormatting,
    allow_rearrange_columns: allowRearrangeColumns,
  } = formData;
  const timeGrain = extractTimegrain(formData);

  const [metrics, percentMetrics, columns] = processColumns(chartProps);

  let baseQuery;
  let countQuery;
  let totalQuery;
  let rowCount;
  if (serverPagination) {
    [baseQuery, countQuery, totalQuery] = queriesData;
    rowCount = (countQuery?.data?.[0]?.rowcount as number) ?? 0;
  } else {
    [baseQuery, totalQuery] = queriesData;
    rowCount = baseQuery?.rowcount ?? 0;
  }
  const data = processDataRecords(baseQuery?.data, columns);
  const totals =
    showTotals && queryMode === QueryMode.Aggregate
      ? totalQuery?.data[0]
      : undefined;
  const columnColorFormatters =
    getColorFormatters(conditionalFormatting, data) ?? defaultColorFormatters;

  return {
    height,
    width,
    isRawRecords: queryMode === QueryMode.Raw,
    data,
    totals,
    columns,
    serverPagination,
    exportAllData,
    metrics,
    percentMetrics,
    serverPaginationData: serverPagination
      ? serverPaginationData
      : defaultServerPaginationData,
    setDataMask,
    alignPositiveNegative,
    colorPositiveNegative,
    showCellBars,
    sortDesc,
    includeSearch,
    rowCount,
    pageSize: serverPagination
      ? serverPageLength
      : getPageSize(pageLength, data.length, columns.length),
    filters: filterState.filters,
    emitCrossFilters,
    onChangeFilter,
    columnColorFormatters,
    timeGrain,
    allowRearrangeColumns,
    onContextMenu,
    cellBgColor,
    columnNameAliasing,
    sliceId: chartProps.rawFormData?.slice_id || ''
  };
};
