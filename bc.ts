import { CategoricalColorNamespace, getNumberFormatter } from '@superset-ui/core';
import { DEFAULT_FORM_DATA } from './types';
import transformProps from './transformProps';
import { extractTimeseriesSeries, rebaseTimeseriesDatum } from '../utils/series';
import { transformSeries, getPadding, getTooltipFormatter, getXAxisFormatter } from '../Timeseries/transformers';

jest.mock('@superset-ui/core', () => ({
  CategoricalColorNamespace: {
    getScale: jest.fn().mockReturnValue(jest.fn()),
  },
  getNumberFormatter: jest.fn(),
}));

jest.mock('../utils/series', () => ({
  extractTimeseriesSeries: jest.fn(),
  rebaseTimeseriesDatum: jest.fn(),
}));

jest.mock('../Timeseries/transformers', () => ({
  transformSeries: jest.fn(),
  getPadding: jest.fn().mockReturnValue({}),
  getTooltipFormatter: jest.fn().mockReturnValue(jest.fn()),
  getXAxisFormatter: jest.fn().mockReturnValue(jest.fn()),
}));

describe('transformProps', () => {
  const defaultChartProps = {
    width: 800,
    height: 600,
    formData: {
      area: true,
      colorScheme: 'supersetColors',
      yAxisFormat: '.2f',
      xAxisTimeFormat: 'smart_date',
      annotationLayers: [],
    },
    queriesData: [
      {
        data: [],
        annotation_data: {},
      },
      {
        data: [],
      },
    ],
  };

  it('should return an object with echartOptions, width, and height', () => {
    const result = transformProps(defaultChartProps);

    expect(result).toHaveProperty('echartOptions');
    expect(result).toHaveProperty('width', 800);
    expect(result).toHaveProperty('height', 600);
  });

  it('should correctly configure the echartOptions', () => {
    const mockColorScale = jest.fn();
    CategoricalColorNamespace.getScale.mockReturnValue(mockColorScale);
    const mockFormatter = jest.fn();
    getNumberFormatter.mockReturnValue(mockFormatter);

    const result = transformProps(defaultChartProps);

    expect(result.echartOptions).toBeDefined();
    expect(result.echartOptions.series).toBeDefined();
    expect(result.echartOptions.grid).toBeDefined();
    expect(result.echartOptions.xAxis).toBeDefined();
    expect(result.echartOptions.yAxis).toBeDefined();
    expect(result.echartOptions.legend).toBeDefined();
    expect(result.echartOptions.tooltip).toBeDefined();
  });

  it('should call necessary utility functions with correct parameters', () => {
    const formData = {
      ...DEFAULT_FORM_DATA,
      colorScheme: 'supersetColors',
      yAxisFormat: '.2f',
    };
    const queriesData = [
      {
        data: [
          { key: 'value1' },
        ],
      },
      {
        data: [
          { key: 'value2' },
        ],
      },
    ];

    const chartProps = {
      ...defaultChartProps,
      formData,
      queriesData,
    };

    transformProps(chartProps);

    expect(rebaseTimeseriesDatum).toHaveBeenCalled();
    expect(extractTimeseriesSeries).toHaveBeenCalled();
    expect(transformSeries).toHaveBeenCalled();
    expect(getPadding).toHaveBeenCalled();
    expect(getTooltipFormatter).toHaveBeenCalledWith('smart_date');
    expect(getXAxisFormatter).toHaveBeenCalledWith('smart_date');
  });

  it('should handle annotation layers correctly', () => {
    const formData = {
      ...DEFAULT_FORM_DATA,
      annotationLayers: [
        {
          name: 'annotation1',
          show: true,
          annotationType: 'FORMULA',
        },
      ],
    };

    const chartProps = {
      ...defaultChartProps,
      formData,
    };

    const result = transformProps(chartProps);

    expect(result.echartOptions.series).toBeDefined();
    // Add more specific expectations depending on how annotations are transformed
  });

  // Add more test cases as necessary to cover other logic branches and edge cases
});
