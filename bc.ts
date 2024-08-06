import moment from 'moment';
import { transformSeries, transformFormulaAnnotation, transformIntervalAnnotation, transformEventAnnotation, transformTimeseriesAnnotation, getPadding, getTooltipFormatter, getXAxisFormatter } from './path/to/your/module'; // Adjust the import path as needed
import { ForecastSeriesEnum, LegendOrientation } from '../types';
import { AnnotationOpacity } from '@superset-ui/core';

// Mock dependencies if necessary
jest.mock('../utils/prophet', () => ({
  extractForecastSeriesContext: jest.fn(),
}));
jest.mock('../utils/annotation', () => ({
  evalFormula: jest.fn(),
  extractRecordAnnotations: jest.fn(),
  formatAnnotationLabel: jest.fn(),
  parseAnnotationOpacity: jest.fn(),
}));
jest.mock('../utils/series', () => ({
  getChartPadding: jest.fn(),
}));
jest.mock('@superset-ui/core', () => ({
  AnnotationOpacity: {
    Low: 0.3,
    Medium: 0.6,
    High: 0.9,
  },
  getTimeFormatter: jest.fn(),
  isTimeseriesAnnotationResult: jest.fn(),
  smartDateDetailedFormatter: jest.fn(),
  smartDateFormatter: {
    id: 'smart_date',
  },
}));

describe('transformSeries', () => {
  test('transforms series correctly for scatter plot', () => {
    const series = { name: 'series_name' };
    const opts = {
      area: false,
      forecastEnabled: false,
      markerEnabled: true,
      markerSize: 10,
      opacity: 0.5,
      seriesType: 'scatter',
      stack: false,
      richTooltip: false,
      yAxisIndex: 0,
    };

    const result = transformSeries(series, 'red', opts);

    expect(result).toMatchObject({
      type: 'scatter',
      smooth: false,
      symbolSize: 10,
      showSymbol: true,
    });
  });

  test('transforms series correctly for line plot with confidence band', () => {
    const series = { name: 'series_name' };
    const opts = {
      area: false,
      forecastEnabled: false,
      markerEnabled: false,
      markerSize: 0,
      opacity: 0.5,
      seriesType: 'line',
      stack: true,
      richTooltip: true,
      yAxisIndex: 0,
    };
    extractForecastSeriesContext.mockReturnValue({
      type: ForecastSeriesEnum.ForecastUpper,
      name: 'forecast_name',
    });

    const result = transformSeries(series, 'blue', opts);

    expect(result).toBeUndefined();
  });

  test('transforms series correctly for stacked bar plot', () => {
    const series = { name: 'series_name' };
    const opts = {
      area: false,
      forecastEnabled: false,
      markerEnabled: false,
      markerSize: 0,
      opacity: 0.5,
      seriesType: 'bar',
      stack: true,
      richTooltip: true,
      yAxisIndex: 0,
    };
    extractForecastSeriesContext.mockReturnValue({
      type: ForecastSeriesEnum.Observation,
      name: 'observation_name',
    });

    const result = transformSeries(series, 'green', opts);

    expect(result).toMatchObject({
      type: 'bar',
      stack: 'obs0',
    });
  });
});

describe('transformFormulaAnnotation', () => {
  test('transforms formula annotation correctly', () => {
    const layer = { name: 'formula', color: 'red', opacity: 0.5, width: 2, style: 'solid' };
    const data = [];
    const supersetColor = 'blue';

    const result = transformFormulaAnnotation(layer, data, supersetColor);

    expect(result).toMatchObject({
      name: 'formula',
      id: 'formula',
      itemStyle: { color: 'blue' },
      lineStyle: {
        opacity: 0.5,
        type: 'solid',
        width: 2,
      },
      type: 'line',
      smooth: true,
    });
  });
});

