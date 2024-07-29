import transformProps from './transformProps';

describe('transformProps', () => {
  it('should transform chartProps correctly', () => {
    const chartProps = {
      width: 800,
      height: 600,
      formData: {
        linearColorScheme: 'schemeBlues',
        numberFormat: '.2f',
        selectCountry: 'US',
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
      width: 800,
      height: 600,
      data: [
        { metric1: 100, metric2: 200 },
        { metric1: 150, metric2: 250 },
      ],
      country: 'us',
      linearColorScheme: 'schemeBlues',
      numberFormat: '.2f',
      colorScheme: 'd3Category10',
      sliceId: 123,
    };

    const result = transformProps(chartProps);

    expect(result).toEqual(expectedTransformedProps);
  });

  it('should handle missing selectCountry correctly', () => {
    const chartProps = {
      width: 800,
      height: 600,
      formData: {
        linearColorScheme: 'schemeBlues',
        numberFormat: '.2f',
        selectCountry: null,
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
      width: 800,
      height: 600,
      data: [
        { metric1: 100, metric2: 200 },
        { metric1: 150, metric2: 250 },
     
