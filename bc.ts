import { transformProps } from './transformProps'; // Adjust path as necessary
import { TableChartProps, TableChartTransformedProps } from './types'; // Adjust path as necessary

describe('transformProps', () => {

  const baseChartProps: TableChartProps = {
    height: 400,
    width: 600,
    rawFormData: {
      align_pn: true,
      color_pn: true,
      show_cell_bars: true,
      include_search: false,
      page_length: 10,
      server_pagination: false,
      export_all_data: false,
      server_page_length: 10,
      order_desc: false,
      query_mode: 'aggregate',
      show_totals: false,
      cellBgColor: 'white',
      columnNameAliasing: {},
      conditional_formatting: [],
      allow_rearrange_columns: false,
      slice_id: '123',
    },
    queriesData: [],
    filterState: { filters: {} },
    ownState: {},
    hooks: { onAddFilter: jest.fn(), setDataMask: jest.fn(), onContextMenu: jest.fn() },
    emitCrossFilters: false,
  };

  it('should transform props correctly when server pagination is false', () => {
    const chartProps: TableChartProps = {
      ...baseChartProps,
      queriesData: [{ data: [{ col1: 'value1' }], rowcount: 100 }],
    };

    const transformedProps = transformProps(chartProps);

    expect(transformedProps.height).toBe(400);
    expect(transformedProps.width).toBe(600);
    expect(transformedProps.data).toEqual([{ col1: 'value1' }]);
    expect(transformedProps.rowCount).toBe(100);
    expect(transformedProps.pageSize).toBe(10); // Assuming getPageSize returns 10
    expect(transformedProps.filters).toEqual({});
    expect(transformedProps.emitCrossFilters).toBe(false);
    expect(transformedProps.sliceId).toBe('123');
  });

  it('should handle server pagination correctly', () => {
    const chartProps: TableChartProps = {
      ...baseChartProps,
      rawFormData: {
        ...baseChartProps.rawFormData,
        server_pagination: true,
        server_page_length: 20,
      },
      queriesData: [
        { data: [{ col1: 'value1' }], rowcount: 100 },
        { data: [{ rowcount: 50 }] },
        { data: [{ rowcount: 150 }] },
      ],
    };

    const transformedProps = transformProps(chartProps);

    expect(transformedProps.rowCount).toBe(50); // Should use countQuery rowcount
    expect(transformedProps.pageSize).toBe(20); // Should use serverPageLength
  });

  it('should handle query mode and totals correctly', () => {
    const chartProps: TableChartProps = {
      ...baseChartProps,
      rawFormData: {
        ...baseChartProps.rawFormData,
        query_mode: 'aggregate',
        show_totals: true,
      },
      queriesData: [
        { data: [{ col1: 'value1' }], rowcount: 100 },
        { data: [{ total: 200 }] },
      ],
    };

    const transformedProps = transformProps(chartProps);

    expect(transformedProps.totals).toEqual({ total: 200 });
  });

  it('should apply column color formatters', () => {
    const chartProps: TableChartProps = {
      ...baseChartProps,
      rawFormData: {
        ...baseChartProps.rawFormData,
        conditional_formatting: [
          { column: 'col1', formatter: (value: any) => value === 'value1' ? 'red' : 'blue' },
        ],
      },
      queriesData: [{ data: [{ col1: 'value1' }] }],
    };

    const transformedProps = transformProps(chartProps);

    expect(transformedProps.columnColorFormatters).toBeDefined();
  });

  it('should handle default values correctly', () => {
    const chartProps: TableChartProps = {
      ...baseChartProps,
      rawFormData: {}, // Empty rawFormData
      queriesData: [{ data: [{ col1: 'value1' }], rowcount: 100 }],
    };

    const transformedProps = transformProps(chartProps);

    expect(transformedProps.alignPositiveNegative).toBe(true); // Default value
    expect(transformedProps.colorPositiveNegative).toBe(true); // Default value
    expect(transformedProps.showCellBars).toBe(true); // Default value
    expect(transformedProps.pageSize).toBe(10); // Default page length
  });

});
