import transformProps from './transformProps';

describe('transformProps', () => {
  const mockChartProps = {
    width: 800,
    height: 600,
    formData: {
      colorScheme: 'blue',
      treemapRatio: 1.618,
      treeMapColorOptions: { someOption: true },
      numberFormat: null,
      metrics: ['metric1'],
    },
    queriesData: [{
      data: [
        { id: 'A', value: 100 },
        { id: 'B', value: 200 },
      ],
    }],
    datasource: {
      metrics: [
        {
          metric_name: 'metric1',
          d3format: '.2f',
        },
        {
          metric_name: 'metric2',
          d3format: '.3f',
        },
      ],
    },
  };

  test('should correctly transform chart props with numberFormat from datasource metrics', () => {
    const result = transformProps(mockChartProps);

    expect(result).toEqual({
      width: 800,
      height: 600,
      data: [
        { id: 'A', value: 100 },
        { id: 'B', value: 200 },
      ],
      colorScheme: 'blue',
      numberFormat: '.2f', // Derived from the datasource's metric1 d3format
      treemapRatio: 1.618,
      treeMapColorOptions: { someOption: true },
    });
  });

  test('should use formData numberFormat if available', () => {
    const customChartProps = {
      ...mockChartProps,
      formData: {
        ...mockChartProps.formData,
        numberFormat: '.1%', // Custom number format
      },
    };

    const result = transformProps(customChartProps);

    expect(result.numberFormat).toBe('.1%'); // Should prioritize formData's numberFormat
  });

  test('should return default values when numberFormat is missing', () => {
    const noMetricsChartProps = {
      ...mockChartProps,
      datasource: { metrics: [] },
    };

    const result = transformProps(noMetricsChartProps);

    expect(result.numberFormat).toBe(null); // No numberFormat found
  });
});
