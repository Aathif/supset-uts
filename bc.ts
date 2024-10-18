import { transformSeries } from './yourFile';
import { ForecastSeriesEnum } from '../types';
import { extractForecastSeriesContext } from '../utils/prophet';

jest.mock('../utils/prophet');

describe('transformSeries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSeries = { name: 'mock_series' };
  const color = 'blue';
  const opts = {
    area: true,
    forecastEnabled: true,
    markerEnabled: false,
    markerSize: 5,
    opacity: 0.5,
    seriesType: 'line',
    stack: true,
    richTooltip: false,
    yAxisIndex: 0,
  };

  test('should return undefined for confidence band when stack or area is true', () => {
    (extractForecastSeriesContext as jest.Mock).mockReturnValue({ type: ForecastSeriesEnum.ForecastLower });

    const result = transformSeries(mockSeries, color, opts);

    expect(result).toBeUndefined();
  });

  test('should return the correct series configuration for an observation series', () => {
    (extractForecastSeriesContext as jest.Mock).mockReturnValue({ type: ForecastSeriesEnum.Observation });

    const result = transformSeries(mockSeries, color, opts);

    expect(result).toEqual({
      ...mockSeries,
      yAxisIndex: 0,
      name: '',
      itemStyle: { color },
      type: 'scatter',
      smooth: false,
      step: undefined,
      stack: 'obs0',
      lineStyle: {},
      areaStyle: { opacity: 0.5 },
      showSymbol: true,
      symbolSize: 5,
    });
  });

  test('should return a line series with no symbols for non-observation series', () => {
    (extractForecastSeriesContext as jest.Mock).mockReturnValue({ type: ForecastSeriesEnum.ForecastTrend });

    const result = transformSeries(mockSeries, color, { ...opts, seriesType: 'line' });

    expect(result).toEqual({
      ...mockSeries,
      yAxisIndex: 0,
      name: '',
      itemStyle: { color },
      type: 'line',
      smooth: false,
      step: undefined,
      stack: 'trend',
      lineStyle: {},
      areaStyle: { opacity: 0.5 },
      showSymbol: false,
      symbolSize: 5,
    });
  });

  test('should return a bar series when seriesType is bar', () => {
    (extractForecastSeriesContext as jest.Mock).mockReturnValue({ type: ForecastSeriesEnum.Observation });

    const result = transformSeries(mockSeries, color, { ...opts, seriesType: 'bar' });

    expect(result).toEqual({
      ...mockSeries,
      yAxisIndex: 0,
      name: '',
      itemStyle: { color },
      type: 'bar',
      smooth: false,
      step: undefined,
      stack: 'obs0',
      lineStyle: {},
      areaStyle: { opacity: 0.5 },
      showSymbol: true,
      symbolSize: 5,
    });
  });
});
