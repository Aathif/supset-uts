import transformProps from './transformProps'; // Adjust the import path as needed

describe('transformProps', () => {
  const defaultProps = {
    width: 800,
    height: 600,
    filterState: {},
    formData: {
      ...DEFAULT_FORM_DATA, // Ensure DEFAULT_FORM_DATA is imported or defined
      metrics: ['metric1'],
      groupby: ['groupby1'],
    },
    hooks: {
      setDataMask: jest.fn(),
    },
    queriesData: [
      {
        data: [{ groupby1: 'A', metric1: 10 }, { groupby1: 'B', metric1: 20 }],
        annotation_data: {},
      },
    ],
  };

  test('should return correct echartOptions', () => {
    const result = transformProps(defaultProps);

    expect(result).toHaveProperty('echartOptions');
    expect(result.echartOptions).toHaveProperty('barWidth');
    expect(result.echartOptions).toHaveProperty('xAxis');
    expect(result.echartOptions).toHaveProperty('yAxis');
    expect(result.echartOptions).toHaveProperty('tooltip');
    expect(result.echartOptions).toHaveProperty('legend');
    expect(result.echartOptions).toHaveProperty('series');
    expect(result.echartOptions).toHaveProperty('toolbox');
    expect(result.echartOptions).toHaveProperty('dataZoom');
  });

  test('should return correct selectedValues', () => {
    const result = transformProps(defaultProps);

    expect(result.selectedValues).toEqual({});
  });

  test('should handle empty queriesData gracefully', () => {
    const result = transformProps({
      ...defaultProps,
      queriesData: [{}],
    });

    expect(result.echartOptions.series).toEqual([]);
  });

  test('should handle custom formData', () => {
    const customFormData = {
      ...defaultProps.formData,
      colorScheme: ['#FF0000', '#00FF00'],
      showLegend: true,
      yAxisTitle: 'Custom Y Axis Title',
    };
    const result = transformProps({
      ...defaultProps,
      formData: customFormData,
    });

    expect(result.echartOptions.legend).toBeTruthy();
    expect(result.echartOptions.yAxis[0].name).toBe('Custom Y Axis Title');
  });
});
