import transformProps from './transformProps';
import { GenericDataType } from '@superset-ui/core';

describe('transformProps', () => {
  it('should transform chartProps correctly', () => {
    const chartProps = {
      width: 800,
      height: 600,
      formData: {
        bottomMargin: 10,
        canvasImageRendering: 'pixelated',
        allColumnsX: 'column_x',
        allColumnsY: 'column_y',
        linearColorScheme: 'schemeBlues',
        leftMargin: 10,
        metric: 'value',
        normalized: false,
        showLegend: true,
        showPerc: true,
        showValues: true,
        sortXAxis: true,
        sortYAxis: true,
        xscaleInterval: '10',
        yscaleInterval: '20',
        yAxisBounds: [0, 100],
        yAxisFormat: '.2f',
        timeFormat: '%Y-%m-%d',
        currencyFormat: '$,.2f',
      },
      queriesData: [
        {
          data: [
            { column_x: '2023-01-01', column_y: 10, value: 100 },
            { column_x: '2023-01-02', column_y: 20, value: 200 },
          ],
          coltypes: [GenericDataType.Temporal, GenericDataType.Numeric],
        },
      ],
      datasource: {
        columnFormats: {},
        currencyFormats: {},
      },
    };

    const expectedTransformedProps = {
      width: 800,
      height: 600,
      data: [
        { column_x: '2023-01-01', column_y: 10, value: 100 },
        { column_x: '2023-01-02', column_y: 20, value: 200 },
      ],
      bottomMargin: 10,
      canvasImageRendering: 'pixelated',
      colorScheme: 'schemeBlues',
      columnX: 'column_x',
      columnY: 'column_y',
      leftMargin: 10,
      metric: 'value',
      normalized: false,
      showLegend: true,
      showPercentage: true,
      showValues: true,
      sortXAxis: true,
      sortYAxis: true,
      xScaleInterval: 10,
      yScaleInterval: 20,
      yAxisBounds: [0, 100],
      valueFormatter: expect.any(Function),
      xAxisFormatter: expect.any(Function),
      yAxisFormatter: expect.any(Function),
    };

    const result = transformProps(chartProps);

    expect(result).toEqual(expectedTransformedProps);

    // Additional checks for the formatters
    expect(result.valueFormatter(1234.56)).toBe('$1,234.56');
    expect(result.xAxisFormatter(new Date('2023-01-01'))).toBe('2023-01-01');
    expect(result.yAxisFormatter(1234.56)).toBe(1234.56);
  });
});