describe('transformIntervalAnnotation', () => {
  test('transforms interval annotation correctly', () => {
    const layer = { name: 'interval', color: 'red', opacity: 0.5 };
    const data = [];
    const annotationData = [];
    const supersetColor = 'blue';
    extractRecordAnnotations.mockReturnValue([{ descriptions: [], intervalEnd: '2023-01-02', time: '2023-01-01', title: 'Title' }]);

    const result = transformIntervalAnnotation(layer, data, annotationData, supersetColor);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'Interval - interval - Title',
      type: 'line',
      markArea: {
        silent: false,
        itemStyle: {
          color: 'blue',
          opacity: 0.5,
        },
        data: [[{ xAxis: '2023-01-01' }, { xAxis: '2023-01-02' }]],
      },
    });
  });
});

describe('transformEventAnnotation', () => {
  test('transforms event annotation correctly', () => {
    const layer = { name: 'event', color: 'red', opacity: 0.5, style: 'solid', width: 2 };
    const data = [];
    const annotationData = [];
    const supersetColor = 'blue';
    extractRecordAnnotations.mockReturnValue([{ descriptions: [], time: '2023-01-01', title: 'Title' }]);

    const result = transformEventAnnotation(layer, data, annotationData, supersetColor);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'Event - event - Title',
      type: 'line',
      markLine: {
        silent: false,
        symbol: 'none',
        lineStyle: {
          color: 'blue',
          opacity: 0.5,
          type: 'solid',
          width: 2,
        },
        data: [{ xAxis: '2023-01-01' }],
      },
    });
  });
});

describe('transformTimeseriesAnnotation', () => {
  test('transforms timeseries annotation correctly', () => {
    const layer = { name: 'timeseries', hideLine: false, opacity: 0.5, showMarkers: true, style: 'solid', width: 2 };
    const markerSize = 10;
    const data = [];
    const annotationData = { timeseries: [{ key: 'key1', values: [{ x: 1, y: 2 }] }] };
    isTimeseriesAnnotationResult.mockReturnValue(true);

    const result = transformTimeseriesAnnotation(layer, markerSize, data, annotationData);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      type: 'line',
      id: 'key1',
      name: 'key1',
      data: [[1, 2]],
      symbolSize: 10,
      lineStyle: {
        opacity: 0.5,
        type: 'solid',
        width: 2,
      },
    });
  });
});

describe('getPadding', () => {
  test('computes padding correctly', () => {
    const showLegend = true;
    const legendOrientation = LegendOrientation.Right;
    const addYAxisLabelOffset = true;
    const zoomable = true;
    const margin = { top: 10, bottom: 20, left: 30, right: 40 };

    const result = getPadding(showLegend, legendOrientation, addYAxisLabelOffset, zoomable, margin);

    expect(getChartPadding).toHaveBeenCalledWith(showLegend, legendOrientation, margin, {
      top: expect.any(Number),
      bottom: expect.any(Number),
      left: expect.any(Number),
      right: expect.any(Number),
    });
  });
});

describe('getTooltipFormatter', () => {
  test('returns smartDateDetailedFormatter for smart date format', () => {
    const format = 'smart_date';

    const result = getTooltipFormatter(format);

    expect(result).toBe(smartDateDetailedFormatter);
  });

  test('returns time formatter for custom format', () => {
    const format = 'custom_format';
    const mockFormatter = jest.fn();
    getTimeFormatter.mockReturnValue(mockFormatter);

    const result = getTooltipFormatter(format);

    expect(result).toBe(mockFormatter);
    expect(getTimeFormatter).toHaveBeenCalledWith('custom_format');
  });

  test('returns String formatter for no format', () => {
    const format = '';

    const result = getTooltipFormatter(format);

    expect(result).toBe(String);
  });
});

describe('getXAxisFormatter', () => {
  test('returns undefined for smart date format', () => {
    const format = 'smart_date';

    const result = getXAxisFormatter(format);

    expect(result).toBeUndefined();
  });

  test('returns time formatter for custom format', () => {
    const format = 'custom_format';
    const mockFormatter = jest.fn();
    getTimeFormatter.mockReturnValue(mockFormatter);

    const result = getXAxisFormatter(format);

    expect(result).toBe(mockFormatter);
    expect(getTimeFormatter).toHaveBeenCalledWith('custom_format');
  });

  test('returns String formatter for no format', () => {
    const format = '';

    const result = getXAxisFormatter(format);

    expect(result).toBeUndefined();
  });
});
