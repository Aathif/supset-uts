import transformProps from './transformProps';
import { DEFAULT_FORM_DATA } from './types';
import { TIMESERIES_CONSTANTS } from '../constants';
import { extractTimeseriesSeries } from '../utils/series';
import { getNumberFormatter, CategoricalColorNamespace } from '@superset-ui/core';

jest.mock('@superset-ui/core', () => ({
  getNumberFormatter: jest.fn(),
  CategoricalColorNamespace: {
    getScale: jest.fn(),
  },
}));
jest.mock('../utils/series', () => ({
  extractTimeseriesSeries: jest.fn(),
  dedupSeries: jest.fn(series => series),
}));
jest.mock('../Timeseries/transformers', () => ({
  transformSeries: jest.fn(),
  getTooltipFormatter: jest.fn(),
  getXAxisFormatter: jest.fn(),
  getLegendProps: jest.fn(),
}));
jest.mock('../utils/prophet', () => ({
  extractProphetValuesFromTooltipParams: jest.fn(),
  formatProphetTooltipSeries: jest.fn(),
}));
jest.mock('../utils/annotation', () => ({
  extractAnnotationLabels: jest.fn(),
}));

describe('transformProps', () => {
  const chartProps = {
    width: 800,
    height: 600,
    formData: {
      annotationLayers: [],
      colorScheme: 'd3Category10',
      contributionMode: null,
      logAxis: false,
      markerEnabled: true,
      markerSize: 5,
      opacity: 0.2,
      seriesType: 'line',
      stack: false,
      tooltipTimeFormat: '%Y-%m-%d',
      yAxisFormat: '.2f',
      xAxisShowMinLabel: true,
      xAxisShowMaxLabel: true,
      xAxisTimeFormat: '%Y-%m',
      yAxisBounds: [null, null],
      yAxisTitle: 'Y Axis Title',
      zoomable: false,
      richTooltip: true,
      xAxisLabelRotation: 45,
    },
    queriesData: [
      {
        data: [{ x: 1, y: 2 }],
        annotation_data: {},
      },
    ],
  };

  beforeEach(() => {
    (extractTimeseriesSeries as jest.Mock).mockReturnValueOnce([{ name: 'series1', data: [] }]);
    (getNumberFormatter as jest.Mock).mockReturnValue(jest.fn(x => `${x}`));
    (CategoricalColorNamespace.getScale as jest.Mock).mockReturnValue(jest.fn(() => '#ff0000'));
  });

  it('should transform chartProps into ECharts options', () => {
    const result = transformProps(chartProps);

    expect(result).toEqual({
      echartOptions: expect.objectContaining({
        grid: expect.objectContaining({
          top: TIMESERIES_CONSTANTS.toolboxTop,
        }),
        xAxis: expect.objectContaining({
          axisLabel: expect.objectContaining({
            rotate: 45,
          }),
        }),
        yAxis: expect.any(Array),
        series: expect.any(Array),
        legend: expect.objectContaining({
          textStyle: expect.objectContaining({
            color: '#626D8A',
          }),
        }),
      }),
      width: 800,
      height: 600,
    });

    // Verify the formatter usage
    expect(getNumberFormatter).toHaveBeenCalledWith('.2f');
  });

  it('should handle annotations and multiple series', () => {
    chartProps.formData.annotationLayers = [
      { name: 'Event Layer', show: true, annotationType: 'event' },
    ];
    const annotationData = {
      'Event Layer': { x: 1, y: 2 },
    };

    chartProps.queriesData[0].annotation_data = annotationData;

    const result = transformProps(chartProps);

    expect(result.echartOptions.series).toHaveLength(1);
  });

  it('should handle custom color scheme', () => {
    chartProps.formData.colorScheme = 'customColorScheme';

    transformProps(chartProps);

    expect(CategoricalColorNamespace.getScale).toHaveBeenCalledWith('customColorScheme');
  });

  it('should format tooltip and X axis correctly', () => {
    const result = transformProps(chartProps);

    expect(result.echartOptions.tooltip).toHaveProperty('formatter');
    expect(result.echartOptions.xAxis.axisLabel).toHaveProperty('formatter');
  });
});
