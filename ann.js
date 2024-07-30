import {
  getMetricLabel,
  getNumberFormatter,
  getTimeFormatter,
  getTimeFormatterForGranularity,
  NumberFormats,
  QueryMode,
  smartDateFormatter,
  TimeFormats,
} from '@superset-ui/core';
import transformProps from './transformProps';
import { TableChartProps } from './types';

jest.mock('@superset-ui/core', () => ({
  ...jest.requireActual('@superset-ui/core'),
  getMetricLabel: jest.fn(x => x),
  getNumberFormatter: jest.fn(() => jest.fn()),
  getTimeFormatter: jest.fn(() => jest.fn()),
  getTimeFormatterForGranularity: jest.fn(() => jest.fn()),
}));

describe('transformProps', () => {
  const mockChartProps = (): TableChartProps => ({
    height: 400,
    width: 400,
    datasource: {
      columnFormats: {},
      verboseMap: {},
    },
    rawFormData: {
      table_timestamp_format: TimeFormats.DATABASE_DATETIME,
      time_grain_sqla: 'P1D',
      metrics: [],
      percent_metrics: [],
      column_config: {},
      align_pn: true,
      color_pn: true,
      show_cell_bars: true,
      include_search: false,
      page_length: null,
      table_filter: false,
      server_pagination: false,
      export_all_data: false,
      server_page_length: 10,
      order_desc: false,
      query_mode: QueryMode.Aggregate,
      show_totals: false,
      cellBgColor: {},
      columnNameAliasing: {},
      slice_id: '123',
    },
    queriesData: [
      {
        data: [],
        colnames: [],
        coltypes: [],
      },
      {
        data: [],
      },
    ],
    initialValues: {},
    ownState: {},
    hooks: {
      onAddFilter: jest.fn(),
      setDataMask: jest.fn(),
    },
  });

  it('should transform props correctly', () => {
    const chartProps = mockChartProps();
    const result = transformProps(chartProps);

    expect(result).toEqual(
      expect.objectContaining({
        height: chartProps.height,
        width: chartProps.width,
        isRawRecords: false,
        data: [],
        totals: undefined,
        columns: [],
        serverPagination: false,
        exportAllData: false,
        metrics: [],
        percentMetrics: [],
        serverPaginationData: {},
        setDataMask: expect.any(Function),
        alignPositiveNegative: true,
        colorPositiveNegative: true,
        showCellBars: true,
        sortDesc: false,
        includeSearch: false,
        rowCount: 0,
        pageSize: 0,
        filters: {},
        emitFilter: false,
        onChangeFilter: expect.any(Function),
        cellBgColor: {},
        columnNameAliasing: {},
        sliceId: '123',
      })
    );
  });

  it('should handle server pagination correctly', () => {
    const chartProps = mockChartProps();
    chartProps.rawFormData.server_pagination = true;
    chartProps.queriesData = [
      {
        data: [],
      },
      {
        data: [{ rowcount: 100 }],
      },
    ];

    const result = transformProps(chartProps);

    expect(result.rowCount).toBe(100);
    expect(result.pageSize).toBe(10);
  });

  it('should handle totals when show_totals is true and query_mode is Aggregate', () => {
    const chartProps = mockChartProps();
    chartProps.rawFormData.show_totals = true;
    chartProps.rawFormData.query_mode = QueryMode.Aggregate;
    chartProps.queriesData = [
      {
        data: [],
      },
      {
        data: [{ total: 100 }],
      },
    ];

    const result = transformProps(chartProps);

    expect(result.totals).toEqual({ total: 100 });
  });

  it('should handle different page length values correctly', () => {
    const chartProps = mockChartProps();
    chartProps.rawFormData.page_length = '20';

    const result = transformProps(chartProps);

    expect(result.pageSize).toBe(20);
  });

  it('should handle undefined data and columns', () => {
    const chartProps = mockChartProps();
    chartProps.queriesData = [];

    const result = transformProps(chartProps);

    expect(result.data).toEqual([]);
    expect(result.columns).toEqual([]);
  });
});
