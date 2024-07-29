import transformProps from './transformProps';

describe('transformProps', () => {
  it('should transform chartProps correctly', () => {
    const chartProps = {
      height: 400,
      width: 800,
      formData: {
        horizonColorScale: 'schemeBlues',
        seriesHeight: '30',
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
      colorScale: 'schemeBlues',
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 3 },
      ],
      height: 400,
      seriesHeight: 30,
      width: 800,
    };

    const result = transformProps(chartProps);

    expect(result).toEqual(expectedTransformedProps);
  });
});
