import transformProps from './transformProps';

describe('transformProps', () => {
  it('should transform chartProps correctly', () => {
    const chartProps = {
      width: 800,
      height: 600,
      formData: {
        colorScheme: 'schemeBlues',
        linkLength: '5',
        normalized: false,
        cumulative: true,
        globalOpacity: 0.8,
        xAxisLabel: 'X Axis',
        yAxisLabel: 'Y Axis',
        showLegend: true,
        sliceId: 42,
      },
      queriesData: [
        {
          data: [
            { x: 1, y: 2 },
            { x: 2, y: 3 },
          ],
        },
      ],
    };

    const expectedTransformedProps = {
      width: 800,
      height: 600,
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
      ],
      binCount: 5,
      colorScheme: 'schemeBlues',
      normalized: false,
      cumulative: true,
      opacity: 0.8,
      xAxisLabel: 'X Axis',
      yAxisLabel: 'Y Axis',
      showLegend: true,
      sliceId: 42,
    };

    const result = transformProps(chartProps);

    expect(result).toEqual(expectedTransformedProps);
  });
});
