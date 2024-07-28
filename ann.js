jest.mock('@superset-ui/core', () => ({
  AnnotationType: {
    Formula: 'FORMULA',
    Timeseries: 'TIMESERIES',
  },
  isTimeseriesAnnotationResult: jest.fn(),
}));

describe('extractAnnotationLabels', () => {
  it('should extract formula and timeseries annotation labels correctly', () => {
    const layers = [
      { annotationType: 'FORMULA', show: true, name: 'formula1' },
      { annotationType: 'TIMESERIES', show: true, name: 'timeseries1' },
    ];

    const data = {
      timeseries1: [{ key: 'series1' }, { key: 'series2' }],
    };

    isTimeseriesAnnotationResult.mockReturnValue(true);

    const result = extractAnnotationLabels(layers, data);

    expect(result).toEqual(['formula1', 'series1', 'series2']);
  });

  it('should handle missing data correctly', () => {
    const layers = [{ annotationType: 'FORMULA', show: true, name: 'formula1' }];

    const result = extractAnnotationLabels(layers, {});

    expect(result).toEqual(['formula1']);
  });
});
