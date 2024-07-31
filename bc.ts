import transformProps from './transformProps'; // Adjust the import path as needed
import { DEFAULT_FORM_DATA } from './types';
import { CategoricalColorNamespace, getNumberFormatter } from '@superset-ui/core';
import { extractTimeseriesSeries, rebaseTimeseriesDatum } from '../utils/series';
import { parseYAxisBound } from '../utils/controls';
import { extractProphetValuesFromTooltipParams, formatProphetTooltipSeries } from '../utils/prophet';
import { defaultGrid, defaultTooltip, defaultYAxis } from '../defaults';
import { TIMESERIES_CONSTANTS } from '../constants';

jest.mock('@superset-ui/core', () => ({
  CategoricalColorNamespace: {
    getScale: jest.fn(),
  },
  getNumberFormatter: jest.fn(),
}));

jest.mock('../utils/series', () => ({
  extractTimeseriesSeries: jest.fn(),
  rebaseTimeseriesDatum: jest.fn(),
}));

jest.mock('../utils/controls', () => ({
  parseYAxisBound: jest.fn(),
}));

jest.mock('../utils/prophet', () => ({
  extractProphetValuesFromTooltipParams: jest.fn(),
  formatProphetTooltipSeries: jest.fn(),
}));

jest.mock('../defaults', () => ({
  defaultGrid: { some: 'defaultGrid' },
  defaultTooltip: { some: 'defaultTooltip' },
  defaultYAxis: { some: 'defaultYAxis' },
}));

describe('transformProps', () => {
  const chartProps = {
    width: 800,
    height: 600,
    filterState: {},
    formData: {},
    hooks: {},
    queriesData: [{ data: [] }],
  };

  const mockColorScale = jest.fn();
  const mockFormatter = jest.fn();
  const mockRebasedData = [
    { __timestamp: '2021-01-01', value: 10 },
    { __timestamp: '2021-01-02', value: 20 },
  ];
  const mockRawSeries = [
    { name: 'series1', data: [[1609459200000, 10], [1609545600000, 20]] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (CategoricalColorNamespace.getScale as jest.Mock).mockReturnValue(mockColorScale);
    (getNumberFormatter as jest.Mock).mockReturnValue(mockFormatter);
    (rebaseTimeseriesDatum as jest.Mock).mockReturnValue(mockRebasedData);
    (extractTimeseriesSeries as jest.Mock).mockReturnValue(mockRawSeries);
    (parseYAxisBound as jest.Mock).mockImplementation(value => (value === undefined ? undefined : Number(value)));
  });

  it('should transform chart properties correctly with default formData', () => {
    const result = transformProps(chartProps);

    expect(result).toHaveProperty('echartOptions');
    expect(result).toHaveProperty('emitFilter', chartProps.hooks.emitFilter);
    expect(result).toHaveProperty('formData', { ...DEFAULT_FORM_DATA, ...chartProps.formData });
    expect(result).toHaveProperty('groupby', chartProps.formData.groupby);
    expect(result).toHaveProperty('height', chartProps.height);
    expect(result).toHaveProperty('labelMap');
    expect(result).toHaveProperty('selectedValues', {});
    expect(result).toHaveProperty('setDataMask', chartProps.hooks.setDataMask);
    expect(result).toHaveProperty('width', chartProps.width);
  });

  it('should handle annotations correctly', () => {
    const annotationLayer = {
      show: true,
      name: 'testAnnotation',
    };
    const chartPropsWithAnnotations = {
      ...chartProps,
      formData: {
        ...chartProps.formData,
        annotationLayers: [annotationLayer],
      },
    };

    const result = transformProps(chartPropsWithAnnotations);

    expect(result.echartOptions.series).toBeDefined();
  });

  it('should set correct color and opacity for series', () => {
    const chartPropsWithSeries = {
      ...chartProps,
      formData: {
        ...chartProps.formData,
        stack: true,
      },
      queriesData: [{ data: mockRebasedData }],
    };

    const result = transformProps(chartPropsWithSeries);

    expect(result.echartOptions.series[0]).toHaveProperty('type', 'line');
  });

  it('should handle tooltip formatting correctly', () => {
    const tooltipFormatter = jest.fn();
    (getTooltipTimeFormatter as jest.Mock).mockReturnValue(tooltipFormatter);
    
    const chartPropsWithTooltip = {
      ...chartProps,
      formData: {
        ...chartProps.formData,
        tooltipTimeFormat: '%Y-%m-%d',
      },
    };

    const result = transformProps(chartPropsWithTooltip);

    expect(result.echartOptions.tooltip.formatter).toBeDefined();
  });

  it('should set correct xAxis formatter', () => {
    const xAxisFormatter = jest.fn();
    (getXAxisFormatter as jest.Mock).mockReturnValue(xAxisFormatter);

    const chartPropsWithXAxis = {
      ...chartProps,
      formData: {
        ...chartProps.formData,
        xAxisTimeFormat: '%Y-%m-%d',
      },
    };

    const result = transformProps(chartPropsWithXAxis);

    expect(result.echartOptions.xAxis.axisLabel.formatter).toBe(xAxisFormatter);
  });
});
