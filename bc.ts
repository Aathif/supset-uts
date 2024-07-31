import transformProps from './transformProps';
import { CategoricalColorNamespace, getNumberFormatter, getTimeFormatter } from '@superset-ui/core';
import { extractGroupbyLabel, getColtypesMapping } from '../utils/series';

jest.mock('@superset-ui/core', () => ({
  CategoricalColorNamespace: {
    getScale: jest.fn(() => jest.fn(() => '#ff0000')),
  },
  getMetricLabel: jest.fn(metric => metric),
  getNumberFormatter: jest.fn(() => jest.fn(number => number.toString())),
  getTimeFormatter: jest.fn(() => jest.fn(date => date.toString())),
}));

jest.mock('../utils/series', () => ({
  extractGroupbyLabel: jest.fn(({ datum, groupby }) => groupby.map(col => datum[col]).join(',')),
  getColtypesMapping: jest.fn(() => ({})),
}));

const defaultGrid = {};
const defaultTooltip = {};
const defaultYAxis = {};

describe('transformProps', () => {
  it('should transform props correctly', () => {
    const chartProps = {
      width: 800,
      height: 600,
      formData: {
        colorScheme: 'd3Category10',
        groupby: ['country'],
        metrics: ['metric1'],
        numberFormat: 'SMART_NUMBER',
        dateFormat: 'smart_date',
        xTicksLayout: '45°',
        emitFilter: true,
      },
      hooks: {
        setDataMask: jest.fn(),
      },
      ownState: {
        selectedValues: [],
      },
      queriesData: [
        {
          data: [
            { country: 'USA', metric1__min: 1, metric1__q1: 2, metric1__median: 3, metric1__q3: 4, metric1__max: 5, metric1__mean: 3.5, metric1__count: 10, metric1__outliers: [6, 7] },
            { country: 'Canada', metric1__min: 2, metric1__q1: 3, metric1__median: 4, metric1__q3: 5, metric1__max: 6, metric1__mean: 4.5, metric1__count: 15, metric1__outliers: [7, 8] },
          ],
        },
      ],
    };

    const transformedProps = transformProps(chartProps);

    expect(transformedProps).toEqual(expect.objectContaining({
      formData: chartProps.formData,
      width: 800,
      height: 600,
      echartOptions: expect.objectContaining({
        grid: expect.any(Object),
        xAxis: expect.any(Object),
        yAxis: expect.any(Object),
        tooltip: expect.any(Object),
        series: expect.any(Array),
      }),
      setDataMask: chartProps.hooks.setDataMask,
      emitFilter: chartProps.formData.emitFilter,
      labelMap: {
        USA: ['USA'],
        Canada: ['Canada'],
      },
      groupby: chartProps.formData.groupby,
      selectedValues: {},
    }));

    const series = transformedProps.echartOptions.series;
    expect(series).toHaveLength(3); // 2 outlier series + 1 boxplot series

    // Verify series data structure
    expect(series[0]).toEqual(expect.objectContaining({
      name: 'boxplot',
      type: 'boxplot',
      data: expect.any(Array),
    }));

    expect(series[1]).toEqual(expect.objectContaining({
      name: 'outlier',
      type: 'scatter',
      data: expect.any(Array),
    }));

    expect(series[2]).toEqual(expect.objectContaining({
      name: 'outlier',
      type: 'scatter',
      data: expect.any(Array),
    }));
  });
});
