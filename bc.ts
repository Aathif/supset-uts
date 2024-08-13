import transformProps from './transformProps';
import {
  SMART_DATE_ID,
  GenericDataType,
  getTimeFormatter,
  getTimeFormatterForGranularity,
} from '@superset-ui/core';
import { getColorFormatters } from '@superset-ui/chart-controls';

jest.mock('@superset-ui/core', () => ({
  ...jest.requireActual('@superset-ui/core'),
  getTimeFormatter: jest.fn().mockReturnValue((value) => `formatted-${value}`),
  getTimeFormatterForGranularity: jest.fn().mockReturnValue(
    (value) => `formatted-granularity-${value}`,
  ),
}));

jest.mock('@superset-ui/chart-controls', () => ({
  getColorFormatters: jest.fn(),
}));

describe('transformProps', () => {
  const chartProps = {
    width: 800,
    height: 600,
    queriesData: [
      {
        data: [
          { col1: '2023-08-01', metric1: 100 },
          { col1: '2023-08-02', metric1: 200 },
        ],
        colnames: ['col1', 'metric1'],
        coltypes: [GenericDataType.Temporal, GenericDataType.Numeric],
      },
    ],
    formData: {
      groupbyRows: ['col1'],
      groupbyColumns: [],
      metrics: ['metric1'],
      tableRenderer: 'TableRenderer',
      colOrder: 'key_a_to_z',
      rowOrder: 'key_a_to_z',
      aggregateFunction: 'sum',
      transposePivot: false,
      combineMetric: false,
      rowSubtotalPosition: 'none',
      colSubtotalPosition: 'none',
      colTotals: false,
      colSubTotals: false,
      rowTotals: false,
      rowSubTotals: false,
      valueFormat: '0,0',
      dateFormat: SMART_DATE_ID,
      metricsLayout: 'ROWS',
      conditionalFormatting: {},
      timeGrainSqla: null,
      currencyFormat: 'USD',
    },
    rawFormData: {
      granularity_sqla: 'ds',
      time_grain_sqla: 'P1D',
    },
    hooks: { setDataMask: jest.fn(), onContextMenu: jest.fn() },
    filterState: { selectedFilters: {} },
    datasource: { verboseMap: {}, columnFormats: {}, currencyFormats: {} },
    emitCrossFilters: jest.fn(),
  };

  it('should return the correct transformed props', () => {
    const result = transformProps(chartProps);

    expect(result).toEqual(
      expect.objectContaining({
        width: 800,
        height: 600,
        data: chartProps.queriesData[0].data,
        groupbyRows: ['col1'],
        groupbyColumns: [],
        metrics: ['metric1'],
        tableRenderer: 'TableRenderer',
        colOrder: 'key_a_to_z',
        rowOrder: 'key_a_to_z',
        aggregateFunction: 'sum',
        transposePivot: false,
        combineMetric: false,
        rowSubtotalPosition: 'none',
        colSubtotalPosition: 'none',
        colTotals: false,
        colSubTotals: false,
        rowTotals: false,
        rowSubTotals: false,
        valueFormat: '0,0',
        currencyFormat: 'USD',
        emitCrossFilters: chartProps.emitCrossFilters,
        setDataMask: chartProps.hooks.setDataMask,
        selectedFilters: chartProps.filterState.selectedFilters,
        verboseMap: {},
        columnFormats: {},
        currencyFormats: {},
        metricsLayout: 'ROWS',
        metricColorFormatters: expect.any(Function),
        dateFormatters: {
          col1: expect.any(Function),
        },
        onContextMenu: chartProps.hooks.onContextMenu,
        timeGrainSqla: chartProps.formData.timeGrainSqla,
      })
    );
  });

  it('should use getTimeFormatterForGranularity when SMART_DATE_ID and granularity are defined', () => {
    const result = transformProps(chartProps);

    expect(getTimeFormatterForGranularity).toHaveBeenCalledWith('P1D');
    expect(result.dateFormatters.col1('2023-08-01')).toBe(
      'formatted-granularity-2023-08-01'
    );
  });

  it('should use getTimeFormatter when SMART_DATE_ID and no granularity', () => {
    const modifiedChartProps = {
      ...chartProps,
      rawFormData: { ...chartProps.rawFormData, granularity_sqla: null },
    };

    const result = transformProps(modifiedChartProps);

    expect(getTimeFormatter).toHaveBeenCalledWith('DATABASE_DATETIME');
    expect(result.dateFormatters.col1('2023-08-01')).toBe(
      'formatted-2023-08-01'
    );
  });

  it('should handle custom date format', () => {
    const customFormatProps = {
      ...chartProps,
      formData: { ...chartProps.formData, dateFormat: 'YYYY-MM-DD' },
    };

    const result = transformProps(customFormatProps);

    expect(getTimeFormatter).toHaveBeenCalledWith('YYYY-MM-DD');
    expect(result.dateFormatters.col1('2023-08-01')).toBe(
      'formatted-2023-08-01'
    );
  });

  it('should return metricColorFormatters from getColorFormatters', () => {
    transformProps(chartProps);
    expect(getColorFormatters).toHaveBeenCalledWith(
      chartProps.formData.conditionalFormatting,
      chartProps.queriesData[0].data
    );
  });
});
