import transformProps from './transformProps';
import { getNumberFormatter } from '@superset-ui/core';
import { getPadding, getXAxisFormatter, transformSeries } from './transformers';
import { extractTimeseriesSeries } from '../utils/series';

jest.mock('@superset-ui/core', () => ({
  getNumberFormatter: jest.fn(),
  isEventAnnotationLayer: jest.fn(),
  isFormulaAnnotationLayer: jest.fn(),
  isIntervalAnnotationLayer: jest.fn(),
  isTimeseriesAnnotationLayer: jest.fn(),
}));

jest.mock('./transformers', () => ({
  getPadding: jest.fn(),
  getXAxisFormatter: jest.fn(),
  transformSeries: jest.fn(),
}));

jest.mock('../utils/series', () => ({
  extractTimeseriesSeries: jest.fn(),
  dedupSeries: jest.fn(),
}));

describe('transformProps', () => {
  const mockChartProps = {
    width: 800,
    height: 600,
    formData: {
      area: false,
      annotationLayers: [],
      legendOrientation: 'top',
      legendType: 'scroll',
      markerEnabled: true,
      markerSize: 10,
      opacity: 0.5,
      seriesType: 'line',
      stack: false,
      showLegend: true,
      zoomable: true,
    },
    queriesData: [
      { annotation_data: {}, data: [{ x: 1, y: 100 }, { x: 2, y: 200 }] }, // first dataset
      { data: [{ x: 1, y: 300 }, { x: 2, y: 400 }] }, // second dataset
      { data: [{ x: 1, y: 500 }, { x: 2, y: 600 }] }, // third dataset
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return correct echartOptions with default settings', () => {
    (getNumberFormatter as jest.Mock).mockReturnValue((val: number) => `${val}%`);
    (extractTimeseriesSeries as jest.Mock).mockReturnValue([{ name: 'seriesA', data: [{ x: 1, y: 100 }] }]);
    (getPadding as jest.Mock).mockReturnValue({ top: 10, bottom: 10, left: 10, right: 10 });
    (getXAxisFormatter as jest.Mock).mockReturnValue((val: number) => `${val} formatted`);
    (transformSeries as jest.Mock).mockReturnValue({ name: 'transformedSeries' });

    const result = transformProps(mockChartProps);

    expect(result).toHaveProperty('echartOptions');
    expect(result.echartOptions).toEqual(
      expect.objectContaining({
        grid: expect.objectContaining({
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        }),
        xAxis: expect.objectContaining({
          axisLabel: expect.objectContaining({
            formatter: expect.any(Function),
          }),
        }),
        series: expect.arrayContaining([{ name: 'transformedSeries' }]),
      })
    );

    expect(getNumberFormatter).toHaveBeenCalledWith(',.0%');
    expect(getPadding).toHaveBeenCalledWith(
      mockChartProps.formData.showLegend,
      mockChartProps.formData.legendOrientation,
      expect.any(Boolean),
      mockChartProps.formData.zoomable
    );
  });

  test('should handle annotation layers correctly', () => {
    (extractTimeseriesSeries as jest.Mock).mockReturnValue([{ name: 'seriesA', data: [{ x: 1, y: 100 }] }]);
    (getNumberFormatter as jest.Mock).mockReturnValue((val: number) => `${val}%`);

    const annotationLayer = {
      show: true,
      name: 'annotationLayer',
      opacity: 0.5,
    };
    const mockPropsWithAnnotation = {
      ...mockChartProps,
      formData: {
        ...mockChartProps.formData,
        annotationLayers: [annotationLayer],
      },
    };

    const result = transformProps(mockPropsWithAnnotation);

    expect(result.echartOptions.series).toBeDefined();
    expect(result.echartOptions.series.length).toBeGreaterThan(0);
  });

  test('should return correct dimensions', () => {
    const result = transformProps(mockChartProps);

    expect(result.width).toBe(800);
    expect(result.height).toBe(600);
  });
});
