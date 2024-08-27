import transformProps from './transformProps';

describe('transformProps', () => {
  const baseChartProps = {
    width: 800,
    height: 600,
    datasource: {
      verboseMap: {
        metric_1: 'Metric 1',
        metric_2: 'Metric 2',
        group_1: 'Group 1',
        group_2: 'Group 2',
      },
    },
    formData: {
      colorScheme: 'scheme1',
      dateTimeFormat: '%Y-%m-%d',
      equalDateSize: true,
      groupby: ['group_1', 'group_2'],
      logScale: false,
      metrics: ['metric_1', 'metric_2'],
      numberFormat: '.2f',
      partitionLimit: '10',
      partitionThreshold: '5',
      richTooltip: true,
      timeSeriesOption: 'option1',
      sliceId: 123,
    },
    queriesData: [
      {
        data: [
          { group_1: 'A', metric_1: 100 },
          { group_1: 'B', metric_1: 200 },
        ],
      },
    ],
  };

  it('should transform props correctly', () => {
    const expectedOutput = {
      width: 800,
      height: 600,
      data: [
        { group_1: 'A', metric_1: 100 },
        { group_1: 'B', metric_1: 200 },
      ],
      colorScheme: 'scheme1',
      dateTimeFormat: '%Y-%m-%d',
      equalDateSize: true,
      levels: ['Group 1', 'Group 2'],
      metrics: ['metric_1', 'metric_2'],
      numberFormat: '.2f',
      partitionLimit: 10,
      partitionThreshold: 5,
      timeSeriesOption: 'option1',
      useLogScale: false,
      useRichTooltip: true,
      sliceId: 123,
    };

    const transformedProps = transformProps(baseChartProps);
    expect(transformedProps).toEqual(expectedOutput);
  });

  it('should handle missing partitionLimit and partitionThreshold', () => {
    const modifiedChartProps = {
      ...baseChartProps,
      formData: {
        ...baseChartProps.formData,
        partitionLimit: null,
        partitionThreshold: undefined,
      },
    };

    const expectedOutput = {
      width: 800,
      height: 600,
      data: [
        { group_1: 'A', metric_1: 100 },
        { group_1: 'B', metric_1: 200 },
      ],
      colorScheme: 'scheme1',
      dateTimeFormat: '%Y-%m-%d',
      equalDateSize: true,
      levels: ['Group 1', 'Group 2'],
      metrics: ['metric_1', 'metric_2'],
      numberFormat: '.2f',
      partitionLimit: null,
      partitionThreshold: null,
      timeSeriesOption: 'option1',
      useLogScale: false,
      useRichTooltip: true,
      sliceId: 123,
    };

    const transformedProps = transformProps(modifiedChartProps);
    expect(transformedProps).toEqual(expectedOutput);
  });

  it('should handle groupby without verboseMap', () => {
    const modifiedChartProps = {
      ...baseChartProps,
      datasource: { verboseMap: {} },
    };

    const expectedOutput = {
      width: 800,
      height: 600,
      data: [
        { group_1: 'A', metric_1: 100 },
        { group_1: 'B', metric_1: 200 },
      ],
      colorScheme: 'scheme1',
      dateTimeFormat: '%Y-%m-%d',
      equalDateSize: true,
      levels: ['group_1', 'group_2'],
      metrics: ['metric_1', 'metric_2'],
      numberFormat: '.2f',
      partitionLimit: 10,
      partitionThreshold: 5,
      timeSeriesOption: 'option1',
      useLogScale: false,
      useRichTooltip: true,
      sliceId: 123,
    };

    const transformedProps = transformProps(modifiedChartProps);
    expect(transformedProps).toEqual(expectedOutput);
  });
});
