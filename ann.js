import transformProps from './transformProps';

describe('transformProps', () => {
  it('should transform chartProps correctly', () => {
    const chartProps = {
      width: 800,
      height: 600,
      formData: {
        yAxisFormat: '.2f',
        colorScheme: 'd3Category10',
        sliceId: 123,
      },
      queriesData: [
        {
          data: [
            { metric1: 100, metric2: 200 },
            { metric1: 150, metric2: 250 },
          ],
        },
      ],
    };

    const expectedTransformedProps = {
      colorScheme: 'd3Category10',
      data: [
        { metric1: 100, metric2: 200 },
        { metric1: 150, metric2: 250 },
      ],
      height: 600,
      numberFormat: '.2f',
      width: 800,
      sliceId: 123,
    };

    const result = transformProps(chartProps);

    expect(result).toEqual(expectedTransformedProps);
  });
});
