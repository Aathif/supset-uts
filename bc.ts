export default function TableChart(props) {
  const {
    height,
    width,
    data,
    totals,
    isRawRecords,
    rowCount = 0,
    columns: columnsMeta,
    alignPositiveNegative: defaultAlignPN = false,
    colorPositiveNegative: defaultColorPN = false,
    includeSearch = false,
    pageSize = 0,
    serverPagination = false,
    exportAllData = false,
    serverPaginationData,
    setDataMask,
    showCellBars = true,
    emitFilter = false,
    sortDesc = false,
    onChangeFilter,
    metrics,
    filters: initialFilters = {},
    sticky = true, // whether to use sticky header
    cellBgColor = '',
    columnNameAliasing = '',
    sliceId
  } = props;
  const [filters, setFilters] = useState(initialFilters);
  const handleChange = useCallback(filters => {
    if (!emitFilter) {
      return;
    }
  
    const groupBy = Object.keys(filters);
    const groupByValues = Object.values(filters);
    setDataMask({
      extraFormData: {
        filters: groupBy.length === 0 ? [] : groupBy.map(col => {
          const val = filters == null ? void 0 : filters[col];
          if (val === null || val === undefined) return {
            col,
            op: 'IS NULL'
          };
          return {
            col,
            op: 'IN',
            val: val
          };
        })
      },
      filterState: {
        value: groupByValues.length ? groupByValues : null
      }
    });
  }, [emitFilter, setDataMask]); // only take relevant page size options

  const pageSizeOptions = useMemo(() => {
    const getServerPagination = n => n <= rowCount;

    return PAGE_SIZE_OPTIONS.filter(([n]) => serverPagination ? getServerPagination(n) : n <= 2 * data.length);
  }, [data.length, rowCount, serverPagination]);
  const getValueRange = useCallback(function getValueRange(key, alignPositiveNegative) {
    var _data$;

    if (typeof (data == null ? void 0 : (_data$ = data[0]) == null ? void 0 : _data$[key]) === 'number') {
      const nums = data.map(row => row[key]);
      return alignPositiveNegative ? [0, d3Max(nums.map(Math.abs))] : d3Extent(nums);
    }

    return null;
  }, [data]);
  const isActiveFilterValue = useCallback(function isActiveFilterValue(key, val) {
    var _filters$key;

    return !!filters && ((_filters$key = filters[key]) == null ? void 0 : _filters$key.includes(val));
  }, [filters]);
  const toggleFilter = useCallback(function toggleFilter(key, val) {
    const updatedFilters = { ...(filters || {})
    };

    if (filters && isActiveFilterValue(key, val)) {
      updatedFilters[key] = filters[key].filter(x => x !== val);
    } else {
      updatedFilters[key] = [...((filters == null ? void 0 : filters[key]) || []), val];
    }

    if (Array.isArray(updatedFilters[key]) && updatedFilters[key].length === 0) {
      delete updatedFilters[key];
    }

    setFilters(updatedFilters);
    handleChange(updatedFilters);
  }, [filters, handleChange, isActiveFilterValue]);

  const getSharedStyle = column => {
    const {
      isNumeric,
      config = {}
    } = column;
    const textAlign = config.horizontalAlign ? config.horizontalAlign : isNumeric ? 'right' : 'left';
    return {
      textAlign
    };
  };

  const hiddenColumns = [];

  const getColumnConfigs = useCallback((column, i) => {
    const {
      key,
      label,
      isNumeric,
      dataType,
      isMetric,
      config = {},
      bgColor,
      aliasTitle
    } = column;
    const isFilter = !isNumeric && emitFilter;
    const columnWidth = Number.isNaN(Number(config.columnWidth)) ? config.columnWidth : Number(config.columnWidth); // inline style for both th and td cell

    const sharedStyle = getSharedStyle(column);
    const alignPositiveNegative = config.alignPositiveNegative === undefined ? defaultAlignPN : config.alignPositiveNegative;
    const colorPositiveNegative = config.colorPositiveNegative === undefined ? defaultColorPN : config.colorPositiveNegative;
    const valueRange = (config.showCellBars === undefined ? showCellBars : config.showCellBars) && (isMetric || isRawRecords) && getValueRange(key, alignPositiveNegative);
    const tooltipColumns = config && config?.tooltipColumns || [];
    let className = '';
    if (config?.hideColumn) {
      hiddenColumns.push(key);
    }

    if (isFilter) {
      className += ' dt-is-filter';
    }
    return {
      id: String(key),
      // to allow duplicate column keys
      // must use custom accessor to allow `.` in column names
      // typing is incorrect in current version of `@types/react-table`
      // so we ask TS not to check.
      accessor: datum => datum[key],
      Cell: ({
        value, row
      }) => {
        const [isHtml, text] = formatColumnValue(column, value);
        const html = isHtml ? {
          __html: text
        } : undefined;
        const cellProps = {
          // show raw number in title in case of numeric values
          title: typeof value === 'number' ? String(value) : undefined,
          onClick: emitFilter && !valueRange ? () => toggleFilter(key, value) : undefined,
          className: [className, value == null ? 'dt-is-null' : '', isActiveFilterValue(key, value) ? ' dt-is-active-filter' : ''].join(' '),
          style: { ...sharedStyle,
            float: (typeof value === 'number' || valueRange) ? 'right' : 'left',
            textAlign: (typeof value === 'number' || valueRange) ? 'right' : 'left',
            background: valueRange ? cellBar({
              value: value,
              bgColor:  bgColor && valueRange ? bgColor : undefined,
              valueRange,
              alignPositiveNegative,
              colorPositiveNegative
            }) : undefined
          }
        };

        if (html) {
          // eslint-disable-next-line react/no-danger
          return ___EmotionJSX("td", _extends({}, cellProps, {
            dangerouslySetInnerHTML: html
          }));
        } // If cellProps renderes textContent already, then we don't have to
        // render `Cell`. This saves some time for large tables.
        
        let tooltipText = tooltipColumns.map((columns, index) => ___EmotionJSX(tooltipColumns.length === (index + 1) ? "span" : "p", {}, `${row?.original?.[columns]}`))
        if (tooltipText && tooltipText.length > 0) {
          return ___EmotionJSX("td", cellProps, ___EmotionJSX(Tooltip, {placement: 'right', title:tooltipText}, text));
        }
        return ___EmotionJSX("td", cellProps, text);
      },
      Header: ({
        column: col,
        onClick,
        style
      }) => ___EmotionJSX("th", {
        // title: column?.description ? column?.description : '',
        className: [className, col.isSorted ? 'is-sorted' : ''].join(' '),
        style: { ...sharedStyle,
          ...style
        },
        onClick: onClick
      }, config.columnWidth ? // column width hint
      ___EmotionJSX("div", {
        style: {
          width: columnWidth,
          height: 0.01
        }
      }) : null,
      column?.description ?
      ___EmotionJSX("span", {
          
      }, (aliasTitle || label), 
      ___EmotionJSX("span", { style: {whiteSpace: 'nowrap'}}, ' '), ___EmotionJSX(CustomToolTip, {
        className:"m-r-5 text-muted",
        tooltip:column?.description,
        label:aliasTitle || label,
        placement:"right",
        style: {whiteSpace: 'nowrap'}
      })
     ): 
      ___EmotionJSX("span", {}, (aliasTitle || label)),
      ___EmotionJSX(SortIcon, {
        column: col
      })),
      Footer: totals ? i === 0 ? ___EmotionJSX("th", null, t('Totals')) : ___EmotionJSX("td", {
        style: sharedStyle
      }, ___EmotionJSX("strong", null, formatColumnValue(column, totals[key])[1])) : undefined,
      sortDescFirst: sortDesc,
      sortType: getSortTypeByDataType(dataType)
    };
  }, [defaultAlignPN, defaultColorPN, emitFilter, getValueRange, isActiveFilterValue, isRawRecords, showCellBars, sortDesc, toggleFilter, totals, hiddenColumns]);


  // Cell bar color custiomization
  let columnsMetaNew = columnsMeta;
  const customColor = {}
  if(cellBgColor) {
    const colorArr = cellBgColor.split(',');
    colorArr && colorArr !== '' && colorArr.forEach((item = '') => {
      const [colName = '', colColor = ''] = item.split(':')
      customColor[colName.trim()] = colColor.trim();
    })
    columnsMetaNew = columnsMeta.map((item) => {
      if(customColor[item.label]) {
        return {...item, bgColor: customColor[item.label]};
      }
      return item;
    })
  }

  // Aliasing column name custiomization
  const customAlias = {}
  if(columnNameAliasing) {
    const columnAliasArr = columnNameAliasing.split(',');
    columnAliasArr && columnAliasArr !== '' && columnAliasArr.forEach((item = '') => {
      const [colName = '', colAlias = ''] = item.split(':')
      customAlias[colName.trim()] = colAlias.trim();
    })
    columnsMetaNew = columnsMetaNew.map((item) => {
      if(customAlias  [item.label]) {
        return {...item, aliasTitle: customAlias[item.label]};
      }
      return item;
    })
  }

  const columns = useMemo(() => columnsMetaNew.map(getColumnConfigs), [columnsMetaNew, cellBgColor, getColumnConfigs]);

  const handleServerPaginationChange = (pageNumber, pageSize, filterValue='') => {
    if (typeof filterValue != "string") {
      filterValue = '';
    }
    updateExternalFormData(setDataMask, pageNumber, pageSize, filterValue);
  };


  return ___EmotionJSX(Styles, null, ___EmotionJSX(DataTable, {
    columns: columns,
    data: data,
    rowCount: rowCount,
    tableClassName: "table table-striped table-condensed",
    pageSize: pageSize,
    serverPaginationData: serverPaginationData,
    pageSizeOptions: pageSizeOptions,
    width: width,
    height: height,
    onChangeFilter: onChangeFilter,
    metrics,
    serverPagination: serverPagination,
    exportAllData:exportAllData,
    hiddenColumns: hiddenColumns,
    onServerPaginationChange: handleServerPaginationChange // 9 page items in > 340px works well even for 100+ pages
    ,
    maxPageItemCount: width > 340 ? 9 : 7,
    noResults: filter => t(filter ? 'No matching records found' : 'No records found'),
    searchInput: includeSearch && SearchInput,
    selectPageSize: pageSize !== null && SelectPageSize // not in use in Superset, but needed for unit tests
    ,
    sticky: sticky,
    sliceId: sliceId,
    setDataMask: setDataMask
  }));
}
