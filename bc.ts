import { CategoricalColorNamespace, getNumberFormatter } from '@superset-ui/core';
import transformProps from './transformProps';
import { DEFAULT_FORM_DATA } from './types';
import { ForecastSeriesEnum } from '../types';
import { parseYAxisBound } from '../utils/controls';
import { dedupSeries, extractTimeseriesSeries, getLegendProps } from '../utils/series';
import { extractAnnotationLabels } from '../utils/annotation';
import { extractProphetValuesFromTooltipParams, formatProphetTooltipSeries } from '../utils/prophet';
import { defaultGrid, defaultTooltip, defaultYAxis } from '../defaults';
import { getPadding, getTooltipFormatter, getXAxisFormatter, transformEventAnnotation, transformFormulaAnnotation, transformIntervalAnnotation, transformSeries, transformTimeseriesAnnotation } from '../Timeseries/transformers';
import { TIMESERIES_CONSTANTS } from '../constants';

jest.mock('@superset-ui/core', () => ({
  CategoricalColorNamespace: {
    getScale: jest.fn(),
  },
  getNumberFormatter: jest.fn(),
}));

jest.mock('../utils/controls', () => ({
  parseYAxisBound: jest.fn(),
}));

jest.mock('../utils/series', () => ({
  dedupSeries: jest.fn(),
  extractTimeseriesSeries: jest.fn(),
  getLegendProps: jest.fn(),
}));

jest.mock('../utils/annotation', () => ({
  extractAnnotationLabels: jest.fn(),
}));

jest.mock('../utils/prophet', () => ({
  extractProphetValuesFromTooltipParams: jest.fn(),
  formatProphetTooltipSeries: jest.fn(),
}));

jest.mock('../Timeseries/transformers', () => ({
  getPadding: jest.fn(),
  getTooltipFormatter: jest.fn(),
  getXAxisFormatter: jest.fn(),
  transformEventAnnotation: jest.fn(),
  transformFormulaAnnotation: jest.fn(),
  transformIntervalAnnotation: jest.fn(),
  transformSeries: jest.fn(),
  transformTimeseriesAnnotation: jest.fn(),
}));

describe('transformProps', () => {
  const chartProps = {
    width: 800,
    height: 600,
    formData: {
      annotationLayers: [],
      colorScheme: 'supersetColors',
      contributionMode: null,
      legendOrientation: 'top',
      legendType: 'scroll',
      logAxis: false,
      logAxisSecondary: false,
      markerEnabled: true,
      markerEnabledB: false,
      markerSize: 5,
      markerSizeB: 5,
      opacity: 0.2,
      opacityB: 0.4,
      minorSplitLine: false,
      seriesType: 'line',
      seriesTypeB: 'line',
      showLegend: true,
      stack: false,
      stackB: false,
      truncateYAxis: false,
      tooltipTimeFormat: '%d-%m-%Y',
      yAxisFormat: '.2f',
      yAxisFormatSecondary: '.2f',
      xAxisShowMinLabel: true,
      xAxisShowMaxLabel: true,
      xAxisTimeFormat: '%d-%m-%Y',
      yAxisBounds: [0, 100],
      yAxisIndex: 0,
      yAxisIndexB: 1,
      yAxisTitle: 'Primary Y Axis',
      yAxisTitleSecondary: 'Secondary Y Axis',
      zoomable: true,
      richTooltip: true,
      xAxisLabelRotation: 45,
    },
    queriesData: [
      {
        annotation_data: {},
        data: [{ key: 'value1' }, { key: 'value2' }],
      },
      {
        data: [{ key: 'value3' }, { key: 'value4' }],
      },
    ],
  };

  beforeEach(() => {
    (CategoricalColorNamespace.getScale as jest.Mock).mockReturnValue(jest.fn());
    (getNumberFormatter as jest.Mock).mockReturnValue(jest.fn());
    (parseYAxisBound as jest.Mock).mockReturnValue(undefined);
    (dedupSeries as jest.Mock).mockReturnValue([]);
    (extractTimeseriesSeries as jest.Mock).mockReturnValue([]);
    (getLegendProps as jest.Mock).mockReturnValue({});
    (extractAnnotationLabels as jest.Mock).mockReturnValue([]);
    (extractProphetValuesFromTooltipParams as jest.Mock).mockReturnValue({});
    (formatProphetTooltipSeries as jest.Mock).mockReturnValue('');
    (getPadding as jest.Mock).mockReturnValue({});
    (getTooltipFormatter as jest.Mock).mockReturnValue(jest.fn());
    (getXAxisFormatter as jest.Mock).mockReturnValue(jest.fn());
    (transformEventAnnotation as jest.Mock).mockReturnValue([]);
    (transformFormulaAnnotation as jest.Mock).mockReturnValue([]);
    (transformIntervalAnnotation as jest.Mock).mockReturnValue([]);
    (transformSeries as jest.Mock).mockReturnValue([]);
    (transformTimeseriesAnnotation as jest.Mock).mockReturnValue([]);
  });

  it('should transform chart properties', () => {
    const result = transformProps(chartProps);

    expect(result).toHaveProperty('echartOptions');
    expect(result).toHaveProperty('width', 800);
    expect(result).toHaveProperty('height', 600);
  });

  it('should handle series transformations', () => {
    const mockSeries = [{ name: 'series1' }, { name: 'series2' }];
    (extractTimeseriesSeries as jest.Mock).mockReturnValue(mockSeries);

    const result = transformProps(chartProps);

    expect(transformSeries).toHaveBeenCalledTimes(mockSeries.length * 2); // For both data1 and data2
  });

  it('should handle annotation transformations', () => {
    const mockAnnotationLayers = [{ show: true, name: 'annotation1' }];
    const mockAnnotationData = { annotation1: {} };
    chartProps.formData.annotationLayers = mockAnnotationLayers;
    chartProps.queriesData[0].annotation_data = mockAnnotationData;

    const result = transformProps(chartProps);

    expect(transformFormulaAnnotation).toHaveBeenCalled();
    expect(transformIntervalAnnotation).toHaveBeenCalled();
    expect(transformEventAnnotation).toHaveBeenCalled();
    expect(transformTimeseriesAnnotation).toHaveBeenCalled();
  });

  it('should handle yAxis bounds parsing', () => {
    (parseYAxisBound as jest.Mock).mockReturnValueOnce(0).mockReturnValueOnce(100);

    const result = transformProps(chartProps);

    expect(parseYAxisBound).toHaveBeenCalledTimes(2);
  });

  it('should handle tooltip formatting', () => {
    const mockTooltipFormatter = jest.fn();
    (getTooltipFormatter as jest.Mock).mockReturnValue(mockTooltipFormatter);

    const result = transformProps(chartProps);

    expect(mockTooltipFormatter).toHaveBeenCalled();
  });

  it('should handle xAxis formatting', () => {
    const mockXAxisFormatter = jest.fn();
    (getXAxisFormatter as jest.Mock).mockReturnValue(mockXAxisFormatter);

    const result = transformProps(chartProps);

    expect(mockXAxisFormatter).toHaveBeenCalled();
  });
});
